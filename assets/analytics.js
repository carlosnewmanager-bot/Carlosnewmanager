/* Public analytics; never send form fields, email addresses, or free text. */
(()=>{
 if(window.__carlosAnalyticsInstalled)return;
 window.__carlosAnalyticsInstalled=true;
 const config=window.SITE_CONFIG||{};
 const enabled=location.protocol==='https:'&&['newmanager.com.tw','www.newmanager.com.tw'].includes(location.hostname)&&/^G-[A-Z0-9]+$/.test(config.gaMeasurementId||'');
 window.trackEvent=({name,...params})=>{
  if(!enabled)return;
  window.gtag?.('event',name,params);
 };
 if(enabled&&!window.__carlosGA){
  window.__carlosGA=true;window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config',config.gaMeasurementId,{send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false});
  const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.gaMeasurementId)}`;document.head.append(script);
 }
 document.addEventListener('click',event=>{
  const a=event.target.closest('a[href]');if(!a)return;
  const url=new URL(a.href,location.href);
  const locationName=a.closest('header')?'header':a.closest('footer')?'footer':a.closest('section')?.id||location.pathname;
  const params={location:locationName,cta_label:a.textContent.trim().slice(0,100)};
  const fire=name=>window.trackEvent({name,...params});
  if(url.hostname==='vocus.cc'){window.trackEvent({name:'external_subscription_click',location:locationName,destination:url.origin+url.pathname});return;}
  if(url.origin!==location.origin)return;
  if(/\/articles\/\d+\.html$/.test(url.pathname)){
   const slug=url.pathname.split('/').pop().replace('.html','');
   const metadata=config.articles?.[slug];
   const title=metadata?.title||a.querySelector('h2,h3')?.textContent.trim()||a.textContent.trim();
   const matching=Array.from(document.querySelectorAll('.editorial-row')).find(row=>row.href===a.href);
   const row=a.matches('.editorial-row')?a:matching;
   const stage=metadata?.stage||row?.closest('.insight-stage')?.id;
   const category=metadata?.category||row?.querySelector('.meta')?.textContent.trim();
   window.trackEvent({name:'article_click',location:locationName,article_title:title,article_slug:slug,...(stage?{stage}:{}),...(category?{category}:{})});return;
  }
  if((/\/insights\/$/.test(url.pathname)&&!url.hash)||url.hash==='#insights')fire('management_insights_click');
  if(url.hash==='#services'||/培訓|課程/.test(params.cta_label))fire('training_click');
  if(url.hash==='#development')fire('subscription_click');
  if(url.hash==='#contact')fire('contact_click');
 });
})();
