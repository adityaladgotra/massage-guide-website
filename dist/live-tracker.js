(()=>{'use strict';
  const base=(window.LIVE_ANALYTICS_URL||'').replace(/\/$/,'');
  if(!base || location.pathname.startsWith('/live')) return;
  const sid=(()=>{try{let v=sessionStorage.getItem('lm_sid');if(!v){v=crypto.randomUUID();sessionStorage.setItem('lm_sid',v)}return v}catch{return crypto.randomUUID()}})();
  const since=Date.now();let last=Date.now(), lastScroll=-1, pending=0, engagement=0, prev=Date.now();
  const region=(()=>{const p=new URLSearchParams(location.search);return {src:(p.get('utm_source')||document.referrer?.split('/')[2]||'direct').slice(0,80),creative:(p.get('utm_content')||p.get('ts_creative')||'').slice(0,80),device:/Mobi|Android|iPhone/i.test(navigator.userAgent)?'mobile':/iPad|Tablet/i.test(navigator.userAgent)?'tablet':'desktop'}})();
  const track=(type,more={})=>{const body=JSON.stringify({sid,type,t:Date.now(),...region,...more});try{fetch(base+'/event',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true,mode:'cors'}).catch(()=>{})}catch{}};
  const active=()=>document.visibilityState==='visible' && Date.now()-last<60000;
  const tick=()=>{if(document.hidden)return;const now=Date.now();if(active())engagement+=Math.min(20,Math.max(0,(now-prev)/1000));prev=now;track('heartbeat',{elapsed:Math.round((now-since)/1000),engaged:Math.round(engagement),visible:document.visibilityState==='visible'})};
  track('view',{url:location.pathname});
  ['pointerdown','keydown','scroll','touchstart'].forEach(e=>window.addEventListener(e,()=>{last=Date.now()},{passive:true}));
  let scrollTimer;
  window.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{const doc=document.documentElement;const total=Math.max(1,doc.scrollHeight-window.innerHeight);const depth=Math.round(Math.min(100,Math.max(0,window.scrollY/total*100)));if(Math.floor(depth/10)>Math.floor(lastScroll/10)){lastScroll=depth;track('scroll',{depth})}},180)},{passive:true});
  const buttons=[...document.querySelectorAll('[data-checkout]')];buttons.forEach((el,i)=>el.setAttribute('data-live-button','BUY-'+String(i+1).padStart(2,'0')));
  document.addEventListener('click',e=>{const node=e.target.closest('a,button,summary');if(!node)return;
    const buy=node.closest('[data-checkout]');if(buy){track('buy_click',{button:buy.getAttribute('data-live-button')||'buy',label:(buy.textContent||'').trim().slice(0,55),elapsed:Math.round((Date.now()-since)/1000),depth:lastScroll<0?0:lastScroll});return}
    const label=(node.textContent||node.getAttribute('aria-label')||'').trim().slice(0,55);
    if(node.matches('summary'))track('faq_click',{label});else if(node.closest('a')&&node.getAttribute('href')?.startsWith('http'))track('outbound_click',{label});
  },true);
  document.addEventListener('visibilitychange',()=>{prev=Date.now();track('visibility',{visible:!document.hidden,elapsed:Math.round((Date.now()-since)/1000)});if(document.hidden)track('leave',{elapsed:Math.round((Date.now()-since)/1000),engaged:Math.round(engagement),reason:'hidden'})});
  window.addEventListener('pagehide',()=>track('leave',{elapsed:Math.round((Date.now()-since)/1000),engaged:Math.round(engagement),reason:'pagehide'}));
  setInterval(tick,15000); // live status uses 45-second inactivity timeout
})();
