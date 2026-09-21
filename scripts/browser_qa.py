from pathlib import Path
import json, os, shutil, subprocess, time, urllib.request
import websocket

ROOT=Path(__file__).resolve().parents[1]
PORT=8765
DEBUG=9223
errors=[]
events=[]

server=subprocess.Popen(['python','-m','http.server',str(PORT),'--bind','127.0.0.1'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
# wait until static server is reachable
wait_end=time.time()+5
while time.time()<wait_end:
    try:
        urllib.request.urlopen(f'http://127.0.0.1:{PORT}/index.html',timeout=.5).read(16); break
    except Exception: time.sleep(.1)
else: raise RuntimeError('static server not available')

profile='/tmp/ndp_chrome_qa'
shutil.rmtree(profile,ignore_errors=True)
chrome=subprocess.Popen(['chromium','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={DEBUG}','--remote-allow-origins=*',f'--user-data-dir={profile}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

def wait_json(url, timeout=10):
    end=time.time()+timeout
    while time.time()<end:
        try:
            with urllib.request.urlopen(url,timeout=1) as r: return json.load(r)
        except Exception: time.sleep(.1)
    raise RuntimeError('CDP not available')

try:
    tabs=wait_json(f'http://127.0.0.1:{DEBUG}/json')
    ws=websocket.create_connection(tabs[0]['webSocketDebuggerUrl'],timeout=5)
    next_id=1
    def cmd(method, params=None):
        global next_id
        i=next_id; next_id+=1
        ws.send(json.dumps({'id':i,'method':method,'params':params or {}}))
        while True:
            msg=json.loads(ws.recv())
            if msg.get('method') in ('Runtime.exceptionThrown','Log.entryAdded'):
                events.append(msg)
            if msg.get('id')==i:
                if 'error' in msg: raise RuntimeError(msg['error'])
                return msg.get('result',{})
    cmd('Runtime.enable'); cmd('Log.enable'); cmd('Page.enable')
    def evaljs(code):
        res=cmd('Runtime.evaluate',{'expression':code,'returnByValue':True,'awaitPromise':True})
        if 'exceptionDetails' in res: errors.append(f'JS evaluation exception: {res["exceptionDetails"]}')
        return res.get('result',{}).get('value')
    def viewport(width,height):
        cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':width<600})
    def navigate(url):
        cmd('Page.navigate',{'url':url}); time.sleep(1.2)
    def check_overflow(label):
        val=evaljs('({innerWidth,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth,ok:document.documentElement.scrollWidth<=innerWidth+1 && document.body.scrollWidth<=innerWidth+1})')
        if not val or not val['ok']: errors.append(f'{label}: horizontal overflow {val}')

    viewport(1440,1000); navigate(f'http://127.0.0.1:{PORT}/index.html'); check_overflow('landing desktop')
    if not evaljs("!!document.querySelector('a[href=\"service/index.html\"][data-ndp-transition]')"):
        errors.append('landing service link missing at '+str(evaljs('document.URL')))
    viewport(390,844); cmd('Page.reload'); time.sleep(1); check_overflow('landing mobile 390')
    # service desktop
    viewport(1440,1000); navigate(f'http://127.0.0.1:{PORT}/service/index.html'); check_overflow('service auth desktop')
    if not evaljs("!!window.NDPV2 && NDPV2.config.appVersion==='2.0.0'"): errors.append('NDPV2 core not loaded')
    evaljs("document.querySelector('#demo-login').click(); true"); time.sleep(.8)
    if not evaljs("!document.querySelector('#app-shell').classList.contains('hidden')"): errors.append('demo login failed')
    check_overflow('service dashboard desktop')
    # navigate primary sections through UI buttons
    for view in ['verify','registry','register-track','royalties','how-it-works','developers','account','settings']:
        ok=evaljs(f"(()=>{{const b=document.querySelector('[data-view=\\\"{view}\\\"]'); if(!b)return false;b.click();return document.querySelector('[data-view-section=\\\"{view}\\\"]').classList.contains('active')}})()")
        if not ok: errors.append(f'navigation failed: {view}')
        check_overflow(f'service {view} desktop')
    # provenance graph
    evaljs("document.querySelector('[data-view=\"registry\"]').click(); true"); time.sleep(.2)
    if not evaljs("document.querySelectorAll('#provenance-live-graph .provenance-node').length>0"): errors.append('provenance graph not rendered')
    # royalty engine UI
    evaljs("document.querySelector('[data-view=\"royalties\"]').click();document.querySelector('#calculate-royalty-demo').click();true"); time.sleep(.3)
    if not evaljs("document.querySelector('#royalty-payment-state').textContent.includes('Payment Prepared')"): errors.append('royalty/payment demo did not run')
    # backup settings controls exist
    evaljs("document.querySelector('[data-view=\"settings\"]').click(); true")
    if not evaljs("!!document.querySelector('#export-backup') && !!document.querySelector('#import-backup')"): errors.append('backup controls missing')
    # mobile after login
    viewport(390,844); cmd('Page.reload'); time.sleep(1)
    check_overflow('service mobile 390')
    for view in ['dashboard','verify','registry','register-track','royalties','how-it-works','messages','developers','account','settings']:
        selector = '#top-messages-button' if view=='messages' else f'[data-view="{view}"]'
        ok=evaljs(f"(()=>{{const b=document.querySelector('{selector}');if(!b)return false;b.click();return document.querySelector('[data-view-section=\\\"{view}\\\"]').classList.contains('active')}})()")
        if not ok: errors.append(f'mobile navigation failed: {view}')
        check_overflow(f'service {view} mobile')
    # theme changes
    before=evaljs("document.documentElement.dataset.theme")
    evaljs("document.querySelector('#theme-toggle').click();true")
    after=evaljs("document.documentElement.dataset.theme")
    if before==after: errors.append('theme toggle failed')
    # runtime exceptions/log severe
    for e in events:
        if e.get('method')=='Runtime.exceptionThrown': errors.append('Runtime exception: '+json.dumps(e.get('params',{}),ensure_ascii=False)[:500])
        if e.get('method')=='Log.entryAdded' and e.get('params',{}).get('entry',{}).get('level')=='error': errors.append('Console error: '+e['params']['entry'].get('text',''))
    print('Browser QA:', 'OK' if not errors else 'FAILED')
    if errors:
        for e in errors: print('-',e)
        raise SystemExit(1)
    print('Desktop 1440 and mobile 390: navigation, overflow, provenance, royalty, backup controls and theme checked.')
finally:
    try: ws.close()
    except Exception: pass
    chrome.terminate(); server.terminate()
    try: chrome.wait(timeout=3)
    except Exception: chrome.kill()
    try: server.wait(timeout=3)
    except Exception: server.kill()
