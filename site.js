
(function(){
var C = window.GS || {};
function waLink(text){ return 'https://wa.me/' + C.WHATSAPP + '?text=' + encodeURIComponent(text || 'Hola, quiero conocer más sobre Growth Strategy'); }
document.querySelectorAll('[data-wa]').forEach(function(a){ a.href = waLink(); a.target='_blank'; });

/* Pixel (solo si hay ID) */
if (C.PIXEL_ID) {
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', C.PIXEL_ID); fbq('track','PageView');
}
function track(ev, data){ try{ if(window.fbq) fbq('track', ev, data||{}); }catch(e){} }
var formSec = document.getElementById('formulario');
if (formSec) track('ViewContent', {content_name: formSec.dataset.service});
document.querySelectorAll('[data-wa]').forEach(function(a){ a.addEventListener('click', function(){ track('Contact'); }); });

/* ?src= en la home: lleva directo al servicio del anuncio */
if (location.pathname === '/' || location.pathname === '/index.html') {
  var p = new URLSearchParams(location.search), src = (p.get('src')||'').toLowerCase();
  var map = {api:'/whatsapp-api', whatsapp:'/whatsapp-api', meta:'/meta-ads', ads:'/meta-ads', contenido:'/contenido', content:'/contenido', videos:'/videos-ia', ia:'/videos-ia'};
  if (map[src]) { var q = location.search; location.replace(map[src] + q); }
}

/* Drawer, nav, reveal, scroll */
var hamburger=document.getElementById('hamburger'),drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
function closeDrawer(){drawer.classList.remove('open');hamburger.classList.remove('open');overlay.classList.remove('open');document.body.style.overflow='';}
hamburger.addEventListener('click',function(){var o=drawer.classList.toggle('open');hamburger.classList.toggle('open',o);overlay.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';});
overlay.addEventListener('click',closeDrawer);
drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeDrawer);});
var nav=document.querySelector('.site-nav');
addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>40);},{passive:true});
var els=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){var obs=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');obs.unobserve(x.target);}});},{threshold:.08});els.forEach(function(el){obs.observe(el);});}else{els.forEach(function(el){el.classList.add('in');});}
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(this.getAttribute('href'));if(t){e.preventDefault();var y=t.getBoundingClientRect().top+scrollY-nav.offsetHeight;scrollTo({top:y,behavior:'smooth'});}});});
var bar=document.createElement('div');bar.className='scroll-progress';document.body.prepend(bar);
addEventListener('scroll',function(){var m=document.body.scrollHeight-innerHeight;bar.style.width=(m>0?scrollY/m*100:0)+'%';},{passive:true});

/* Fondo de puntos (igual que el diseño original, sin libs) */
(function(){var cv=document.getElementById('dot-canvas');if(!cv||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var ctx=cv.getContext('2d'),W,H,dots=[];var COL=['#121317','#2F3034','#45474D','#6a6d75','#9aa0a6','#B2BBC5','#CDD4DC'];
function init(){W=cv.width=innerWidth;H=cv.height=innerHeight;var n=Math.min(150,Math.floor(W*H/9000));dots=[];for(var i=0;i<n;i++)dots.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.5,c:COL[Math.floor(Math.random()*COL.length)],a:Math.random()*.35+.08,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3});}
function draw(){ctx.clearRect(0,0,W,H);for(var i=0;i<dots.length;i++){for(var j=i+1;j<dots.length;j++){var dx=dots[i].x-dots[j].x,dy=dots[i].y-dots[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<80){ctx.beginPath();ctx.strokeStyle='rgba(33,34,38,0.3)';ctx.globalAlpha=(1-d/80)*.06;ctx.lineWidth=.6;ctx.moveTo(dots[i].x,dots[i].y);ctx.lineTo(dots[j].x,dots[j].y);ctx.stroke();}}}
dots.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle=p.c;ctx.globalAlpha=p.a;ctx.fill();});ctx.globalAlpha=1;requestAnimationFrame(draw);}
init();draw();addEventListener('resize',init);})();

/* Resultados en vivo (home): solo se muestran si la consulta responde con datos reales */
var live=document.getElementById('live');
if(live && C.SUMMARY_URL){
  fetch(C.SUMMARY_URL,{method:'POST',headers:{apikey:C.SUMMARY_KEY,Authorization:'Bearer '+C.SUMMARY_KEY,'Content-Type':'application/json'},body:'{}'})
  .then(function(r){if(!r.ok)throw 0;return r.json();})
  .then(function(d){
    if(!d||!d.inversion_total||!d.mensajes_total)throw 0;
    var n=function(v){return Math.floor(Number(v)).toLocaleString('es-CO');};
    var items=[['Inversión en pauta gestionada','$'+n(d.inversion_total)],['Mensajes generados vía Meta Ads',n(d.mensajes_total)]];
    if(d.ventas_total)items.push(['Ventas reportadas por los clientes','$'+n(d.ventas_total)]);
    var one=items.map(function(it){return '<div class="tk-item"><span>'+it[0]+'</span><b>'+it[1]+'</b><i>▲</i></div>';}).join('');
    document.getElementById('tk-track').innerHTML=one+one+one+one;
    live.hidden=false;
  }).catch(function(){});
}

