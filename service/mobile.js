(() => {
  'use strict';
  const mobile=window.matchMedia('(max-width: 900px)');
  const sidebar=document.getElementById('sidebar'),openButton=document.getElementById('sidebar-open'),closeButton=document.getElementById('sidebar-close');
  if(!sidebar)return;
  const setOpen=open=>{if(!mobile.matches)open=false;sidebar.classList.toggle('open',open);document.body.classList.toggle('mobile-drawer-open',open);openButton?.setAttribute('aria-expanded',String(open))};
  openButton?.setAttribute('aria-controls','sidebar');openButton?.setAttribute('aria-expanded','false');openButton?.addEventListener('click',()=>requestAnimationFrame(()=>setOpen(true)));closeButton?.addEventListener('click',()=>setOpen(false));sidebar.querySelectorAll('.side-link').forEach(link=>link.addEventListener('click',()=>{if(mobile.matches)setOpen(false)}));
  document.addEventListener('click',e=>{if(!mobile.matches||!sidebar.classList.contains('open'))return;if(e.target.closest('#sidebar')||e.target.closest('#sidebar-open'))return;setOpen(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebar.classList.contains('open'))setOpen(false)});
  let sx=0,sy=0;sidebar.addEventListener('touchstart',e=>{if(!mobile.matches||e.touches.length!==1)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});sidebar.addEventListener('touchend',e=>{if(!mobile.matches||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(dx<-52&&Math.abs(dx)>Math.abs(dy)*1.2)setOpen(false)},{passive:true});mobile.addEventListener?.('change',()=>{if(!mobile.matches)setOpen(false)});
  const viewport=window.visualViewport;const syncViewport=()=>{const h=viewport?.height||window.innerHeight;document.documentElement.style.setProperty('--ndp-visual-height',h+'px')};viewport?.addEventListener('resize',syncViewport,{passive:true});window.addEventListener('orientationchange',syncViewport,{passive:true});syncViewport();
})();
