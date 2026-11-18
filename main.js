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
})();
