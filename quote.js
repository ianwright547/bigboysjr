(function () {
  const app = document.getElementById('quoteApp');
  const steps = [...document.querySelectorAll('.quote-steps li')];
  const progress = document.querySelector('.quote-progress i');
  const params = new URLSearchParams(location.search);
  const state = {
    method: '', items: [], load: null, stairs: 0, disassembly: 0,
    sameDay: false, zip: params.get('zip') || '', customer: {}
  };

  const catalog = [
    ['Mattress', 15, 'Bedroom'], ['Box spring', 20, 'Bedroom'],
    ['Couch or loveseat', 30, 'Furniture'], ['Dresser', 20, 'Furniture'],
    ['Desk', 20, 'Furniture'], ['Table', 25, 'Furniture'],
    ['Refrigerator or freezer', 50, 'Appliances'], ['Toolbox', 25, 'Garage'],
    ['Recliner', 90, 'Furniture'], ['Bag of junk', 20, 'General']
  ].map(([name, price, category]) => ({name, price, category}));
  const loads = [
    ['1/8 load', 99, 'A few small items'], ['1/4 load', 169, 'Several bulky items'],
    ['3/8 load', 239, 'Small room or light cleanout'], ['1/2 load', 309, 'Half trailer'],
    ['5/8 load', 399, 'Medium cleanout'], ['3/4 load', 499, 'Large cleanout'],
    ['7/8 load', 599, 'Nearly full trailer'], ['Full load', 699, 'Maximum standard load']
  ].map(([name, price, description], index) => ({name, price, description, index}));

  const money = value => `$${value.toLocaleString()}`;
  const fee = () => state.method === 'item' ? 49 : 0;
  const subtotal = () => state.method === 'load'
    ? (state.load?.price || 0)
    : state.items.reduce((sum, item) => sum + item.price * item.qty, 0) + fee();
  const total = () => subtotal() + state.stairs * 10 + state.disassembly * 20 + (state.sameDay ? 20 : 0);
  const setStep = step => {
    steps.forEach((item, index) => {
      item.classList.toggle('active', index === step);
      item.classList.toggle('complete', index < step);
    });
    progress.style.width = `${(step + 1) * 20}%`;
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  const actions = (back, next, disabled = false, nextText = 'Continue') => `<div class="quote-actions"><button class="quote-btn secondary" type="button" data-back>${back}</button><button class="quote-btn primary" type="button" data-next ${disabled ? 'disabled' : ''}>${nextText}</button></div>`;
  const support = () => `<aside class="quote-support"><div><strong>Not sure what to choose?</strong><span>Talk through a large, heavy, or unusual job with the team</span></div><a href="tel:+14706606874">Call (470) 660-6874</a></aside>`;

  function methodScreen() {
    setStep(0);
    app.innerHTML = `<section class="quote-screen"><header><span class="quote-eyebrow">Step 1 of 5</span><h1>Choose the easiest way to describe your job</h1><p>Both paths lead to the same pickup request. Pick the one that best matches what you know</p></header>
      <div class="quote-choice-grid">
        <button type="button" data-method="item"><span class="choice-number">01</span><strong>Price by item</strong><p>Best when you know the furniture, appliances, or other pieces that need to go</p><small>Build a detailed item list</small></button>
        <button type="button" data-method="load"><span class="choice-number">02</span><strong>Price by load size</strong><p>Best for mixed piles, garage cleanouts, estate cleanouts, and larger projects</p><small>Estimate trailer space</small></button>
      </div>${actions('Back to home', 'Continue', true)}${support()}</section>`;
    let selected = state.method;
    if (selected) app.querySelector(`[data-method="${selected}"]`)?.classList.add('selected');
    app.querySelector('[data-back]').onclick = () => location.href = 'index.html';
    app.querySelectorAll('[data-method]').forEach(button => button.onclick = () => {
      selected = button.dataset.method;
      app.querySelectorAll('[data-method]').forEach(item => item.classList.toggle('selected', item === button));
      app.querySelector('[data-next]').disabled = false;
    });
    app.querySelector('[data-next]').onclick = () => {
      state.method = selected;
      selected === 'item' ? itemScreen() : loadScreen();
    };
  }

  function itemScreen() {
    setStep(1);
    app.innerHTML = `<section class="quote-screen"><header><span class="quote-eyebrow">Step 2 of 5</span><h1>Build your pickup list</h1><p>Add the known items now. You can describe anything unusual in the notes before sending the request</p></header>
      <label class="quote-search"><span>Search items</span><input type="search" data-search placeholder="Try couch, mattress, freezer, desk" autocomplete="off"></label>
      <div class="clean-item-grid">${catalog.map((item, index) => {
        const qty = state.items.find(entry => entry.name === item.name)?.qty || 0;
        return `<article data-item-card data-name="${item.name.toLowerCase()} ${item.category.toLowerCase()}"><span>${item.category}</span><strong>${item.name}</strong><small>From ${money(item.price)}</small><div class="clean-stepper"><button type="button" data-minus="${index}" aria-label="Remove one ${item.name}">−</button><b data-qty="${index}">${qty}</b><button type="button" data-plus="${index}" aria-label="Add one ${item.name}">+</button></div></article>`;
      }).join('')}</div>
      <p class="quote-message" data-message>${state.items.length ? `${state.items.reduce((sum, item) => sum + item.qty, 0)} item selections added` : 'Add at least one item to continue'}</p>
      ${actions('Back', 'Continue', !state.items.length)}${support()}</section>`;
    const quantity = index => state.items.find(entry => entry.name === catalog[index].name)?.qty || 0;
    const update = (index, change) => {
      const item = catalog[index];
      let selected = state.items.find(entry => entry.name === item.name);
      if (!selected && change > 0) { selected = {...item, qty: 0}; state.items.push(selected); }
      if (selected) selected.qty = Math.max(0, selected.qty + change);
      state.items = state.items.filter(entry => entry.qty > 0);
      app.querySelector(`[data-qty="${index}"]`).textContent = quantity(index);
      app.querySelector('[data-next]').disabled = !state.items.length;
      app.querySelector('[data-message]').textContent = state.items.length ? `${state.items.reduce((sum, entry) => sum + entry.qty, 0)} item selections added` : 'Add at least one item to continue';
    };
    app.querySelector('[data-search]').oninput = event => {
      const query = event.target.value.trim().toLowerCase();
      app.querySelectorAll('[data-item-card]').forEach(card => card.hidden = !!query && !card.dataset.name.includes(query));
    };
    app.querySelectorAll('[data-plus]').forEach(button => button.onclick = () => update(+button.dataset.plus, 1));
    app.querySelectorAll('[data-minus]').forEach(button => button.onclick = () => update(+button.dataset.minus, -1));
    app.querySelector('[data-back]').onclick = methodScreen;
    app.querySelector('[data-next]').onclick = detailScreen;
  }

  function loadScreen() {
    setStep(1);
    app.innerHTML = `<section class="quote-screen"><header><span class="quote-eyebrow">Step 2 of 5</span><h1>Estimate how much space you need</h1><p>Choose the closest trailer fraction. The crew confirms the final scope before work begins</p></header>
      <div class="load-summary"><span>Your selection</span><strong>${state.load ? state.load.name : 'Choose a load size'}</strong><b>${state.load ? money(state.load.price) : 'Starting prices shown below'}</b></div>
      <div class="clean-load-grid">${loads.map(load => `<button type="button" data-load="${load.index}" class="${state.load?.index === load.index ? 'selected' : ''}"><span>${load.name}</span><strong>${money(load.price)}</strong><small>${load.description}</small></button>`).join('')}</div>
      ${actions('Back', 'Continue', !state.load)}${support()}</section>`;
    app.querySelectorAll('[data-load]').forEach(button => button.onclick = () => {
      state.load = loads[+button.dataset.load];
      loadScreen();
    });
    app.querySelector('[data-back]').onclick = methodScreen;
    app.querySelector('[data-next]').onclick = detailScreen;
  }

  function detailScreen() {
    setStep(2);
    app.innerHTML = `<section class="quote-screen"><header><span class="quote-eyebrow">Step 3 of 5</span><h1>Add the details that affect the work</h1><p>These details help the crew understand access, labor, and scheduling before arrival</p></header>
      <div class="detail-stack">
        <article><div><strong>Stairs</strong><span>$10 per flight or stair set</span></div><div class="clean-stepper"><button type="button" data-stairs-minus>−</button><b>${state.stairs}</b><button type="button" data-stairs-plus>+</button></div></article>
        <article><div><strong>Items needing disassembly</strong><span>$20 per item</span></div><div class="clean-stepper"><button type="button" data-dis-minus>−</button><b>${state.disassembly}</b><button type="button" data-dis-plus>+</button></div></article>
        <label><div><strong>Same-day priority request</strong><span>Add $20 when scheduling allows</span></div><input type="checkbox" data-same-day ${state.sameDay ? 'checked' : ''}></label>
      </div>
      <div class="running-total"><span>Current estimate</span><strong>${money(total())}</strong><small>Final price is confirmed after scope review</small></div>
      ${actions('Back', 'Review Estimate', false, 'Review Estimate')}</section>`;
    app.querySelector('[data-stairs-minus]').onclick = () => { state.stairs = Math.max(0, state.stairs - 1); detailScreen(); };
    app.querySelector('[data-stairs-plus]').onclick = () => { state.stairs += 1; detailScreen(); };
    app.querySelector('[data-dis-minus]').onclick = () => { state.disassembly = Math.max(0, state.disassembly - 1); detailScreen(); };
    app.querySelector('[data-dis-plus]').onclick = () => { state.disassembly += 1; detailScreen(); };
    app.querySelector('[data-same-day]').onchange = event => { state.sameDay = event.target.checked; detailScreen(); };
    app.querySelector('[data-back]').onclick = () => state.method === 'item' ? itemScreen() : loadScreen();
    app.querySelector('[data-next]').onclick = estimateScreen;
  }

  function estimateScreen() {
    setStep(3);
    const lines = state.method === 'item'
      ? state.items.map(item => `<li><span>${item.name} × ${item.qty}</span><strong>${money(item.price * item.qty)}</strong></li>`)
      : [`<li><span>${state.load.name}</span><strong>${money(state.load.price)}</strong></li>`];
    if (fee()) lines.push(`<li><span>Area service fee</span><strong>${money(fee())}</strong></li>`);
    if (state.stairs) lines.push(`<li><span>Stair access × ${state.stairs}</span><strong>${money(state.stairs * 10)}</strong></li>`);
    if (state.disassembly) lines.push(`<li><span>Disassembly × ${state.disassembly}</span><strong>${money(state.disassembly * 20)}</strong></li>`);
    if (state.sameDay) lines.push(`<li><span>Same-day priority</span><strong>$20</strong></li>`);
    app.innerHTML = `<section class="quote-screen estimate-screen"><header><span class="quote-eyebrow">Step 4 of 5</span><h1>Review your starting estimate</h1><p>No obligation. The team confirms availability and final scope before the pickup</p></header>
      <div class="estimate-total"><span>Estimated total</span><strong>${money(total())}</strong><small>No hidden online booking fees</small></div>
      <ul class="estimate-lines">${lines.join('')}</ul>
      <div class="estimate-trust"><span>Fully insured</span><span>Background-checked crew</span><span>Final scope confirmed</span></div>
      ${actions('Back', 'Continue to Pickup Details', false, 'Continue to Pickup Details')}</section>`;
    app.querySelector('[data-back]').onclick = detailScreen;
    app.querySelector('[data-next]').onclick = requestScreen;
  }

  function requestScreen() {
    setStep(4);
    app.innerHTML = `<section class="quote-screen request-screen"><header><span class="quote-eyebrow">Step 5 of 5</span><h1>Tell us where and when to pick up</h1><p>Send the request and the Big Boys team will confirm the scope, price, and available time</p></header>
      <form id="bookingForm" class="clean-booking-form">
        <label>Full name<input name="name" autocomplete="name" required></label>
        <label>Phone number<input name="phone" type="tel" autocomplete="tel" required></label>
        <label>Email address <small>Optional</small><input name="email" type="email" autocomplete="email"></label>
        <label>Pickup ZIP code<input name="zip" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" autocomplete="postal-code" value="${state.zip}" required></label>
        <label class="wide">Pickup address<input name="address" autocomplete="street-address" required></label>
        <label>Preferred date<input name="date" type="date" required></label>
        <fieldset><legend>Preferred time</legend><div class="clean-time-slots"><label><input type="radio" name="slot" value="Morning" required><span>Morning<small>8am to 12pm</small></span></label><label><input type="radio" name="slot" value="Afternoon"><span>Afternoon<small>12pm to 4pm</small></span></label><label><input type="radio" name="slot" value="Evening"><span>Evening<small>4pm to 7pm</small></span></label></div></fieldset>
        <label class="wide">Notes or special instructions <small>Optional</small><textarea name="notes" rows="4" placeholder="Stairs, gate code, parking, unusual items, or anything else the crew should know"></textarea></label>
        <div class="request-summary"><span>Estimated total</span><strong>${money(total())}</strong></div>
        <div class="quote-actions wide"><button class="quote-btn secondary" type="button" data-back>Back</button><button class="quote-btn primary" type="submit">Review My Request</button></div>
      </form></section>`;
    const date = app.querySelector('[name="date"]');
    const today = new Date();
    date.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
    app.querySelector('[data-back]').onclick = estimateScreen;
    app.querySelector('form').onsubmit = event => {
      event.preventDefault();
      state.customer = Object.fromEntries(new FormData(event.currentTarget));
      confirmationScreen();
    };
  }

  function confirmationScreen() {
    const job = state.method === 'load' ? state.load.name : state.items.map(item => `${item.name} × ${item.qty}`).join(', ');
    const subject = encodeURIComponent(`Pickup request from ${state.customer.name}`);
    const body = encodeURIComponent(`Name: ${state.customer.name}\nPhone: ${state.customer.phone}\nEmail: ${state.customer.email || 'Not provided'}\nPickup address: ${state.customer.address}\nZIP code: ${state.customer.zip}\nRequested date: ${state.customer.date}\nTime window: ${state.customer.slot}\nEstimated job: ${job}\nEstimated total: ${money(total())}\nNotes: ${state.customer.notes || 'None'}\n\nPlease confirm availability, scope, and final price.`);
    app.innerHTML = `<section class="quote-screen confirmation-screen"><span class="confirmation-mark">Ready</span><h1>Your request is prepared</h1><p>Thanks, ${state.customer.name}. Review the estimate of <strong>${money(total())}</strong>, then send the pre-filled request to Big Boys for confirmation</p><div class="confirmation-actions"><a class="quote-btn primary" href="mailto:support@bigboysjr.com?subject=${subject}&body=${body}">Send Pickup Request</a><a class="quote-btn secondary" href="tel:+14706606874">Call (470) 660-6874</a></div><button class="text-button" type="button" data-edit>Edit pickup details</button></section>`;
    app.querySelector('[data-edit]').onclick = requestScreen;
  }

  methodScreen();
})();
