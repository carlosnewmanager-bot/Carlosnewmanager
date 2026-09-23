document.documentElement.classList.add('js');
const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('.mobile-menu');
const closeMenu=()=>{menu?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');};
if(toggle&&menu){
 toggle.addEventListener('click',()=>toggle.setAttribute('aria-expanded',String(menu.classList.toggle('open'))));
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){closeMenu();toggle.focus();}});
}
document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
const film=document.querySelector('#brand-film');
const video=document.querySelector('#brand-film-video');
if(film&&video){
 const compact=matchMedia('(max-width:980px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const fallback=film.querySelector('.motion-fallback');
 let failed=false,initialPlays=0,initialComplete=false,hovering=false,inView=false;
 const play=()=>{if(!document.hidden&&inView&&!reduced.matches&&!failed)video.play().catch(()=>{failed=true;update();});};
 const update=()=>{
  video.hidden=reduced.matches||failed;fallback.style.display=video.hidden?'block':'none';
  if(video.hidden||(!hovering&&initialComplete))video.pause();else play();
 };
 video.loop=false;
 video.addEventListener('ended',()=>{
  if(hovering){video.currentTime=0;play();return;}
  initialPlays++;
  if(initialPlays<2){video.currentTime=0;play();}else initialComplete=true;
 });
 film.addEventListener('mouseenter',()=>{if(reduced.matches||failed)return;hovering=true;video.currentTime=0;play();});
 film.addEventListener('mouseleave',()=>{hovering=false;});
 video.addEventListener('error',()=>{failed=true;update();});
 video.querySelector('source')?.addEventListener('error',()=>{failed=true;update();});
 compact.addEventListener('change',update);reduced.addEventListener('change',update);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else update();});
 const filmObserver=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)update();else video.pause();},{rootMargin:'100px'});
 if(reduced.matches)video.removeAttribute('autoplay');
 filmObserver.observe(film);if(reduced.matches)update();
}
const form=document.querySelector('#contact-form');
if(form){
 const status=document.querySelector('#form-status'),button=form.querySelector('button[type="submit"]');
 let submitting=false;
 const init=()=>{if(window.SITE_CONFIG?.contactEndpoint){button.textContent='送出合作需求';document.querySelector('#form-delivery-note').textContent='資料僅用於回覆本次合作需求。';}};
 document.addEventListener('DOMContentLoaded',init);init();
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(submitting||!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form));
  const endpoint=window.SITE_CONFIG?.contactEndpoint;
  status.dataset.error='false';
  if(!endpoint){
   const labels={name:'姓名／稱呼',email:'Email',phone:'手機',lineId:'LINE ID',company:'公司／單位',need:'需求類型',timeline:'預計合作時間',details:'需求簡介'};
   const body=Object.entries(labels).map(([key,label])=>`${label}：${data[key]||'未填寫'}`).join('\n');
   status.textContent='已準備合作需求郵件；請在開啟的 Email 軟體中確認並寄出。若未開啟，請直接寄信至 carlos.newmanager@gmail.com。';
   location.href=`mailto:carlos.newmanager@gmail.com?subject=${encodeURIComponent('網站合作需求｜'+data.need)}&body=${encodeURIComponent(body)}`;
   return;
  }
  submitting=true;button.disabled=true;status.textContent='正在送出…';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
   const result=await response.json();
   if(!response.ok||result.ok!==true)throw new Error('Submission was not confirmed');
   const allowedNeeds=['企業內訓','主題講座','課程合作','新手主管訂閱','媒體／內容合作','其他'];
   const allowedTimes=['1 個月內','1–3 個月','3–6 個月','6 個月以上','尚在規劃'];
   window.trackEvent?.({name:'contact_form_submit',inquiry_type:allowedNeeds.includes(data.need)?data.need:'其他',timeline:allowedTimes.includes(data.timeline)?data.timeline:'未填寫'});
   status.textContent='合作需求已送出，謝謝你的聯繫。';form.reset();
  }catch{status.dataset.error='true';status.textContent='送出未完成，內容已保留。請稍後再試，或直接寄信至 carlos.newmanager@gmail.com。';}
  finally{clearTimeout(timeout);submitting=false;button.disabled=false;}
 });
}
const targetForHash=hash=>{try{return document.getElementById(decodeURIComponent(hash.slice(1)));}catch{return null;}};
const focusedSections=new Set(['framework','about','services','development','contact']);
const applySectionView=target=>{
 const id=focusedSections.has(target?.id)?target.id:'';
 document.body.toggleAttribute('data-section-view',Boolean(id));
 document.querySelectorAll('main>section').forEach(section=>section.classList.toggle('active-section',section.id===id));
};
const scrollToSection=(target,behavior='instant')=>{
 applySectionView(target);
 const headerHeight=document.querySelector('.site-header')?.offsetHeight||0;
 const details=target.querySelector('details');if(details)details.open=true;
 window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+scrollY-headerHeight-16),behavior});
};
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href*="#"]');if(!link)return;
 const url=new URL(link.href,location.href);
 if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
 const target=targetForHash(url.hash);if(!target)return;
 event.preventDefault();closeMenu();
 if(target.hidden&&target.matches('.insight-stage')){filter.value='';filter.dispatchEvent(new Event('change'));}
 if(location.hash!==url.hash)history.pushState(null,'',url.hash);
 scrollToSection(target);
});
const alignCurrentHash=()=>{const target=targetForHash(location.hash);if(target)scrollToSection(target);else applySectionView(null);};
window.addEventListener('hashchange',alignCurrentHash);window.addEventListener('popstate',alignCurrentHash);window.addEventListener('load',alignCurrentHash);
document.fonts?.ready.then(alignCurrentHash);
const filter=document.querySelector('#topic-filter');
if(filter){filter.addEventListener('change',()=>{
 let count=0;
 document.querySelectorAll('.insight-stage').forEach(section=>{
  let localCount=0;section.querySelectorAll('.editorial-row').forEach(row=>{const match=!filter.value||row.querySelector('.meta').textContent.trim()===filter.value;row.hidden=!match;if(match)localCount++;});
  section.hidden=localCount===0;section.querySelector('details').open=Boolean(filter.value)&&localCount>0;count+=localCount;
 });
 document.querySelector('#filter-status').textContent=`${filter.value||'全部'}：${count} 篇文章`;
});}
