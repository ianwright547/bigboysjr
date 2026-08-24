(function () {
  const locations = {
    atlanta: {
      name: 'Atlanta',
      area: 'Central and North Metro Atlanta',
      neighborhoods: 'Buckhead, Brookhaven, Chamblee, Decatur, Tucker, Sandy Springs, and nearby intown communities',
      address: '3201 Henderson Mill Road, Atlanta, GA 30341',
      image: 'IMG_5771.jpg',
      context: 'Apartment moves, older homes, busy streets, office buildings, and multi-floor cleanouts are common Atlanta jobs'
    },
    suwanee: {
      name: 'Suwanee',
      area: 'Gwinnett and Northeast Metro Atlanta',
      neighborhoods: 'Buford, Lawrenceville, Duluth, Johns Creek, Sugar Hill, and surrounding Gwinnett communities',
      address: '2317 Breton Hunt Lane, Suwanee, GA 30024',
      image: 'IMG_4667.jpg',
      context: 'Growing neighborhoods, move-outs, garage projects, appliance replacements, and larger household clear-outs are common Suwanee jobs'
    }
  };
  const location = locations[document.body.dataset.location];
  if (!location) return;
  const root = '../';
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

  document.title = `Junk Removal in ${location.name}, GA | Big Boys Junk Removal`;
  const locationTitle = document.querySelector('.subhero h1');
  if (locationTitle) locationTitle.textContent = `Junk Removal in ${location.name}`;
  document.getElementById('locationName').textContent = location.name;
  document.getElementById('locationAddress').textContent = location.address;
  const meta = document.createElement('meta');
  meta.name = 'keywords';
  meta.content = `junk removal ${location.name}, same-day junk removal ${location.name}, furniture removal ${location.name}, garage cleanout ${location.name}, appliance pickup Metro Atlanta`;
  document.head.append(meta);

  const services = window.BIG_BOYS?.services || [];
  const reviews = window.BIG_BOYS?.reviews || [];
  const posts = window.BIG_BOYS?.posts || [];
  const serviceCards = services.slice(0, 6).map(([name, text, href]) => `<article class="svc reveal in-view"><div class="bd"><h3>${esc(name)}</h3><p>${esc(text)}</p><ul class="feats"><li>Upfront pricing</li><li>We do the lifting</li></ul><div class="acts"><a class="svc-btn call" href="${root}get-a-price-quote.html">Price it</a><a class="svc-btn alt" href="${root}${href}">Details</a></div></div></article>`).join('');
  const reviewCards = reviews.slice(0, 3).map(([name, text]) => `<article class="review-card"><div class="review-stars" aria-label="5 out of 5 stars">★★★★★</div><p>“${esc(text)}”</p><strong>${esc(name)}</strong><span class="review-source">Google review</span></article>`).join('');
  const postCards = posts.slice(0, 3).map(([cat, title, text, href]) => `<a class="post-card" href="${root}${href}"><div class="bd"><span class="cat">${esc(cat)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p><span class="more">Read more →</span></div></a>`).join('');

  document.querySelector('.subhero')?.remove();
  const locationContent = document.getElementById('locationContent');
  const locationSection = locationContent.closest('.section');
  if (locationSection) {
    locationSection.className = 'location-home-content';
    locationSection.innerHTML = '';
    locationSection.append(locationContent);
    locationContent.className = '';
  }
  locationContent.innerHTML = `
    <header class="hero hero-centered location-home-hero" id="top">
      <div class="hero-slides" aria-hidden="true"><img class="hero-slide active" src="${root}photos/junk-removal/${location.image}" alt="" width="1350" height="1800"></div>
      <div class="hero-inner"><div class="hero-content">
        <span class="hero-kicker">Local junk removal in ${esc(location.area)}</span>
        <h1>Junk Removal in ${esc(location.name)}</h1>
        <p class="hero-sub">Upfront pricing for furniture, appliances, cleanouts, yard debris, and same-day pickup options across ${esc(location.name)}, Georgia</p>
        <div class="hero-cta"><a class="btn btn-primary" href="${root}get-a-price-quote.html">Get My Upfront Price</a><a class="btn btn-ghost" href="tel:+14706606874">Call (470) 660-6874</a></div>
        <div class="hero-trust"><span>Fully insured</span><span>Background-checked crew</span><span>Local ${esc(location.name)} coverage</span></div>
      </div></div>
    </header>
    <section class="proof-ticker" aria-label="${esc(location.name)} customer reviews"><div class="proof-track"><article><span class="stars">★★★★★</span><p>Excellent service and great guys</p><strong>Heather Dobbs</strong></article><article><span class="stars">★★★★★</span><p>Prompt, polite, and incredibly efficient</p><strong>Nancy Hughes</strong></article><article><span class="stars">★★★★★</span><p>Same-day help when we needed it</p><strong>Rebecca Stopper</strong></article></div></section>
    <section class="section"><div class="container"><div class="sec-head centered"><span class="eyebrow">Built for ${esc(location.name)}</span><h2 class="h-h2">A cleaner pickup from the first call</h2><p class="body">${esc(location.context)}. Big Boys handles the carrying, loading, and haul-away so you can get back to using your space.</p></div><div class="services-grid">${serviceCards}</div><div class="services-foot"><a class="btn btn-primary" href="${root}services/index.html">Explore All Services</a></div></div></section>
    <section class="section process"><div class="container"><div class="sec-head centered"><span class="eyebrow">How it works</span><h2 class="h-h2">Simple junk removal in ${esc(location.name)}</h2></div><div class="process-grid"><article class="process-card"><span>01</span><h3>Build your estimate</h3><p>Choose individual items or estimate trailer space for a mixed ${esc(location.name)} cleanout.</p></article><article class="process-card"><span>02</span><h3>Share the details</h3><p>Add your address, access notes, timing, stairs, parking, and anything unusual.</p></article><article class="process-card"><span>03</span><h3>We clear the space</h3><p>The local crew arrives, confirms the scope, carries everything out, and hauls it away.</p></article></div></div></section>
    <section class="section home-quote"><div class="container quote-grid"><div class="quote-left"><span class="eyebrow">${esc(location.name)} pricing</span><h2 class="h-h1">Know your starting price before pickup</h2><p class="lede">Price a short list of furniture or estimate a mixed load for a garage, move-out, estate, or commercial cleanout.</p><ul class="quote-points"><li>No-obligation estimate</li><li>Item and load-size options</li><li>Same-day requests when available</li></ul></div><div class="form-card"><div class="form-head"><h3>Start with your ZIP code</h3><span class="badge">Takes about 2 minutes</span></div><form action="${root}get-a-price-quote.html" method="get"><div class="form-field"><label for="${location.name.toLowerCase()}-zip">Pickup ZIP code</label><input id="${location.name.toLowerCase()}-zip" name="zip" inputmode="numeric" maxlength="5" pattern="[0-9]{5}" placeholder="Enter 5-digit ZIP" required></div><button class="form-submit" type="submit">Start My Estimate</button><p class="form-note">Prefer a person? <a href="tel:+14706606874">Call (470) 660-6874</a></p></form></div></div></section>
    <section class="section reviews"><div class="container"><div class="reviews-heading"><div><span class="eyebrow">Verified local feedback</span><h2 class="h-h2">${esc(location.name)} neighbors recommend Big Boys</h2></div><div class="rating-lockup"><strong>4.9</strong><span>★★★★★<small>127 Google reviews</small></span></div></div><div class="reviews-grid">${reviewCards}</div></div></section>
    <section class="section"><div class="container"><div class="sec-head"><span class="eyebrow">Local planning guides</span><h2 class="h-h2">Helpful advice for your ${esc(location.name)} pickup</h2><p class="body">Learn how to prepare a cleanout, compare removal options, and keep reusable items out of the landfill.</p></div><div class="posts-grid">${postCards}</div><a class="btn btn-outline" href="${root}blog/index.html">Read All Guides</a></div></section>
    <section class="section faq"><div class="container"><div class="sec-head"><span class="eyebrow">${esc(location.name)} FAQ</span><h2 class="h-h2">Questions before pickup</h2></div><div class="faq-wrap"><div class="faq-list"><div class="faq-item open"><button class="faq-q" aria-expanded="true"><h3>How much does junk removal cost in ${esc(location.name)}?</h3><span class="faq-icon">+</span></button><div class="faq-a"><div class="inner"><p>Pricing depends on the items, volume, access, and labor. Use the online estimator to see item or load-size pricing before requesting pickup.</p></div></div></div><div class="faq-item"><button class="faq-q" aria-expanded="false"><h3>Can I request same-day service?</h3><span class="faq-icon">+</span></button><div class="faq-a"><div class="inner"><p>Same-day availability depends on route capacity. Call early or start a quote to check the current ${esc(location.name)} schedule.</p></div></div></div><div class="faq-item"><button class="faq-q" aria-expanded="false"><h3>What can Big Boys remove?</h3><span class="faq-icon">+</span></button><div class="faq-a"><div class="inner"><p>We commonly remove furniture, appliances, mattresses, household clutter, garage contents, yard debris, renovation debris, and approved commercial material.</p></div></div></div></div></div></div></section>
    <section class="service-local"><div class="container"><h2>Start junk removal in ${esc(location.name)}</h2><p>${esc(location.neighborhoods)} are part of the broader Big Boys service footprint. Call when your ZIP code is near the edge of the area or a project has a firm deadline.</p><div class="cta-row"><a class="btn btn-primary" href="${root}get-a-price-quote.html">Start My Estimate</a><a class="btn btn-outline" href="${root}service-areas/index.html">View All Service Areas</a></div></div></section>`;
})();
