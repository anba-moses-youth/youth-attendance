/* تشغيل موسيقى الترنيمة من لينك (يوتيوب / درايف / أي لينك صوت) */
(function(){
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]})}
  function norm(s){return String(s||'').replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\u0621-\u064Aa-zA-Z0-9]+/g,' ').trim().toLowerCase()}
  function local(){try{return JSON.parse(localStorage.getItem('youth-att.music')||'{}')}catch(e){return{}}}
  function saveLocal(id,u){var m=local();if(u)m[id]=u;else delete m[id];try{localStorage.setItem('youth-att.music',JSON.stringify(m))}catch(e){}}
  function link(x){
    if(!x)return '';
    var l=local(),m=window.MUSIC||{};
    if(l[x.id])return l[x.id];
    if(m[x.id])return m[x.id];
    var k=norm(x.title);
    if(!k)return '';
    for(var id in m){if(norm(id)===k)return m[id]}
    return '';
  }
  function ytId(u){
    var m=String(u||'').match(/(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m?m[1]:'';
  }
  function driveId(u){
    var m=String(u||'').match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=)([A-Za-z0-9_-]{10,})/);
    return m?m[1]:'';
  }
  var K=0;
  function playerHTML(u){
    var y=ytId(u);
    if(y)return '<div style="position:relative;padding-top:56.25%;border-radius:12px;overflow:hidden;background:#000;margin-top:8px"><iframe src="https://www.youtube-nocookie.com/embed/'+y+'?rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>';
    var d=driveId(u);
    if(d)return '<div style="position:relative;padding-top:56.25%;border-radius:12px;overflow:hidden;background:#000;margin-top:8px"><iframe src="https://drive.google.com/file/d/'+d+'/preview" allow="autoplay" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>';
    return '<audio controls preload="metadata" src="'+esc(u)+'" style="width:100%;margin-top:8px"></audio>';
  }
  function mount(el,x,opts){
    if(!el||!x)return;
    opts=opts||{};
    el.__x=x;el.__o=opts;
    var u=link(x),id='mu'+(++K);
    var h='<div style="margin-top:10px;border-top:1px solid #eee;padding-top:8px">';
    h+='<div style="font:bold 15px sans-serif;margin-bottom:4px">\uD83C\uDFB5 موسيقى الترنيمة</div>';
    if(u){
      h+=playerHTML(u);
      h+='<div style="margin-top:6px;font:13px sans-serif"><a href="'+esc(u)+'" target="_blank" rel="noopener">افتح اللينك في تاب جديد</a></div>';
    }else if(!opts.edit){
      h+='<div style="font:14px sans-serif;opacity:.75">مفيش موسيقى للترنيمة دي لسه.</div>';
    }
    if(opts.edit){
      h+='<div style="display:flex;gap:6px;margin-top:8px"><input id="'+id+'" type="url" inputmode="url" placeholder="الصق لينك الموسيقى (يوتيوب أو درايف أو ملف صوت)" value="'+esc(u)+'" style="flex:1;min-width:0;padding:10px;border:1px solid #ccc;border-radius:10px;font:15px sans-serif"><button data-mu="'+esc(x.id)+'" style="padding:10px 14px;border:0;border-radius:10px;background:#f4c430;color:#222;font:bold 15px sans-serif">حفظ</button></div>';
      h+='<div style="font:13px sans-serif;opacity:.7;margin-top:6px">'+(u?'بيشتغل على موبايلك على طول. عشان يشتغل للمخدومين كمان ابعت اللينك للمطور.':'لسه مفيش لينك. الصق اللينك واضغط حفظ.')+'</div>';
      if(u)h+='<a href="https://wa.me/?text='+encodeURIComponent('موسيقى الترنيمة: '+x.title+'\n'+u)+'" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;padding:10px 14px;border-radius:10px;background:#25D366;color:#fff;font:bold 15px sans-serif;text-decoration:none">\uD83D\uDCE4 ابعت اللينك للمطور</a>';
    }else if(u){
      h+='';
    }
    if(!u&&window.AUD&&opts.aud){h+='<div class="audm"></div>'}
    h+='</div>';
    el.innerHTML=h;
    var b=el.querySelector('button[data-mu]');
    if(b)b.onclick=function(){
      var inp=el.querySelector('#'+id);
      saveLocal(x.id,(inp&&inp.value||'').trim());
      mount(el,x,opts);
    };
    if(!u&&window.AUD&&opts.aud){var a=el.querySelector('.audm');if(a)AUD.mount(a,x.title)}
  }
  window.MUSICUI={mount:mount,link:link,ytId:ytId,driveId:driveId,saveLocal:saveLocal,local:local};
  /* في تطبيق الخادم: كارت الترنيمة يستخدم نفس الواجهة (لينك + ملف محلي) */
  var _hy=window.hyOpen;
  if(_hy&&window.MUSIC_EDIT)window.hyOpen=function(el){
    var A=window.AUD,st=A&&A.mount;
    if(A&&st)A.mount=function(){};
    try{_hy(el)}catch(e){}finally{if(A&&st)A.mount=st}
    try{
      var d=el.parentNode,a=d.querySelector('.aud');
      if(!a)return;
      var x=(typeof hyAll==='function')?hyAll()[+d.dataset.i]:null;
      if(x){a.dataset.m=1;MUSICUI.mount(a,x,{edit:true,aud:true})}
    }catch(e){}
  };
})();
