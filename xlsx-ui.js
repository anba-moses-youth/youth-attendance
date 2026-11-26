(function(){
var BK=KEY+'.bak-pre-xlsx',started=false;
window.impX=function(){started=false;sheet('<h3>استيراد من Excel</h3><div class="sub">اختار ملف الإكسيل (.xlsx). تقدر تستورد أكتر من ملف واحد ورا بعض. الأسماء الموجودة مش بتتكرر، والبيانات الناقصة بس بتتكمّل. البيانات بتتحفظ على موبايلك بس.</div><input id="f_xl" type="file" multiple style="margin-top:10px"><button class="btn block" onclick="xlGo()">استيراد</button><div id="xl_log" class="sub" style="margin-top:10px;line-height:1.9"></div><button class="btn sec block" onclick="xlUndo()">↩ تراجع عن الاستيراد</button><button class="btn sec block" onclick="closeSheet()">تم</button>')};
window.xlGo=async function(){var inp=document.getElementById('f_xl'),fs=inp.files,log=document.getElementById('xl_log');if(!fs||!fs.length){toast('اختار الملف الأول');return}
 if(!started){try{localStorage.setItem(BK,JSON.stringify(S))}catch(e){}started=true}
 for(var i=0;i<fs.length;i++){var f=fs[i];try{var rows=await XI.parse(await f.arrayBuffer());var r=XI.toMembers(rows,GROUPS);if(!r.members.length)throw new Error('empty');
   var m=XI.merge(S,r.members,uid);save();
   log.innerHTML+='✅ '+esc(f.name)+': '+num(r.members.length)+' مخدوم. جديد '+num(m.add)+'، اتكمّل '+num(m.upd)+'، موجود من قبل '+num(m.same)+(r.skipped?'، تخطيت '+num(r.skipped)+' سطر بدون اسم':'')+'<br>'}
  catch(e){log.innerHTML+='❌ '+esc(f.name)+': الملف مش مفهوم (لازم يكون .xlsx)<br>'}}
 inp.value='';render();toast('تم. تقدر تختار ملف تاني')};
window.xlUndo=function(){var b=localStorage.getItem(BK);if(!b){toast('مفيش حاجة للتراجع');return}try{S=JSON.parse(b);save();render();document.getElementById('xl_log').innerHTML='↩ رجعنا للحالة قبل الاستيراد';started=false}catch(e){toast('تعذر التراجع')}};
})();
