(()=>{
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches;
 try{paused=paused||sessionStorage.getItem('carrie-motion')==='off'}catch{}
 const running=new Set();
 function animate(el,frames,options){
   if(paused||!el.animate)return;
   const a=el.animate(frames,{duration:850,easing:'cubic-bezier(.16,1,.3,1)',...options});
   running.add(a);a.finished.catch(()=>{}).finally(()=>running.delete(a));
 }
 function start(){
   const root=document.querySelector('#dc-root');
   if(!root||!root.querySelector('nav'))return false;
   if(document.getElementById('motion-toggle'))return true;
   const bar=document.createElement('div');bar.className='motion-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);
   const toggle=document.createElement('button');toggle.id='motion-toggle';toggle.className='motion-toggle';toggle.type='button';document.body.append(toggle);
   function sync(){
     document.documentElement.classList.toggle('motion-paused',paused);
     toggle.textContent=paused?'Motion: off':'Motion: on';toggle.setAttribute('aria-pressed',String(!paused));
     toggle.setAttribute('aria-label',paused?'Enable page animations':'Pause page animations');
     if(paused){for(const a of running)a.cancel();root.getAnimations({subtree:true}).forEach(a=>a.cancel())}
   }
   toggle.addEventListener('click',()=>{paused=!paused;try{sessionStorage.setItem('carrie-motion',paused?'off':'on')}catch{}sync()});
   reduced.addEventListener('change',e=>{paused=e.matches;sync()});sync();
   const nav=root.querySelector('nav');nav.classList.add('motion-nav');
   const hero=root.querySelector('header');
   if(hero){
     hero.classList.add('motion-hero');
     hero.querySelectorAll('h1').forEach(el=>animate(el,[{opacity:0,transform:'translateY(65px) rotate(-3deg)',clipPath:'inset(100% 0 0 0)'},{opacity:1,transform:'none',clipPath:'inset(0)'}],{duration:1100}));
     const first=hero.firstElementChild;
     if(first)[...first.children].filter(e=>e.tagName!=='H1').forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(25px)'},{opacity:1,transform:'none'}],{delay:120+i*90,duration:800,fill:'backwards'}));
     hero.querySelectorAll('img').forEach(img=>{img.parentElement.classList.add('motion-image-frame');animate(img,[{transform:'scale(1.18)',filter:'blur(5px)'},{transform:'scale(1.025)',filter:'blur(0)'}],{duration:1500})});
   }
   const cards=[...root.querySelectorAll('section > a')].filter(a=>a.querySelector('h2'));
   cards.forEach(c=>c.classList.add('motion-card'));
   if(hero&&cards.length>=4){
     const ribbon=document.createElement('div');ribbon.className='motion-ribbon';ribbon.setAttribute('aria-hidden','true');
     const track=document.createElement('div');track.className='motion-ribbon-track';
     const group=document.createElement('div');group.className='motion-ribbon-group';
     ['Aqua','Data Centers','Overdevelopment','Concrete','Guns and Gums'].forEach(t=>{const item=document.createElement('span');item.textContent=t;const star=document.createElement('i');star.textContent='✳';group.append(item,star)});
     track.append(group,group.cloneNode(true));ribbon.append(track);hero.after(ribbon);
   }
   const targets=[...root.querySelectorAll('section,footer')].flatMap(e=>e.querySelector('.motion-card')?[...e.children]:[e]);
   const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
     if(!isIntersecting)return;observer.unobserve(target);
     animate(target,[{opacity:.15,transform:'translateY(46px)'},{opacity:1,transform:'none'}],{duration:900});
   }),{threshold:.08});
   targets.forEach(el=>observer.observe(el));
   let queued=false;
   function update(){queued=false;const total=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${total>0?Math.min(1,scrollY/total):0})`}
   addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
   return true;
 }
 // The supplied HTML bundles replace their document before mounting the page.
 if(!start()){
   const watcher=new MutationObserver(()=>{if(start())watcher.disconnect()});
   watcher.observe(document.documentElement,{childList:true,subtree:true});
   setTimeout(()=>watcher.disconnect(),30000);
 }
})();
