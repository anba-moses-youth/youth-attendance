/* عرض الترانيم كسلايدات زي البور بوينت (سلايد لكل شاشة) */
(function(){
  var $=function(s){return document.querySelector(s)};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]})}
  function slidesOf(x){
    if(!x)return [];
    var d=window.HYSLIDES&&window.HYSLIDES[x.id];
    if(d&&d.length)return d.map(function(s){return Array.isArray(s)?s.join('\n'):String(s)});
    var f=window.PPFIX&&window.PPFIX[x.id];
    if(f&&f.length)return f.map(function(s){return Array.isArray(s)?s.join('\n'):String(s)});
    return String(x.text||'').split('\n\n').filter(function(s){return s.trim()});
  }
  window.ppSlides=slidesOf;
  var ST=null;
  function close(){
    if(!ST)return;
    ST=null;
    document.removeEventListener('keydown',key);
    window.removeEventListener('resize',fit);
    var o=document.getElementById('hysw');if(o)o.remove();
    document.body.style.overflow='';
    try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}
  }
  function go(d){if(!ST)return;var n=ST.i+d;if(n<0||n>=ST.sl.length)return;ST.i=n;draw()}
  function key(e){
    if(!ST)return;
    if(e.key==='ArrowLeft'||e.key===' '||e.key==='PageDown'||e.key==='Enter'){go(1);e.preventDefault()}
    else if(e.key==='ArrowRight'||e.key==='PageUp'){go(-1);e.preventDefault()}
    else if(e.key==='Escape'){close()}
  }
  function fit(){
    if(!ST)return;
    var b=$('#hysb'),t=$('#hyst');if(!b||!t)return;
    var W=Math.max(80,b.clientWidth-10),H=Math.max(80,b.clientHeight-10);
    t.style.width=W+'px';
    var lo=10,hi=220,best=lo;
    for(var k=0;k<16;k++){var mid=(lo+hi)/2;t.style.fontSize=mid+'px';if(t.scrollHeight<=H&&t.scrollWidth<=W+1){best=mid;lo=mid}else{hi=mid}}
    t.style.fontSize=Math.max(11,Math.floor(best))+'px';
  }
  function draw(){
    if(!ST)return;
    var t=$('#hyst');if(!t)return;
    t.textContent=ST.sl[ST.i];
    var c=$('#hysi');if(c)c.textContent=(ST.i+1)+' / '+ST.sl.length;
    var p=$('#hyspb');if(p)p.style.width=(100*(ST.i+1)/ST.sl.length)+'%';
    var n=$('#hysn'),v=$('#hyspv');
    if(n)n.style.opacity=ST.i>=ST.sl.length-1?.35:1;
    if(v)v.style.opacity=ST.i<=0?.35:1;
    fit();
  }
  function open(i){
    var list=(typeof hyAll==='function')?hyAll():[];
    var x=list[+i];if(!x)return;
    var sl=slidesOf(x);if(!sl.length)return;
    close();
    ST={x:x,sl:sl,i:0};
    var o=document.createElement('div');
    o.id='hysw';
    o.setAttribute('style','position:fixed;inset:0;z-index:100000;background:#fff;color:#000;display:flex;flex-direction:column;direction:rtl;touch-action:none;overscroll-behavior:none');
    o.innerHTML=
      '<div style="height:5px;background:#eee;flex:0 0 auto"><div id="hyspb" style="height:100%;width:0;background:#f4c430;transition:width .18s"></div></div>'+
      '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;flex:0 0 auto">'+
        '<button id="hysx" style="font:bold 16px sans-serif;padding:8px 12px;border:0;border-radius:10px;background:#f4c430;color:#222">\u2715 رجوع</button>'+
        '<div id="hyst2" style="flex:1;font:13px sans-serif;color:#888;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">'+esc(x.title||'')+'</div>'+
        '<button id="hysf" style="font:bold 13px sans-serif;padding:8px 10px;border:0;border-radius:10px;background:#eee;color:#222">شاشة كاملة</button>'+
      '</div>'+
      '<div id="hysb" style="flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:1vmin 2vmin">'+
        '<div id="hyst" style="font-family:Arial,\'Segoe UI\',Tahoma,sans-serif;font-weight:bold;text-align:center;white-space:pre-wrap;line-height:1.35;text-shadow:2px 2px 3px rgba(0,0,0,.32);overflow-wrap:anywhere"></div>'+
      '</div>'+
      '<div id="hysa" style="display:none;padding:0 10px 6px"></div>'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;padding:8px 8px;background:#f4c430;flex:0 0 auto">'+
        '<button id="hyspv" style="font:bold 16px sans-serif;padding:10px 12px;border:0;border-radius:10px;background:#fff;color:#222">\u25B6 السابق</button>'+
        '<button id="hysau" style="font:bold 16px sans-serif;padding:10px 10px;border:0;border-radius:10px;background:#fff;color:#222">\uD83C\uDFB5</button>'+
        '<span id="hysi" style="font:bold 15px sans-serif;direction:ltr;color:#222"></span>'+
        '<button id="hysn" style="font:bold 16px sans-serif;padding:10px 12px;border:0;border-radius:10px;background:#fff;color:#222">التالي \u25C0</button>'+
      '</div>';
    document.body.appendChild(o);
    document.body.style.overflow='hidden';
    $('#hysx').onclick=close;
    $('#hysn').onclick=function(){go(1)};
    $('#hyspv').onclick=function(){go(-1)};
    $('#hysf').onclick=function(){
      try{
        if(document.fullscreenElement)document.exitFullscreen();
        else{var f=o.requestFullscreen||o.webkitRequestFullscreen;if(f)f.call(o)}
      }catch(e){}
    };
    $('#hysau').onclick=function(){
      var a=$('#hysa');if(!a)return;
      if(a.style.display!=='none'){a.style.display='none';return}
      a.style.display='block';
      if(!a.dataset.m&&window.AUD){a.dataset.m=1;AUD.mount(a,x.title)}
    };
    var b=$('#hysb'),tx=null,ty=null,tt=0;
    b.addEventListener('touchstart',function(e){if(e.touches.length!==1)return;tx=e.touches[0].clientX;ty=e.touches[0].clientY;tt=Date.now()},{passive:true});
    b.addEventListener('touchend',function(e){
      if(tx===null)return;
      var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=null;
      if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){go(dx<0?1:-1);e.preventDefault()}
      else if(Math.abs(dx)<12&&Math.abs(dy)<12&&Date.now()-tt<500){go(1)}
    },{passive:false});
    document.addEventListener('keydown',key);
    window.addEventListener('resize',fit);
    draw();
  }
  window.hysOpen=open;
  window.showOpen=open;
  var _hyOpen=window.hyOpen;
  if(_hyOpen)window.hyOpen=function(el){
    _hyOpen(el);
    try{
      var d=el.parentNode,b=d.querySelector('.hb'),x=(typeof hyAll==='function')?hyAll()[+d.dataset.i]:null;
      var btn=b&&b.querySelector('button');
      if(btn&&x){
        var n=slidesOf(x).length;
        btn.textContent='\u25B6 عرض كسلايدات · '+n+' سلايد';
        btn.style.cssText='margin-top:8px;padding:12px 18px;font-size:19px;width:100%;font-weight:bold';
      }
    }catch(e){}
  };
  var _vHy=window.vHy;
  if(_vHy)window.vHy=function(){
    _vHy();
    try{
      var m=document.getElementById('main');
      if(m&&!document.getElementById('hyhint')){
        var d=document.createElement('div');d.id='hyhint';d.className='sub';
        d.style.cssText='padding:2px 6px 10px;text-align:center;line-height:1.7';
        d.textContent='افتح الترنيمة واضغط «\u25B6 عرض كسلايدات» تشوفها سلايد سلايد زي البور بوينت، بضغطة أو بسحبة.';
        var q=document.getElementById('hq');
        if(q&&q.parentNode===m&&q.nextSibling)m.insertBefore(d,q.nextSibling);else m.appendChild(d);
      }
    }catch(e){}
  };
})();
