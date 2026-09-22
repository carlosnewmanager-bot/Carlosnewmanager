const fs=require('node:fs'),path=require('node:path');
const gaMeasurementId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||'';
const contactEndpoint=process.env.CONTACT_ENDPOINT||'';
if(gaMeasurementId&&!/^G-[A-Z0-9]+$/.test(gaMeasurementId))throw new Error('Invalid NEXT_PUBLIC_GA_MEASUREMENT_ID');
if(contactEndpoint&&new URL(contactEndpoint).protocol!=='https:')throw new Error('CONTACT_ENDPOINT must use HTTPS');
const root=path.resolve(__dirname,'..');
const articles={};
const plain=text=>text.replace(/<[^>]*>/g,'').trim();
for(const file of fs.readdirSync(path.join(root,'articles')).filter(f=>/^\d+\.html$/.test(f))){
 const html=fs.readFileSync(path.join(root,'articles',file),'utf8');
 articles[file.replace('.html','')]={title:plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1])};
}
const insights=fs.readFileSync(path.join(root,'insights/index.html'),'utf8');
for(const section of insights.matchAll(/<section class="insight-stage" id="([^"]+)">([\s\S]*?)<\/section>/g)){
 for(const row of section[2].matchAll(/<a class="editorial-row" href="\.\.\/articles\/(\d+)\.html">([\s\S]*?)<\/a>/g)){
  if(articles[row[1]])Object.assign(articles[row[1]],{stage:section[1],category:plain(row[2].match(/<div class="meta">([\s\S]*?)<\/div>/)[1])});
 }
}
fs.writeFileSync(path.join(root,'assets/site-config.js'),`// Generated from deployment environment and existing article metadata. Public values only.\nwindow.SITE_CONFIG=Object.freeze(${JSON.stringify({gaMeasurementId,contactEndpoint,articles})});\n`);
const urls=['https://newmanager.com.tw/','https://newmanager.com.tw/insights/',...Object.keys(articles).sort().map(slug=>`https://newmanager.com.tw/articles/${slug}.html`)];
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>`  <url><loc>${url}</loc></url>`).join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://newmanager.com.tw/sitemap.xml\n');
