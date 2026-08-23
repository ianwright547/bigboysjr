/* Ground Works — shared scripts (nav state, reveal-on-scroll, quote form) */
(function bootShared() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootShared);
    return;
  }
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 12) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('in-view'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
      reveals.forEach(el => io.observe(el));
      /* Safety: if IO hasn't fired by 200ms (iframe quirks),
         force-reveal anything currently in viewport. */
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 400 && r.bottom > -200) {
            el.classList.add('in-view');
          }
        });
      }, 200);
      /* Final safety: after 900ms reveal everything regardless. */
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in-view)').forEach(el => el.classList.add('in-view'));
      }, 900);
    }
  }

  /* Page-level quote form (inline on contact page) */
  const form = document.getElementById('quoteForm');
  if (form) wireForm(form);

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  const navToggle = document.getElementById('navToggle');
  const mm = document.getElementById('mobileMenu');
  const mmClose = document.getElementById('mmClose');
  if (navToggle && mm) {
    const open = () => {
      mm.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('modal-open');
    };
    const shut = () => {
      mm.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('modal-open');
    };
    navToggle.addEventListener('click', open);
    if (mmClose) mmClose.addEventListener('click', shut);
    mm.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mm.classList.contains('open')) shut();
    });

    // Accordion toggles for Services / Service Areas inside the mobile menu
    mm.querySelectorAll('.mm-acc-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const li = btn.closest('.has-sub');
        if (!li) return;
        const isOpen = li.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        // Close sibling accordions so only one is open at a time
        if (isOpen) {
          li.parentElement.querySelectorAll(':scope > li.has-sub').forEach((other) => {
            if (other !== li) {
              other.classList.remove('open');
              const otherBtn = other.querySelector('.mm-acc-toggle');
              if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    });
  }

  /* ============================================================
     QUOTE MODAL (triggered by [data-modal-open="quote"])
  ============================================================ */
  const modal = document.getElementById('quoteModal');
  if (modal) {
    const closeBtns = modal.querySelectorAll('[data-modal-close]');
    const openModal = (e) => {
      if (e) e.preventDefault();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    };
    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    };
    document.querySelectorAll('[data-modal-open="quote"]').forEach(btn => {
      btn.addEventListener('click', openModal);
    });
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    /* Click outside the box closes */
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
    /* Wire the modal form */
    const modalForm = modal.querySelector('form');
    if (modalForm) wireForm(modalForm);
  }

  /* Shared form-submit handler. Posts to the LeadConnector webhook. */
  const LEAD_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/KFkx6A9sEoJhhlwkxX3w/webhook-trigger/2e68a786-7660-4e9f-af32-d04d08652301';
  window.__postLead = async function(formEl) {
    const data = Object.fromEntries(new FormData(formEl).entries());
    data.source = 'seabee-jacks-az-website';
    data.form_id = formEl.id || 'unknown';
    data.page_url = window.location.href;
    data.page_title = document.title;
    data.submitted_at = new Date().toISOString();
    try {
      await fetch(LEAD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      });
      return true;
    } catch (err) {
      console.warn('Lead webhook post failed', err);
      return false;
    }
  };
  function wireForm(f) {
    /* Guard against double-submit (same form submitting multiple times within a second) */
    let submitting = false;
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitting) return;
      let bad = false;
      f.querySelectorAll('input[required], textarea[required]').forEach(i => {
        if (!i.value.trim()) { i.style.borderColor = 'var(--accent)'; bad = true; }
        else { i.style.borderColor = ''; }
      });
      if (bad) return;
      submitting = true;
      const btn = f.querySelector('.form-submit, [type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';
      await window.__postLead(f);
      btn.innerHTML = "Got it. We'll call you back.";
      btn.style.background = 'var(--surface-2)';
      btn.style.borderColor = 'var(--surface-2)';
      btn.style.color = 'var(--ink)';
      setTimeout(() => {
        f.reset();
        btn.disabled = false;
        submitting = false;
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 4000);
    });
  }
})();

