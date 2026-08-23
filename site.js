document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 12), {passive:true});
  document.querySelectorAll('.faq-q').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item'); const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-q')?.setAttribute('aria-expanded','false'); });
    if (!isOpen) { item.classList.add('open'); button.setAttribute('aria-expanded','true'); }
  }));
  document.getElementById('zipStart')?.addEventListener('submit', (e) => { e.preventDefault(); const zip = new FormData(e.currentTarget).get('zip'); location.href = `get-a-price-quote.html?zip=${encodeURIComponent(zip)}`; });
});
