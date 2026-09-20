(() => {
  'use strict';
  const mobile=window.matchMedia('(max-width: 680px)');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav=document.querySelector('.nav-links');
  const navToggle=document.querySelector('[data-nav-toggle]');
  const closeNav=()=>{if(!nav)return;nav.classList.remove('open');navToggle?.setAttribute('aria-expanded','false')};
  document.addEventListener('click',e=>{if(!mobile.matches||!nav?.classList.contains('open'))return;if(e.target.closest('.nav-links')||e.target.closest('[data-nav-toggle]'))return;closeNav()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});

  const story=document.querySelector('[data-story]');
  const deck=story?.querySelector('.story-copy-deck');
  const canvas=story?.querySelector('.story-canvas');
  const copies=[...(story?.querySelectorAll('.story-copy-panel[data-copy-stage]')||[])];
  const visuals=[...(story?.querySelectorAll('.story-visual-panel[data-visual-stage]')||[])];
  const rails=[...(story?.querySelectorAll('.story-rail-step[data-rail-stage]')||[])];
  const bars=[...(story?.querySelectorAll('.story-progress i')||[])];
  const indexes=[...(story?.querySelectorAll('.story-index span')||[])];
  const number=story?.querySelector('#story-step-number'),current=story?.querySelector('#story-current'),result=story?.querySelector('#story-result'),system=story?.querySelector('#story-stage-system');
  const meta=[
    ['Аудиофайл → объект произведения','Звук → объект','SYSTEM / AUDIO OBJECT','#8b5cf6'],['NDT → авторы / доли / лицензии','Объект → права','SYSTEM / RIGHTS PASSPORT','#33d6ff'],['ADNA → similarity → verdict','Звук → идентичность','SYSTEM / FINGERPRINT ENGINE','#2de2c4'],['Original → Sample / Remix / Derivative','ID → происхождение','SYSTEM / PROVENANCE GRAPH','#f5b94c'],['Usage event → identified work','Использование → событие','SYSTEM / USAGE RESOLVER','#f472b6'],['Rights graph → splits → amount','Событие → расчёт','SYSTEM / ROYALTY ENGINE','#33d6ff'],['Royalty flow → rights holders','Расчёт → распределение','SYSTEM / CASCADE ROYALTY','#f5b94c'],['Recipients → payment rail','Распределение → выплата','SYSTEM / PAYMENT LAYER','#2de2c4']
  ];
  let stage=0;
  const resizeDeck=active=>{if(!deck||!active||!mobile.matches)return;requestAnimationFrame(()=>{deck.style.height=Math.max(250,active.scrollHeight+6)+'px'})};
  const applyStage=next=>{if(!story||!mobile.matches||reduce.matches)return;stage=Math.max(0,Math.min(meta.length-1,next));story.dataset.storyStage=String(stage);story.style.setProperty('--stage-accent',meta[stage][3]);copies.forEach((p,i)=>{const a=i===stage;p.classList.toggle('mobile-active',a);p.setAttribute('aria-hidden',a?'false':'true')});visuals.forEach((p,i)=>{const a=i===stage;p.classList.toggle('mobile-active',a);p.classList.toggle('is-visible',a)});rails.forEach((p,i)=>{p.classList.toggle('active',i===stage);p.classList.toggle('done',i<stage)});bars.forEach((p,i)=>{p.classList.toggle('is-active',i===stage);p.classList.toggle('is-done',i<stage)});indexes.forEach((p,i)=>p.classList.toggle('active',i===stage));if(number)number.textContent=String(stage+1).padStart(2,'0');if(current)current.textContent=meta[stage][0];if(result)result.textContent=meta[stage][1];if(system)system.textContent=meta[stage][2];resizeDeck(copies[stage])};
  rails.forEach((p,i)=>{p.setAttribute('role','button');p.setAttribute('tabindex','0');p.addEventListener('click',()=>applyStage(i));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();applyStage(i)}})});
  const addSwipe=el=>{if(!el)return;let sx=0,sy=0;el.addEventListener('touchstart',e=>{if(!mobile.matches||reduce.matches||e.touches.length!==1)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});el.addEventListener('touchend',e=>{if(!mobile.matches||reduce.matches||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)<44||Math.abs(dx)<Math.abs(dy)*1.18)return;applyStage(stage+(dx<0?1:-1))},{passive:true})};
  addSwipe(canvas);addSwipe(deck);
  const sync=()=>{if(mobile.matches&&!reduce.matches){const initial=Number(story?.dataset.storyStage||0);applyStage(Number.isFinite(initial)?initial:0)}else if(deck){deck.style.height='';copies.forEach(p=>p.classList.remove('mobile-active'));visuals.forEach(p=>p.classList.remove('mobile-active'))}};
  mobile.addEventListener?.('change',sync);reduce.addEventListener?.('change',sync);window.addEventListener('resize',()=>{if(mobile.matches&&!reduce.matches)resizeDeck(copies[stage])},{passive:true});sync();
})();
