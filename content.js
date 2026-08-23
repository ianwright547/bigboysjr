window.BIG_BOYS = {
  phone: '(470) 660-6874',
  services: [
    ['Furniture Removal','Couches, tables, dressers, and bulky pieces carried out from wherever they are.','services/furniture-removal.html'],
    ['Appliance Removal','Old appliances hauled away without you having to move them to the curb.','services/appliance-removal.html'],
    ['Mattress Removal','Mattresses, box springs, and bed frames picked up from any room.','services/mattress-removal.html'],
    ['Hot Tub Removal','Bulky hot tubs and spa equipment removed from your property.','services/hot-tub-removal.html'],
    ['Yard Waste Removal','Branches, bagged yard waste, and outdoor debris cleared out.','services/yard-waste-removal.html'],
    ['General Junk Removal','A practical option for mixed household junk and unwanted items.','services/junk-removal.html'],
    ['Garage & Basement Cleanouts','Clear a crowded garage, basement, or other storage space.','services/cleanouts.html'],
    ['Construction Debris','Cleanup for renovation and construction debris.','services/construction-debris.html'],
    ['Commercial Junk Removal','Office, retail, warehouse, and business cleanouts.','services/commercial-junk-removal.html']
  ],
  posts: [
    ['Junk Removal Tips','How Much Does Junk Removal Cost in Atlanta?','A straightforward look at item and load pricing for Metro Atlanta.','blog/how-much-does-junk-removal-cost-atlanta.html'],
    ['Planning a Cleanout','Same-Day Junk Removal vs. Dumpster Rental','Compare speed, convenience, and project fit before you decide.','blog/same-day-junk-removal-vs-dumpster-rental.html'],
    ['Disposal & Recycling','What Items Can Be Recycled or Removed?','A practical guide to common items and responsible disposal.','blog/what-items-can-be-recycled-or-removed.html']
  ],
  reviews: [
    ['Heather Dobbs','Excellent service, great guys! Helped me out big time!'],
    ['Green','I called today for a quote and availability and they were able to stop by today to safely remove an upright piano. Thank you so much for your promptness!'],
    ['Nancy Hughes','Devin and team were within schedule, polite and cheerful. Thank you for showing respect to our property!'],
    ['Seth Winterbottom','Scheduling and communication were top notch. They did a great job incredibly quickly. Couldn’t be happier.'],
    ['Aurora Cardella','Great experience! Smooth booking and estimate process. Efficient and polite employees. I’ll definitely use them again!'],
    ['yS Chang','A real pleasure working with these two hard-working young men. Good communication, prompt service, and a fair price.'],
    ['Rebecca Stopper','Came out the same day I called, which was great. Very pleasant workers and extremely efficient.'],
    ['Sudagar Sundaram','Was on time and did a great job removing our sofa and loveseat. Will call them again.'],
    ['Sage Nance','Professional, efficient, and affordable!']
  ]
};
document.addEventListener('DOMContentLoaded', () => {
  const {services, posts, reviews} = window.BIG_BOYS;
  const serviceGrid = document.getElementById('serviceGrid');
  if (serviceGrid) serviceGrid.innerHTML = services.map(([name, text, href]) => `<article class="svc reveal in-view"><div class="bd"><h3>${name}</h3><p>${text}</p><ul class="feats"><li>Upfront pricing</li><li>We do the lifting</li></ul><div class="acts"><a class="svc-btn call" href="get-a-price-quote.html">Price it</a><a class="svc-btn alt" href="${href}">Details</a></div></div></article>`).join('');
  const blogGrid = document.getElementById('blogGrid');
  if (blogGrid) blogGrid.innerHTML = posts.map(([cat,title,text,href]) => `<a class="post-card" href="${href}"><div class="bd"><span class="cat">${cat}</span><h3>${title}</h3><p>${text}</p><span class="more">Read more →</span></div></a>`).join('');
  const reviewGrid = document.getElementById('reviewGrid');
  if (reviewGrid) reviewGrid.innerHTML = reviews.map(([name,text]) => `<article class="review-card"><div class="review-stars" aria-label="5 out of 5 stars">★★★★★</div><p>“${text}”</p><strong>${name}</strong><span class="review-source">Google review</span></article>`).join('');
});
