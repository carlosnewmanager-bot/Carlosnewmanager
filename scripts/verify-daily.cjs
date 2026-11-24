// Run before deployment: node scripts/verify-daily.cjs
// The manifest is the approved photo inventory, not a generated list of current img tags.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');const {posts}=JSON.parse(fs.readFileSync(path.join(root,'daily/manifest.json'),'utf8'));const failures=[];
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
for(const post of posts){
 const article=read(post.url.slice(1));
 if(post.layout==='photo-text-photo'){
  const first=article.indexOf('src="'+post.images[0].src+'"');const prose=article.indexOf('<div class="daily-prose">');const second=article.indexOf('src="'+post.images[1].src+'"');
  if(!(first>=0&&first<prose&&prose<second))failures.push(post.slug+': expected first photo, complete text, second photo');
 }
 const figures=article.match(/<figure class="daily-photo">[\s\S]*?<\/figure>/g)||[];
 if(!post.images?.length||figures.length!==post.images.length)failures.push(post.slug+': photo count differs from approved inventory');
 let previous=-1;
 for(const image of post.images){const index=article.indexOf('src="'+image.src+'"');if(index<0||index<=previous)failures.push(post.slug+': missing photo or wrong order '+image.src);previous=index;if(!image.alt||!article.includes('alt="'+image.alt+'"'))failures.push(post.slug+': missing alt');const file=path.join(root,image.src.slice(1));if(!fs.existsSync(file)||fs.statSync(file).size===0)failures.push(post.slug+': missing asset '+image.src);}
 for(const rel of ['index.html','daily/index.html']){const cards=read(rel).match(/<article class="daily-card">[\s\S]*?<\/article>/g)||[];const card=cards.find(c=>c.includes('href="'+post.url+'"'));if(!card||!card.includes('src="'+post.images[0].src+'"'))failures.push(rel+': missing post/thumbnail '+post.slug);}
}
for(const name of fs.readdirSync(path.join(root,'daily')).filter(n=>n.endsWith('.html')&&n!=='index.html'))if(!posts.some(p=>p.url==='/daily/'+name))failures.push('Article missing from inventory: '+name);
for(const rel of ['index.html','insights/index.html','daily/index.html',...posts.map(p=>p.url.slice(1))])for(const nav of read(rel).match(/<nav\b[^>]*>[\s\S]*?<\/nav>/g)||[]){if(nav.includes('>下班日常</a>')&&nav.includes('>聯絡合作</a>')&&nav.indexOf('>下班日常</a>')>nav.indexOf('>聯絡合作</a>'))failures.push(rel+': daily must precede contact');}
if(failures.length){console.error(failures.join('\n'));process.exit(1);}console.log('PASS: '+posts.length+' posts, '+posts.reduce((n,p)=>n+p.images.length,0)+' approved photos, home/list thumbnails and menu order.');
