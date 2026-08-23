(function () {
  const pages = {
    'furniture-removal': ['Furniture Removal', 'Couches, sofas, tables, chairs, dressers, desks, and other bulky furniture removed from wherever it sits.', 'IMG_6412.jpg'],
    'appliance-removal': ['Appliance Removal', 'Old refrigerators, freezers, washers, dryers, and other appliances picked up without a curbside requirement.', 'IMG_2820.jpg'],
    'mattress-removal': ['Mattress Removal & Disposal', 'Mattresses, box springs, bed frames, and related bedroom items removed from any room.', 'IMG_6386.jpg'],
    'hot-tub-removal': ['Hot Tub Removal', 'Bulky hot tubs and spa equipment removed from your property.', 'IMG_6127.jpg'],
    'yard-waste-removal': ['Yard Waste Removal', 'Branches, bagged yard debris, and outdoor clutter cleared out around Metro Atlanta.', 'IMG_5080.jpg'],
    cleanouts: ['Garage & Basement Cleanouts', 'Clear out crowded garages, basements, storage rooms, and other areas where unwanted items accumulate.', 'IMG_5771.jpg'],
    'construction-debris': ['Construction Debris Removal', 'Renovation and construction debris cleared out to help keep your project moving.', 'IMG_4337.jpg'],
    'commercial-junk-removal': ['Commercial Junk Removal', 'Office furniture, retail fixtures, warehouse junk, and commercial cleanout items removed with scheduling in mind.', 'IMG_2968.jpg']
  };
  const page = pages[document.body.dataset.service];
  if (!page) return;

  document.title = `${page[0]} in Atlanta & Suwanee, GA | Big Boys`;
  document.getElementById('serviceTitle').textContent = page[0];
  document.getElementById('serviceIntro').textContent = page[1];
  document.getElementById('serviceContent').innerHTML = `<div class="service-proof"><div><span class="eyebrow">Big Boys service</span><h2>${page[0]} in Metro Atlanta</h2><p>Big Boys gives Atlanta and Suwanee customers a clear path to pricing before pickup. Choose item-based or load-size pricing, then share access and timing details for the crew.</p><h2>What to expect</h2><ul><li>Online starting prices by item or trailer load size</li><li>An itemized estimate before the booking step</li><li>Crews handle carrying, loading, and removal</li><li>Space to explain stairs, disassembly, access, or timing</li></ul></div><figure><img src="../photos/junk-removal/${page[2]}" alt="${page[0]} job prepared for Big Boys pickup" loading="lazy" decoding="async"><figcaption>Real junk-removal work from the Big Boys photo library.</figcaption></figure></div><h2>Serving Atlanta and Suwanee</h2><p>Visit the <a href="../atlanta/">Atlanta service page</a> or <a href="../suwanee/">Suwanee service page</a>, or browse all <a href="../service-areas/index.html">Metro Atlanta service areas</a>.</p><div class="cta-row"><a class="btn btn-primary" href="../get-a-price-quote.html">Get a Price Quote</a><a class="btn btn-outline" href="tel:+14706606874">Call (470) 660-6874</a></div>`;

  const shell = document.createElement('script');
  shell.src = '../site-shell.js';
  shell.dataset.root = '../';
  document.body.append(shell);
})();
