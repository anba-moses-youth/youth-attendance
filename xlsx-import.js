(function(root){
var AD='٠١٢٣٤٥٦٧٨٩';
function dg(s){return String(s==null?'':s).replace(/[٠-٩]/g,function(d){return AD.indexOf(d)}).replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)})}
function u16(b,o){return b[o]|(b[o+1]<<8)}function u32(b,o){return (b[o]|(b[o+1]<<8)|(b[o+2]<<16)|(b[o+3]<<24))>>>0}
async function inflate(data){var ds=new DecompressionStream('deflate-raw');var w=ds.writable.getWriter();w.write(data);w.close();return new Uint8Array(await new Response(ds.readable).arrayBuffer())}
async function unzip(buf){var b=new Uint8Array(buf),e=-1;for(var i=b.length-22;i>=Math.max(0,b.length-70000);i--){if(b[i]==0x50&&b[i+1]==0x4b&&b[i+2]==5&&b[i+3]==6){e=i;break}}
 if(e<0)throw new Error('not zip');var n=u16(b,e+10),o=u32(b,e+16),files={};
 for(var k=0;k<n;k++){if(u32(b,o)!=0x02014b50)break;var m=u16(b,o+10),cs=u32(b,o+20),nl=u16(b,o+28),el=u16(b,o+30),cl=u16(b,o+32),lo=u32(b,o+42);var name=new TextDecoder().decode(b.subarray(o+46,o+46+nl));
  files[name]={m:m,cs:cs,lo:lo};o+=46+nl+el+cl}
 async function get(name){var f=files[name];if(!f)return null;var lo=f.lo,ln=u16(b,lo+26),le=u16(b,lo+28),st=lo+30+ln+le,d=b.subarray(st,st+f.cs);if(f.m==0)return new TextDecoder().decode(d);return new TextDecoder().decode(await inflate(d))}
 return {names:Object.keys(files),get:get}}
function xd(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#(\d+);/g,function(_,c){return String.fromCharCode(+c)}).replace(/&#x([0-9a-f]+);/gi,function(_,c){return String.fromCharCode(parseInt(c,16))}).replace(/&amp;/g,'&')}
function tt(x){var r='',re=/<t[^>]*>([\s\S]*?)<\/t>/g,m;while((m=re.exec(x)))r+=m[1];return xd(r)}
function colN(r){var c=r.replace(/[0-9]/g,''),n=0;for(var i=0;i<c.length;i++)n=n*26+c.charCodeAt(i)-64;return n-1}
async function parse(buf){var z=await unzip(buf),ss=[],t=await z.get('xl/sharedStrings.xml');
 if(t){var re=/<si[^>]*>([\s\S]*?)<\/si>/g,m;while((m=re.exec(t)))ss.push(tt(m[1]))}
 var sheets=z.names.filter(function(n){return /^xl\/worksheets\/sheet\d+\.xml$/.test(n)}).sort(function(a,b){return parseInt(a.match(/\d+/)[0])-parseInt(b.match(/\d+/)[0])});
 var x=await z.get(sheets[0]),rows=[],rr=/<row\b[^>]*>([\s\S]*?)<\/row>/g,rm;
 while((rm=rr.exec(x))){var row=[],cr=/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g,cm;
  while((cm=cr.exec(rm[1]))){var at=cm[1],body=cm[2]||'',ref=(at.match(/\br="([A-Z]+\d+)"/)||[])[1],ty=(at.match(/\bt="(\w+)"/)||[])[1],v='';
   if(ty=='inlineStr')v=tt(body);else{var vm=body.match(/<v[^>]*>([\s\S]*?)<\/v>/);if(vm){v=xd(vm[1]);if(ty=='s')v=ss[+v]||''}}
   var ci=ref?colN(ref):row.length;row[ci]=v}
  rows.push(row)}
 return rows}
function nz(s){return String(s||'').replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim().toLowerCase()}
function phone(v){var s=dg(v).replace(/[^\d+]/g,'');if(!s)return '';s=s.replace(/^\+?0*20/,'0').replace(/^\+/,'');if(/^1\d{9}$/.test(s))s='0'+s;
 if(s.length<7)return '';if(/^(\d)\1+$/.test(s))return '';return s}
function bday(d,m,y,whole){d=parseInt(dg(d));m=parseInt(dg(m));y=parseInt(dg(y));
 if(whole!=null&&whole!==''){var w=dg(whole).trim(),mm;if((mm=w.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/)))return fmt(+mm[1],+mm[2],+mm[3]);if((mm=w.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/)))return fmt(+mm[3],+mm[2],+mm[1]);if(/^\d{5}(\.\d+)?$/.test(w)){var dt=new Date(Math.round((parseFloat(w)-25569)*86400000));return fmt(dt.getUTCFullYear(),dt.getUTCMonth()+1,dt.getUTCDate())}}
 if(y<100&&y>=0)y+=y<=30?2000:1900;return fmt(y,m,d)}
