// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const revealIO = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add('in'); revealIO.unobserve(en.target); }
  });
}, {threshold:.15});
revealEls.forEach(el=> revealIO.observe(el));

// ---------- Animated counters ----------
const counters = document.querySelectorAll('.counter b');
const counterIO = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 900;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(progress * target) + suffix;
        if(progress < 1){ requestAnimationFrame(tick); }
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    }
  });
}, {threshold:.4});
counters.forEach(el=> counterIO.observe(el));

// ---------- Quote builder ----------
const propertyOptions = document.getElementById('propertyOptions');
const serviceOptions = document.getElementById('serviceOptions');
const calcSummary = document.getElementById('calcSummary');
const calcSend = document.getElementById('calcSend');

let selectedProperty = null;
const selectedServices = new Set();

propertyOptions.querySelectorAll('button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    propertyOptions.querySelectorAll('button').forEach(b=> b.classList.remove('active'));
    btn.classList.add('active');
    selectedProperty = btn.dataset.value;
    updateSummary();
  });
});

serviceOptions.querySelectorAll('button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    btn.classList.toggle('active');
    if(btn.classList.contains('active')){ selectedServices.add(btn.dataset.value); }
    else{ selectedServices.delete(btn.dataset.value); }
    updateSummary();
  });
});

function updateSummary(){
  if(!selectedProperty || selectedServices.size === 0){
    calcSummary.textContent = 'Pick a property type and at least one service above.';
    calcSend.classList.add('btn-disabled');
    calcSend.classList.remove('btn-sun');
    calcSend.removeAttribute('href');
    return;
  }
  const servicesList = Array.from(selectedServices).join(', ').replace(/&amp;/g,'&');
  const message = `Hi GreenNest, I'd like a quote for ${selectedProperty}. I need: ${servicesList}. Could you send pricing and availability?`;
  calcSummary.textContent = message;
  calcSend.classList.remove('btn-disabled');
  calcSend.classList.add('btn-sun');
  calcSend.href = `https://wa.me/254707374749?text=${encodeURIComponent(message)}`;
}
