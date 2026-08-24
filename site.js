document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 12), {passive:true});
  const navMenus = document.querySelectorAll('.nav-menu details');
  navMenus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) navMenus.forEach(other => { if (other !== menu) other.open = false; });
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-menu')) navMenus.forEach(menu => { menu.open = false; });
  });
  const compare = document.querySelector('.compare');
  const compareInput = compare?.querySelector('input[type="range"]');
  compareInput?.addEventListener('input', () => compare.style.setProperty('--position', `${compareInput.value}%`));
  const areaSelect = document.getElementById('homeAreaSelect');
  document.getElementById('homeAreaGo')?.addEventListener('click', () => {
    if (areaSelect?.value) location.href = areaSelect.value;
    else areaSelect?.focus();
  });
  const faqList = document.getElementById('faqList');
  if (faqList) {
    const extraFaqs = [
      ['Do I need to be home for junk removal?', 'Not necessarily. If the crew can safely access the items and you have confirmed the pickup details, we can often coordinate a convenient no-contact or curbside pickup. Call us if you have a unique access situation.'],
      ['Can you remove items from upstairs or the basement?', 'Yes. Tell us about stairs, elevators, narrow paths, or other access details during the quote. Those details help us plan the crew and show an accurate estimate.'],
      ['What items cannot be removed?', 'Some hazardous materials, chemicals, and restricted items require a different disposal route. If you are unsure about a specific item, call us before booking and we will point you in the right direction.'],
      ['Do you donate or recycle items?', 'Whenever practical, reusable and recyclable items are diverted from disposal. The best destination depends on an item’s condition, material, and the options available at the time of pickup.'],
      ['How quickly can I get a pickup?', 'Availability varies by day and location. The online quote flow shows your booking options, and same-day service may be available when the schedule has room.']
    ];
    faqList.insertAdjacentHTML('beforeend', extraFaqs.map(([question, answer]) => `<div class="faq-item"><button class="faq-q" aria-expanded="false"><h3>${question}</h3><span class="faq-icon" aria-hidden="true">+</span></button><div class="faq-a"><div class="inner"><p>${answer}</p></div></div></div>`).join(''));
    faqList.querySelectorAll('.faq-q').forEach((button, index) => {
      const item = button.closest('.faq-item'); const answer = item.querySelector('.faq-a');
      const id = `faq-answer-${index + 1}`; answer.id = id; button.setAttribute('aria-controls', id);
      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqList.querySelectorAll('.faq-item').forEach(entry => { entry.classList.remove('open'); entry.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false'); });
        if (!isOpen) { item.classList.add('open'); button.setAttribute('aria-expanded', 'true'); }
      });
    });
  }
  document.getElementById('zipStart')?.addEventListener('submit', (e) => { e.preventDefault(); const zip = new FormData(e.currentTarget).get('zip'); location.href = `get-a-price-quote.html?zip=${encodeURIComponent(zip)}`; });
});