function fmt(y,m,d){if(!(y>=1950&&y<=2030&&m>=1&&m<=12&&d>=1&&d<=31))return '';return y+'-'+(m<10?'0':'')+m+'-'+(d<10?'0':'')+d}
var H=[['qr',/qr|كود|باركود/i],['name',/^(ال)?اسم|name|الاسم/],['email',/mail|ميل|بريد|ايميل|إيميل/i],['addr',/عنوان|address|سكن/],['parent',/ولي|والد|guardian|parent/],['phone',/تليفون|هاتف|موبايل|رقم|phone|mobile|tel/],['day',/يوم|day/],['month',/شهر|month/],['year',/سنه|سنة|عام|year/],['father',/اعتراف|كاهن|اب |الاب|confess/],['notes',/معلومات|ملاحظ|اخر|أخر|other|note/],['pts',/نقاط|point/]];
function toMembers(rows,GROUPS){var hi=-1,i;for(i=0;i<Math.min(rows.length,6);i++){var r=rows[i]||[];var t=r.map(function(c){return nz(c)}).join('|');if(/اسم|name/.test(t)&&r.filter(Boolean).length>=3){hi=i;break}}
 var map={};if(hi>=0){(rows[hi]||[]).forEach(function(c,ci){var n=nz(c);if(!n)return;for(var k=0;k<H.length;k++){var key=H[k][0];if(map[key]!=null)continue;
   if(key=='phone'&&/ولي|والد|guardian|parent/.test(n))continue;
   if(key=='parent'&&!/ولي|والد|guardian|parent/.test(n))continue;
   if(H[k][1].test(n)){map[key]=ci;break}}})}
 if(map.name==null){var o=['qr','name','email','addr','phone','parent','day','month','year','father','notes','pts'];map={};o.forEach(function(k,j){map[k]=j});hi=(rows[0]&&/^\s*\d{3,}\s*$/.test(String(rows[0][0]||'')))?-1:0}
 var out=[],skipped=0;
 for(i=hi+1;i<rows.length;i++){var r=rows[i]||[];function g(k){var v=r[map[k]];return v==null?'':String(v).trim()}
  var name=g('name').replace(/\s+/g,' ');if(!name){if(r.some(function(c){return c}))skipped++;continue}
  var notes=[];var em=g('email');if(em&&/@/.test(em))notes.push('إيميل: '+em);var ot=g('notes');if(ot&&ot!=='0')notes.push(ot);
  var m={name:name,phone:phone(g('phone')),parent:phone(g('parent')),birthday:bday(g('day'),g('month'),g('year')),father:(g('father')=='0'?'':g('father')),addr:(g('addr')=='0'?'':g('addr')),points:parseInt(dg(g('pts')))||0,notes:notes.join(' | '),qr:g('qr')};
  var blob=nz(r.join(' '));for(var q=0;q<GROUPS.length;q++){if(blob.indexOf(nz(GROUPS[q][1]))>=0){m.g=GROUPS[q][0];break}}
  out.push(m)}
 return {members:out,skipped:skipped,map:map}}
function merge(S,list,uid){var idx={};S.members.forEach(function(m){idx[nz(m.name)]=m});var add=0,upd=0,same=0;
 list.forEach(function(x){var ex=idx[nz(x.name)],ch=0;
  if(!ex){var nm={id:uid(),name:x.name,phone:x.phone,parent:x.parent,birthday:x.birthday,notes:x.notes,father:x.father,addr:x.addr,points:x.points};if(x.g)nm.g=x.g;S.members.push(nm);idx[nz(x.name)]=nm;add++;return}
  ['phone','parent','birthday','father','addr'].forEach(function(f){if(!ex[f]&&x[f]){ex[f]=x[f];ch=1}});
  if(!ex.points&&x.points){ex.points=x.points;ch=1}
  if(x.notes&&(ex.notes||'').indexOf(x.notes)<0){ex.notes=ex.notes?ex.notes+' | '+x.notes:x.notes;ch=1}
  if(x.g&&!ex.g){ex.g=x.g;ch=1}
  if(ch)upd++;else same++});
 return {add:add,upd:upd,same:same}}
root.XI={parse:parse,toMembers:toMembers,merge:merge,phone:phone,bday:bday};
})(typeof window!=='undefined'?window:globalThis);
