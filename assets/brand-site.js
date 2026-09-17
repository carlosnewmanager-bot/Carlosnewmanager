document.documentElement.classList.add('js');
const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('.mobile-menu');
if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));}
const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08}):null;
document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));
const video=document.querySelector('#brand-film-video');
if(video){const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>{if(reduced.matches){video.pause();video.hidden=true;}else{video.hidden=false;video.muted=true;video.loop=true;video.play().catch(()=>{});}};sync();reduced.addEventListener?.('change',sync);}
const form=document.querySelector('#contact-form');
if(form){form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const subject=`網站合作需求｜${data.get('need')||'一般洽詢'}｜${data.get('name')||''}`;const body=[`姓名／稱呼：${data.get('name')||''}`,`電子信箱：${data.get('email')||''}`,`公司／單位：${data.get('company')||''}`,`需求類型：${data.get('need')||''}`,`需求簡介：${data.get('details')||''}`].join('\n');location.href=`mailto:carlos.newmanager@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;});}

const scrollToSection=(target,behavior='smooth')=>{
  const header=document.querySelector('.site-header');
  const headerHeight=header?.offsetHeight||0;
  const available=window.innerHeight-headerHeight;
  const top=target.getBoundingClientRect().top+window.scrollY;
  const targetHeight=target.offsetHeight;
  const breathingRoom=targetHeight<available?Math.max(18,(available-targetHeight)/2):18;
  window.scrollTo({top:Math.max(0,top-headerHeight-breathingRoom),behavior});
};
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href*="#"]');
  if(!link)return;
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
  const target=document.querySelector(url.hash);
  if(!target)return;
  event.preventDefault();
  history.pushState(null,'',url.hash);
  scrollToSection(target);
});
const alignCurrentHash=()=>{if(location.hash){const target=document.querySelector(location.hash);if(target)setTimeout(()=>scrollToSection(target,'auto'),80);}};
window.addEventListener('hashchange',alignCurrentHash);
window.addEventListener('load',alignCurrentHash);