/* ============================================================
   SHARED INTERACTIONS (hero video, reviews carousel, FAQ, area chips)
   All guarded by element presence so every page can load this file.
============================================================ */
(function bootInteractions(){
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', bootInteractions); return; }

  /* ---- HERO VIDEO ---- */
  (function(){
    var wrap = document.getElementById('heroVideo');
    if (!wrap) return;
    var vids = Array.prototype.slice.call(wrap.querySelectorAll('.hv'));
    if (!vids.length) return;
    var fallback = document.querySelector('.hero-bg');
    function showOnly(i){ vids.forEach(function(v,k){ v.classList.toggle('show', k === i); }); }
    function playClip(i){
      var v = vids[i];
      try { v.currentTime = 0; } catch(e){}
      var p = v.play();
      if (p && p.catch) p.catch(function(){ if (fallback){ fallback.style.opacity='0.5'; fallback.style.backgroundImage="url('photos/svc-no-start.jpg')"; } });
    }
    vids.forEach(function(v, i){
      v.addEventListener('ended', function(){ if (vids.length < 2) return; var n=(i+1)%vids.length; showOnly(n); playClip(n); });
      v.addEventListener('error', function(){ if (fallback){ fallback.style.opacity='0.5'; fallback.style.backgroundImage="url('photos/svc-no-start.jpg')"; } });
    });
    showOnly(0); playClip(0);
  })();

  /* ---- REVIEWS CAROUSEL ---- */
  (function(){
    var track = document.getElementById('revTrack');
    if (!track) return;
    var prev = document.getElementById('revPrev'), next = document.getElementById('revNext'), dotsWrap = document.getElementById('revDots');
    var slides = track.children.length, current = 0;
    function perView(){ var w = window.innerWidth; return w < 640 ? 1 : (w < 1024 ? 2 : 3); }
    function maxIndex(){ return Math.max(0, slides - perView()); }
    function render(){
      var pv = perView(), mi = maxIndex();
      if (current > mi) current = mi;
      track.style.transform = 'translateX(-' + (current * (100 / pv)) + '%)';
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current >= mi;
      if (dotsWrap){
        dotsWrap.innerHTML = '';
        for (var i = 0; i <= mi; i++){
          var b = document.createElement('button');
          b.className = 'rev-dot' + (i === current ? ' active' : '');
          b.setAttribute('aria-label', 'Go to slide ' + (i+1));
          (function(idx){ b.addEventListener('click', function(){ current = idx; render(); }); })(i);
          dotsWrap.appendChild(b);
        }
      }
    }
    if (prev) prev.addEventListener('click', function(){ if (current > 0){ current--; render(); } });
    if (next) next.addEventListener('click', function(){ if (current < maxIndex()){ current++; render(); } });
    var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(render, 120); });
    var sx = null;
    track.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', function(e){
      if (sx === null) return;
      var d = sx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50){ if (d > 0 && current < maxIndex()) current++; else if (d < 0 && current > 0) current--; render(); }
      sx = null;
    }, {passive:true});
    render();
  })();

  /* ---- FAQ ACCORDION ---- */
  (function(){
    var list = document.getElementById('faqList');
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll('.faq-item'));
    function setOpen(item, open){
      var a = item.querySelector('.faq-a'), btn = item.querySelector('.faq-q');
      if (open){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; btn.setAttribute('aria-expanded','true'); }
      else { item.classList.remove('open'); a.style.maxHeight = 0; btn.setAttribute('aria-expanded','false'); }
    }
    items.forEach(function(item){
      item.querySelector('.faq-q').addEventListener('click', function(){
        var isOpen = item.classList.contains('open');
        items.forEach(function(o){ setOpen(o, false); });
        if (!isOpen) setOpen(item, true);
      });
    });
    var first = list.querySelector('.faq-item.open');
    if (first){ var fa = first.querySelector('.faq-a'); fa.style.maxHeight = fa.scrollHeight + 'px'; }
    window.addEventListener('resize', function(){
      var op = list.querySelector('.faq-item.open .faq-a');
      if (op){ op.style.maxHeight = 'none'; var h = op.scrollHeight; op.style.maxHeight = h + 'px'; }
    });
  })();

  /* ---- SERVICE AREA CHIPS ---- */
  (function(){
    var wrap = document.getElementById('areaChips');
    if (!wrap) return;
    var callout = document.getElementById('areaCallout'), caName = document.getElementById('caName'), caRt = document.getElementById('caRt');
    var chips = Array.prototype.slice.call(wrap.querySelectorAll('.area-chip'));
    function activate(chip){
      chips.forEach(function(c){ c.classList.remove('active'); });
      chip.classList.add('active');
      if (caName) caName.textContent = chip.textContent.trim();
      if (caRt) caRt.textContent = chip.getAttribute('data-rt') || 'Same day';
      if (callout) callout.classList.add('open');
    }
    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        if (chip.classList.contains('active')){ chip.classList.remove('active'); if (callout) callout.classList.remove('open'); }
        else { activate(chip); }
      });
    });
    if (chips[0]) activate(chips[0]);
  })();

  /* ---- GENERIC LEAD FORM (hero / inline on subpages) ---- */
  (function(){
    var forms = Array.prototype.slice.call(document.querySelectorAll('form[data-lead]'));
    forms.forEach(function(f){
      f.addEventListener('submit', function(e){
        e.preventDefault();
        var bad = false;
        f.querySelectorAll('input[required]').forEach(function(i){ if (!i.value.trim()){ i.style.borderColor='var(--yellow-dark)'; bad=true; } else { i.style.borderColor=''; } });
        if (bad) return;
        var btn = f.querySelector('.form-submit, [type="submit"]');
        var original = btn.innerHTML;
        btn.innerHTML = "Got it. Jack will call you back.";
        btn.style.background = 'var(--ink)'; btn.style.color = '#fff';
        setTimeout(function(){ f.reset(); btn.innerHTML = original; btn.style.background=''; btn.style.color=''; }, 4000);
      });
    });
  })();
})();
