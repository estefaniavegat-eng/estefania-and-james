(function(){
  var S=window.SITE||{}, root=document.documentElement;

  // Countdown
  var target=new Date(S.weddingDate).getTime();
  var el={d:document.getElementById('d'),h:document.getElementById('h'),m:document.getElementById('m'),s:document.getElementById('s')};
  function tick(){
    var t=Math.max(0,target-Date.now());
    el.d.textContent=Math.floor(t/864e5);
    el.h.textContent=String(Math.floor(t/36e5)%24).padStart(2,'0');
    el.m.textContent=String(Math.floor(t/6e4)%60).padStart(2,'0');
    el.s.textContent=String(Math.floor(t/1e3)%60).padStart(2,'0');
  }
  tick(); setInterval(tick,1000);

  // Optional RSVP / Registry links (only shown when a URL is set)
  var row=document.getElementById('ctaRow'), any=false;
  document.querySelectorAll('.opt').forEach(function(li){
    var url=S[li.dataset.key]; if(!url) return;
    li.hidden=false; li.querySelector('a').href=url;
    var a=document.createElement('a'); a.className='btn'; a.href=url; a.target='_blank'; a.rel='noopener';
    a.textContent=li.textContent.trim()+' ↗'; row.appendChild(a); any=true;
  });
  if(any) row.hidden=false;

  // Sticky nav: solid after hero
  var nav=document.getElementById('nav');
  function onScroll(){ nav.classList.toggle('solid', window.scrollY>window.innerHeight*0.7); }
  onScroll(); addEventListener('scroll',onScroll,{passive:true});

  // Mobile menu
  var burger=document.getElementById('burger');
  burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  document.querySelectorAll('#links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')})});

  // Active link highlight
  var links=[].slice.call(document.querySelectorAll('#links a[href^="#"]'));
  var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('section[id]').forEach(function(s){spy.observe(s)});

  // Reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(n){io.observe(n)});

  // Theme switcher
  var sw=document.getElementById('switch');
  if(S.showThemeSwitcher===false){sw.remove();return}
  function mark(){sw.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.t===root.dataset.theme)})}
  sw.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;root.dataset.theme=b.dataset.t;try{localStorage.setItem('ej-theme',b.dataset.t)}catch(_){}mark()});
  mark();

  // Photo lightbox
  (function(){
    var figs=[].slice.call(document.querySelectorAll('.photos figure'));
    if(!figs.length) return;
    var lb=document.createElement('div');
    lb.className='lightbox';
    lb.hidden=true;
    lb.setAttribute('role','dialog');
    lb.setAttribute('aria-modal','true');
    lb.setAttribute('aria-label','Photo');
    lb.innerHTML='<button class="lb-close" aria-label="Close">×</button><button class="lb-prev" aria-label="Previous">‹</button><img alt=""><button class="lb-next" aria-label="Next">›</button>';
    document.body.appendChild(lb);
    var img=lb.querySelector('img');
    var i=0;
    var items=figs.map(function(f){var el=f.querySelector('img');return {src:el.getAttribute('src'),alt:el.getAttribute('alt')||''}});
    function show(n){
      i=(n+items.length)%items.length;
      img.src=items[i].src; img.alt=items[i].alt;
      lb.hidden=false; document.body.style.overflow='hidden';
    }
    function hide(){ lb.hidden=true; document.body.style.overflow=''; img.removeAttribute('src'); }
    figs.forEach(function(f,n){
      f.setAttribute('tabindex','0');
      f.setAttribute('role','button');
      f.setAttribute('aria-label','View photo: '+(items[n].alt||''));
      f.addEventListener('click',function(){show(n)});
      f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();show(n)}});
    });
    lb.querySelector('.lb-close').addEventListener('click',hide);
    lb.querySelector('.lb-prev').addEventListener('click',function(e){e.stopPropagation();show(i-1)});
    lb.querySelector('.lb-next').addEventListener('click',function(e){e.stopPropagation();show(i+1)});
    lb.addEventListener('click',function(e){if(e.target===lb)hide()});
    addEventListener('keydown',function(e){
      if(lb.hidden)return;
      if(e.key==='Escape')hide();
      if(e.key==='ArrowLeft')show(i-1);
      if(e.key==='ArrowRight')show(i+1);
    });
  })();


  // Ring video: pause and show the poster when the guest prefers less motion
  (function(){
    var fig=document.querySelector('.hero-print');
    if(!fig) return;
    var v=fig.querySelector('.ring-video');
    var img=fig.querySelector('.ring-fallback');
    if(!v) return;
    function apply(reduce){
      if(reduce){
        v.pause();
        v.removeAttribute('autoplay');
        v.hidden=true;
        if(img) img.hidden=false;
      }else{
        v.hidden=false;
        if(img) img.hidden=true;
        v.play().catch(function(){});
      }
    }
    var mq=window.matchMedia('(prefers-reduced-motion: reduce)');
    apply(mq.matches);
    if(mq.addEventListener) mq.addEventListener('change',function(e){apply(e.matches)});
    else if(mq.addListener) mq.addListener(function(e){apply(e.matches)});
  })();

})();
