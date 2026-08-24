(function () {
  const script = document.currentScript;
  const root = script?.dataset.root || '';
  const main = document.querySelector('main');
  if (!main) return;

  const navMarkup = `<a class="brand-logo" href="${root}index.html" aria-label="Big Boys Junk Removal home"><img src="${root}photos/big-boys-mark.png" alt="" width="64" height="52"><span><strong>Big Boys</strong><small>Junk Removal</small></span></a>
    <ul class="nav-links">
      <li><a href="${root}index.html">Home</a></li>
      <li class="nav-menu"><details><summary>Services <span aria-hidden="true">+</span></summary><div class="nav-dropdown"><a href="${root}services/index.html"><strong>All Services</strong><small>Explore everything we haul</small></a><a href="${root}services/junk-removal.html">General junk removal</a><a href="${root}services/furniture-removal.html">Furniture removal</a><a href="${root}services/appliance-removal.html">Appliance removal</a><a href="${root}services/mattress-removal.html">Mattress removal</a><a href="${root}services/cleanouts.html">Home and estate cleanouts</a><a href="${root}services/yard-waste-removal.html">Yard waste removal</a><a href="${root}services/construction-debris.html">Construction debris</a><a href="${root}services/commercial-junk-removal.html">Commercial junk removal</a></div></details></li>
      <li class="nav-menu"><details><summary>Service Areas <span aria-hidden="true">+</span></summary><div class="nav-dropdown areas-dropdown"><a href="${root}service-areas/index.html"><strong>All Service Areas</strong><small>Metro Atlanta coverage</small></a><a href="${root}atlanta/">Atlanta</a><a href="${root}suwanee/">Suwanee</a><a href="${root}marietta/">Marietta</a><a href="${root}decatur/">Decatur</a><a href="${root}roswell/">Roswell</a><a href="${root}alpharetta/">Alpharetta</a><a href="${root}buford/">Buford</a><a href="${root}lawrenceville/">Lawrenceville</a></div></details></li>
      <li><a href="${root}blog/index.html">Guides</a></li><li><a href="${root}contact.html">Contact</a></li>
    </ul>
    <div class="nav-actions"><a class="nav-call" href="tel:+14706606874">Call Now</a><a class="nav-cta" href="${root}get-a-price-quote.html">Get My Price</a></div>`;

  let nav = document.querySelector('.nav-wrap .nav');
  if (!nav) {
    main.insertAdjacentHTML('beforebegin', `<div class="topbar"><div class="inner"><span>Serving Metro Atlanta from Atlanta and Suwanee</span><a href="tel:+14706606874">Call (470) 660-6874</a></div></div><div class="nav-wrap"><nav class="nav" aria-label="Primary navigation">${navMarkup}</nav></div>`);
    nav = document.querySelector('.nav-wrap .nav');
  } else {
    nav.innerHTML = navMarkup;
  }

  const menus = nav.querySelectorAll('.nav-menu details');
  menus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) menus.forEach(other => { if (other !== menu) other.open = false; });
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-menu')) menus.forEach(menu => { menu.open = false; });
  });

  if (!document.querySelector('.footer')) {
    main.insertAdjacentHTML('afterend', `<footer class="footer"><div class="footer-inner"><div class="footer-grid"><div class="footer-brand"><a class="footer-logo" href="${root}index.html"><img src="${root}photos/big-boys-mark.png" alt="Big Boys Junk Removal logo" width="64" height="52"><span>Big Boys<br>Junk Removal</span></a><p>Upfront junk removal pricing for Atlanta, Suwanee, and surrounding Metro Atlanta communities</p><a class="footer-call" href="tel:+14706606874">Call (470) 660-6874</a></div><div class="footer-col"><h4>Explore</h4><ul><li><a href="${root}services/index.html">Services</a></li><li><a href="${root}service-areas/index.html">Service Areas</a></li><li><a href="${root}blog/index.html">Guides</a></li><li><a href="${root}about.html">About</a></li></ul></div><div class="footer-col"><h4>Locations</h4><ul><li><a href="${root}atlanta/">Atlanta</a></li><li><a href="${root}suwanee/">Suwanee</a></li><li><a href="${root}marietta/">Marietta</a></li><li><a href="${root}buford/">Buford</a></li></ul></div><div class="footer-col"><h4>Contact</h4><div class="footer-card"><div class="l1">Big Boys Junk Removal</div><div class="l2">(470) 660-6874<br>support@bigboysjr.com</div></div></div></div><div class="footer-bottom"><span>© 2026 Big Boys Junk Removal</span><div class="links"><a href="${root}privacy-policy.html">Privacy</a><a href="${root}terms-of-service.html">Terms</a></div></div></div></footer>`);
  }
})();
