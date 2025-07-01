(function(){const ID='17NWurBNv3Fu53afNlC-d4xsc37w_LDIuHmk-uhoPTsg';
const SHEET='Artist Mastersheet - Live';                               // plain hyphen
const URL='https://docs.google.com/spreadsheets/d/'+ID+
  '/gviz/tq?tqx=out:csv&sheet='+encodeURIComponent(SHEET);
const OUT=document.getElementById('sff-artist-profile');
if(!OUT)return;
const clean=s=>s.replace(/<\\/?\\s*(script|style|iframe|object|embed|link)[^>]*?>/gi,'');
const csv=r=>r.trim().split(/\\r?\\n/).map(l=>l.split(','));
const LINKS=[['website','Website'],['instagram','Instagram'],['facebook','Facebook'],
  ['twitter','Twitter'],['spotify','Spotify'],['youtube','YouTube']];
const card=a=>{
  const img=a.image&&a.image!=='null'?a.image:'https://via.placeholder.com/400?text=Artist';
  const links=LINKS.filter(([k])=>a[k]&&a[k]!=='null')
    .map(([k,l])=>'<a href="'+a[k]+'" target="_blank" rel="noopener">'+l+'</a>').join('');
  return '<article class="sff-card"><h3 class="sff-name">'+(a.name||'Unknown Artist')+
    '</h3><div class="sff-img"><img src="'+img+'" loading="lazy" alt="profile"></div>'+
    '<p class="sff-bio">'+clean(a.profile)+'</p><div class="sff-links">'+links+'</div></article>';
};
fetch(URL).then(r=>r.text()).then(t=>{
  const rows=csv(t);const head=rows.shift().map(h=>h.toLowerCase().trim());
  const list=rows.map(r=>{const o={};head.forEach((h,i)=>o[h]=r[i]||'');return o})
    .sort((a,b)=>(+a.order||0)-(+b.order||0));
  OUT.innerHTML=list.map(card).join('');
}).catch(e=>{console.error(e);OUT.textContent='Could not load artist profiles.'});
})();