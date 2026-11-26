(function(){
const BASE='https://anba-moses-youth.github.io/hymn-audio/',CN='hymn-audio-v1';
const norm=s=>String(s||'').replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\u0621-\u064Aa-zA-Z]+/g,' ').trim();
let _db=null,_man=null;
function idb(){return _db||(_db=new Promise((res,rej)=>{const r=indexedDB.open('hymn-audio',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}))}
async function iget(k){try{const d=await idb();return await new Promise(r=>{const q=d.transaction('f').objectStore('f').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r()})}catch(e){}}
async function iput(k,v){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction('f','readwrite');t.objectStore('f').put(v,k);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
async function idel(k){const d=await idb();return new Promise(res=>{const t=d.transaction('f','readwrite');t.objectStore('f').delete(k);t.oncomplete=res;t.onerror=res})}
async function manifest(){if(_man)return _man;try{const r=await fetch(BASE+'audio.json?'+Date.now());_man=r.ok?await r.json():{}}catch(e){_man={}}return _man}
async function find(title){const k=norm(title);const l=await iget(k);if(l)return{src:URL.createObjectURL(l),kind:'local',k};
 const m=await manifest();let u=m[k];if(!u)return null;if(!/^https?:/.test(u))u=BASE+u;
 try{const c=await caches.open(CN),r=await c.match(u);if(r)return{src:URL.createObjectURL(await r.blob()),kind:'saved',url:u,k}}catch(e){}
 return{src:u,kind:'remote',url:u,k}}
function pick(multi,cb){const i=document.createElement('input');i.type='file';i.accept='audio/*,.mp3,.m4a,.aac,.wav,.ogg';i.multiple=!!multi;i.style.display='none';document.body.appendChild(i);i.onchange=()=>{const f=[...i.files];i.remove();cb(f)};i.click()}
const B='margin:4px 4px 0 0;padding:8px 12px;border:0;border-radius:10px;background:#f4c430;color:#222;font:bold 15px sans-serif';
async function mount(el,title){if(!el)return;el.innerHTML='<div style="font:14px sans-serif;opacity:.7">🎵 ...</div>';const r=await find(title);
 if(!r){el.innerHTML='<div style="font:14px sans-serif;margin:6px 0">🎵 مفيش صوت للترنيمة دي لسه</div><button style="'+B+'">📎 ربط ملف صوت</button>';el.querySelector('button').onclick=()=>pick(false,async f=>{if(!f[0])return;await iput(norm(title),f[0]);mount(el,title)});return}
 el.innerHTML='<audio controls preload="none" style="width:100%;margin-top:6px" src="'+r.src+'"></audio><div class="audb"></div>';el.audio=el.querySelector('audio');const b=el.querySelector('.audb');
 if(r.kind==='remote'){const x=document.createElement('button');x.setAttribute('style',B);x.textContent='⬇ حفظ للتشغيل بدون نت';x.onclick=async()=>{x.textContent='جاري الحفظ...';try{const c=await caches.open(CN);const rs=await fetch(r.url);if(!rs.ok)throw 0;await c.put(r.url,rs);try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}mount(el,title)}catch(e){x.textContent='فشل الحفظ، جرب تاني'}};b.appendChild(x)}
 else{const s=document.createElement('span');s.style.cssText='font:14px sans-serif;margin:4px';s.textContent=r.kind==='local'?'✓ ملف على الجهاز':'✓ محفوظ للتشغيل بدون نت';b.appendChild(s);
  if(r.kind==='local'){const x=document.createElement('button');x.setAttribute('style',B);x.textContent='🗑 إزالة';x.onclick=async()=>{await idel(r.k);mount(el,title)};b.appendChild(x)}}}
function bulk(titles,done){pick(true,async files=>{if(!files.length)return;const T=titles.map(t=>({t,k:norm(t)}));let ok=0,miss=[];
 for(const f of files){const n=norm(f.name.replace(/\.[^.]+$/,''));let m=T.find(x=>x.k===n);if(!m&&n.length>=4){const c=T.filter(x=>x.k.length>=4&&(n.includes(x.k)||x.k.includes(n))).sort((a,b)=>b.k.length-a.k.length);m=c[0]}
  if(m){try{await iput(m.k,f);ok++}catch(e){miss.push(f.name)}}else miss.push(f.name)}
 alert('تم ربط '+ok+' ملف'+(miss.length?'\nلم يتطابق مع اسم ترنيمة ('+miss.length+'):\n'+miss.slice(0,15).join('\n')+(miss.length>15?'\n...':''):''));if(done)done()})}
async function status(titles){let n=0;for(const t of titles){if(await find(t))n++}return n}
window.AUD={put:(t,b)=>iput(norm(t),b),norm,find,mount,bulk,status,manifest,pick};
})();
