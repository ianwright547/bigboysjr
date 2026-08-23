(function () {
  const cities = {
    marietta: ['Marietta', 'Cobb County homeowners, movers, and property managers can use item or load pricing for furniture, appliances, garage cleanouts, and mixed household junk.', 'IMG_6274.jpg'],
    decatur: ['Decatur', 'Decatur pickups can involve apartment access, compact driveways, and quick move-out timing. Share access details so the crew can plan correctly.', 'IMG_2948.jpg'],
    roswell: ['Roswell', 'Roswell households can price a single bulky item or a larger load before requesting a garage, basement, or home cleanout.', 'IMG_2966.jpg'],
    alpharetta: ['Alpharetta', 'From furniture swaps to larger household clear-outs, Alpharetta customers can choose a simple starting price online before booking.', 'IMG_6411.jpg'],
    buford: ['Buford', 'Buford-area pickups can start with item pricing for known pieces or load-size pricing for a mixed pile of unwanted junk.', 'IMG_2820.jpg'],
    lawrenceville: ['Lawrenceville', 'Lawrenceville homeowners and property managers can use Big Boys for furniture, appliances, and practical cleanout help.', 'IMG_5771.jpg'],
    'sandy-springs': ['Sandy Springs', 'Sandy Springs customers can plan a condo, home, office, or garage pickup with item or load-size pricing before requesting service.', 'IMG_6412.jpg'],
    kennesaw: ['Kennesaw', 'Kennesaw move-outs, furniture replacement, and garage-clear-out jobs can start with a direct online pricing path.', 'IMG_6402.jpg'],
    smyrna: ['Smyrna', 'Smyrna homes and rental properties can use Big Boys for bulky items, mixed household junk, and practical cleanout help.', 'IMG_2968.jpg'],
    tucker: ['Tucker', 'Tucker customers can price furniture, appliances, and mixed junk online, then add access notes for their requested pickup.', 'IMG_6464.jpg'],
    clarkston: ['Clarkston', 'Clarkston pickups can start with item-based or load-size pricing for unwanted household items and cleanout debris.', 'IMG_2467.jpg'],
    chamblee: ['Chamblee', 'Chamblee homeowners, renters, and businesses can request a pickup for furniture, appliances, cleanouts, and more.', 'IMG_4667.jpg'],
    brookhaven: ['Brookhaven', 'Brookhaven pickups often involve furniture replacement, apartment moves, and household cleanouts; start with an online price.', 'IMG_6386.jpg'],
    'stone-mountain': ['Stone Mountain', 'Stone Mountain customers can choose item pricing or a load size for furniture, appliances, and mixed junk removal.', 'IMG_4337.jpg']
  };
  const page = cities[document.body.dataset.city];
  if (!page) return;

  document.title = `Junk Removal in ${page[0]}, GA | Big Boys`;
  document.getElementById('cityName').textContent = page[0];
  document.getElementById('cityContent').innerHTML = `<div class="city-intro"><div><span class="eyebrow">Metro Atlanta service area</span><h2>Junk removal in ${page[0]}, GA</h2><p>${page[1]}</p><p>Choose individual items when you know what needs to go, or use trailer-load pricing for a mixed pile. Your estimate updates before the booking step.</p></div><figure><img src="../photos/junk-removal/${page[2]}" alt="Household junk removal work serving ${page[0]}, Georgia" loading="lazy" decoding="async"><figcaption>Real Big Boys junk-removal work.</figcaption></figure></div><h2>Popular services in ${page[0]}</h2><div class="area-dir"><a href="../services/furniture-removal.html">Furniture removal</a><a href="../services/appliance-removal.html">Appliance removal</a><a href="../services/cleanouts.html">Cleanouts</a><a href="../services/junk-removal.html">General junk removal</a></div><h2>Nearby Big Boys locations</h2><p>Big Boys serves Metro Atlanta from <a href="../atlanta/">Atlanta</a> and <a href="../suwanee/">Suwanee</a>. Call to confirm current route availability for your address.</p><div class="cta-row"><a class="btn btn-primary" href="../get-a-price-quote.html">Get a Price Quote</a><a class="btn btn-outline" href="tel:+14706606874">Call (470) 660-6874</a></div>`;

  const shell = document.createElement('script');
  shell.src = '../site-shell.js';
  shell.dataset.root = '../';
  document.body.append(shell);
})();
