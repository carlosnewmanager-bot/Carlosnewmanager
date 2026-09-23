(()=>{
 const featured=['05','06','11','15','20','29'];
 const file=(location.pathname.match(/\/(\d+)\.html$/)||[])[1];
 if(!file||new URLSearchParams(location.search).get('from')!=='featured'||!featured.includes(file))return;
 const position=featured.indexOf(file),previous=featured[position-1],next=featured[position+1];
 const stage=document.querySelector('.article-stage');
 const nav=document.querySelector('.article-pagination');
 if(stage)stage.textContent='精選實戰管理解析';
 if(nav)nav.innerHTML=(previous?`<a href="${previous}.html?from=featured">← 上一篇</a>`:'<span></span>')+
  '<a href="../insights/#featured">精選實戰管理文章</a>'+
  (next?`<a href="${next}.html?from=featured">下一篇 →</a>`:'<span></span>');
})();