/* Botón "Quiero este paquete" */
var sel=document.getElementById('f_interest');
document.querySelectorAll('[data-pick]').forEach(function(b){b.addEventListener('click',function(e){
  var v=b.getAttribute('data-pick'); if(sel&&v){for(var i=0;i<sel.options.length;i++){if(sel.options[i].value===v){sel.selectedIndex=i;break;}}}
  var t=document.getElementById('formulario'); if(t){e.preventDefault();scrollTo({top:t.getBoundingClientRect().top+scrollY-nav.offsetHeight,behavior:'smooth'});}
});});

/* Formulario calificador */
var form=document.getElementById('leadform');
if(form){
  var started=false;
  form.addEventListener('input',function(){if(!started){started=true;track('InitiateCheckout',{content_name:formSec.dataset.service});}});
  function utm(){var p=new URLSearchParams(location.search),o={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src'].forEach(function(k){var v=p.get(k);if(v){o[k]=v;try{sessionStorage.setItem('gs_'+k,v);}catch(e){}}else{try{var s=sessionStorage.getItem('gs_'+k);if(s)o[k]=s;}catch(e){}}});return o;}
  utm();
  function score(v){
    var rich=(v.budget==='1m-3m'||v.budget==='gt3m'), chats=(v.chats==='30-100'||v.chats==='gt100');
    if(rich||(chats&&v.start==='month'))return 'A';
    if(v.budget==='lt500'&&v.start==='browsing')return 'C';
    return 'B';
  }
  function label(selEl){return selEl.options[selEl.selectedIndex].text;}
  function setErr(el,bad){el.closest('.field').classList.toggle('err',bad);}
  function v1(){var f=form.elements,ok=true;
    ['name','business','city'].forEach(function(k){var bad=f[k].value.trim().length<2;setErr(f[k],bad);if(bad)ok=false;});
    var digits=f.whatsapp.value.replace(/\D/g,''); if(digits.indexOf('57')===0&&digits.length===12)digits=digits.slice(2);
    var badw=digits.length!==10; setErr(f.whatsapp,badw); if(badw)ok=false;
    return {ok:ok,digits:digits};}
  function v2(){var f=form.elements,ok=true;
    ['sells','chats','budget','interest','start'].forEach(function(k){var bad=!f[k].value;setErr(f[k],bad);if(bad)ok=false;});
    return ok;}
  var s1=document.getElementById('step1'),s2=document.getElementById('step2'),p2=document.getElementById('p2'),pl=document.getElementById('plabel');
  function go(n){s1.hidden=n!==1;s2.hidden=n!==2;p2.classList.toggle('on',n===2);pl.textContent=n===1?'Paso 1 de 2 · Tus datos':'Paso 2 de 2 · Tu necesidad';
    var t=document.getElementById('formwrap');t.scrollIntoView({behavior:'smooth',block:'start'});}
  document.getElementById('next1').addEventListener('click',function(){if(v1().ok){go(2);}else{var fe=form.querySelector('.err input');if(fe)fe.focus();}});
  document.getElementById('back2').addEventListener('click',function(){go(1);});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(form.company_site.value)return; /* trampa de bots */
    var f=form.elements, r1=v1(), digits=r1.digits, ok=r1.ok;
    if(!ok){go(1);return;}
    ok=v2();
    if(!ok){var first=form.querySelector('.err');if(first)first.scrollIntoView({behavior:'smooth',block:'center'});return;}
    var v={name:f.name.value.trim(),business:f.business.value.trim(),whatsapp:'57'+digits,sells:f.sells.value,city:f.city.value.trim(),chats:f.chats.value,budget:f.budget.value,interest:f.interest.value,start:f.start.value};
    var tier=score(v), u=utm(), ref='GS-'+tier+'-'+Math.floor(1000+Math.random()*9000);
    var rec=Object.assign({ref:ref,service:formSec.dataset.service,page:location.pathname,tier:tier,name:v.name,business:v.business,whatsapp:v.whatsapp,sells:v.sells,city:v.city,chats_per_day:label(f.chats),monthly_ad_budget:label(f.budget),interest:v.interest,start_when:label(f.start),referrer:document.referrer||null},u);
    var msg='Hola, quiero cotizar: *'+v.interest+'*\n\n'+
      '• Nombre: '+v.name+'\n'+
      '• Negocio: '+v.business+'\n'+
      '• Qué vende: '+v.sells+'\n'+
      '• Ciudad: '+v.city+'\n'+
      '• Chats al día: '+label(f.chats)+'\n'+
      '• Pauta al mes: '+label(f.budget)+'\n'+
      '• Quiere empezar: '+label(f.start)+'\n\n'+
      'Ref: '+ref;
    var btn=document.getElementById('submitbtn'); btn.disabled=true; btn.textContent='Enviando…';
    var done=function(){
      track('Lead',{content_name:formSec.dataset.service,value:0,currency:'COP',lead_tier:tier});
      document.getElementById('thanks-wa').href=waLink(msg);
      document.getElementById('formwrap').classList.add('ok');
      document.getElementById('formwrap').scrollIntoView({behavior:'smooth',block:'center'});
    };
    if(C.LEADS_URL){
      fetch(C.LEADS_URL,{method:'POST',headers:{'Content-Type':'application/json',apikey:C.LEADS_KEY,Authorization:'Bearer '+C.LEADS_KEY,Prefer:'return=minimal'},body:JSON.stringify(rec)})
      .then(function(r){if(!r.ok)throw 0;done();})
      .catch(function(){ /* si falla el guardado, el cliente igual puede escribirnos por WhatsApp */ done(); });
    } else { done(); }
  });
}
})();
