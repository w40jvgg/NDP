from pathlib import Path
from bs4 import BeautifulSoup
import re, sys
root = Path(__file__).resolve().parents[1]
errors=[]
for html in [root/'index.html', root/'service/index.html']:
    text=html.read_text(encoding='utf-8')
    soup=BeautifulSoup(text,'html.parser')
    ids={}
    for tag in soup.find_all(id=True):
        ids[tag['id']]=ids.get(tag['id'],0)+1
    dup=[k for k,v in ids.items() if v>1]
    if dup: errors.append(f'{html.relative_to(root)} duplicate ids: {dup}')
    for tag,attr in [('script','src'),('link','href'),('img','src'),('source','srcset')]:
        for node in soup.find_all(tag):
            val=node.get(attr)
            if not val: continue
            items=[val]
            if attr=='srcset': items=[x.strip().split()[0] for x in val.split(',')]
            for item in items:
                if item.startswith(('http://','https://','data:','#','mailto:','tel:')): continue
                item=item.split('?',1)[0].split('#',1)[0]
                if not item: continue
                target=(html.parent/item).resolve()
                if not target.exists(): errors.append(f'{html.relative_to(root)} missing {item}')

required=[
    root/'service/core/config.js', root/'service/core/domain.js', root/'service/core/storage.js',
    root/'service/core/api-demo.js', root/'service/core/api-client.js', root/'manifest.md', root/'glossary.md',
    root/'docs/adna.md', root/'docs/ndt.md', root/'docs/architecture.md', root/'docs/api.md'
]
for path in required:
    if not path.exists(): errors.append(f'missing required file: {path.relative_to(root)}')

app=(root/'service/app.js').read_text(encoding='utf-8')
config=(root/'service/core/config.js').read_text(encoding='utf-8')
if 'thresholds:' not in config or 'same:' not in config or 'derivative:' not in config: errors.append('ADNA thresholds missing from core config')
if re.search(r"similarity\s*>=\s*\.90|similarity\s*>=\s*\.75", app): errors.append('duplicated ADNA thresholds found in app.js')

print('Static verification:', 'OK' if not errors else 'FAILED')
if errors:
    for e in errors: print('-',e)
    sys.exit(1)
print('Checked local references, duplicate IDs, V2 core files and threshold centralization.')
