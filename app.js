const t = english => window.RKLanguage?.t(english) || english;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); }
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); if (document.activeElement?.closest('#navigation')) menu.focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) { document.body.classList.add('motion-ready'); const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .08 }); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); }
function openPractice() { const target = document.getElementById(location.hash.slice(1)); if (target?.tagName === 'DETAILS') target.open = true; }
window.addEventListener('hashchange', openPractice); openPractice();
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
// A small depth shift keeps the hero alive without changing normal scrolling.
const portraitImage = document.querySelector('.portrait img');
if (portraitImage && !reducedMotion.matches && matchMedia('(pointer:fine)').matches) {
 let scheduled = false;
 const updateDepth = () => { if (scheduled) return; scheduled = true; requestAnimationFrame(() => { portraitImage.style.translate = reducedMotion.matches ? '0 0' : `0 ${Math.min(scrollY * .025, 12)}px`; scheduled = false; }); };
 window.addEventListener('scroll', updateDepth, { passive:true });
 reducedMotion.addEventListener('change', updateDepth);
}

// A bounded opening film; it never holds the page behind a media download.
const opening = document.querySelector('.opening-film');
let openingActive = false;
let releaseOpening = () => {};
if (opening && typeof opening.showModal === 'function') {
 if (!reducedMotion.matches && !navigator.connection?.saveData) {
  openingActive = true;
  const film = opening.querySelector('video');
  let exiting = false;
  opening.showModal(); document.documentElement.classList.add('opening-active');
  function dismissOpening() {
   if (exiting) return; exiting = true;
   film.pause(); opening.classList.add('is-leaving');
   setTimeout(() => {
    opening.close(); document.documentElement.classList.remove('opening-active');
    openingActive = false; film.removeAttribute('src'); film.load();
    document.dispatchEvent(new Event('rk:openingcomplete'));
   }, reducedMotion.matches ? 0 : 620);
  }
  releaseOpening = dismissOpening;
  opening.querySelector('.opening-skip').addEventListener('click', dismissOpening);
  opening.addEventListener('cancel', event => { event.preventDefault(); dismissOpening(); });
  film.addEventListener('error', dismissOpening, {once:true});
  setTimeout(dismissOpening, 4200);
  film.src = document.body.classList.contains('notary-page') ? 'assets/rk-hero.mp4' : 'assets/rk-city-hero.mp4';
  film.play().then(() => setTimeout(dismissOpening, 3200)).catch(dismissOpening);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) dismissOpening(); });
 }
}

// Progressive enhancement: without JavaScript, every service remains readable.
const servicePicker = document.querySelector('[data-service-picker]');
if (servicePicker) {
 const tabs = [...servicePicker.querySelectorAll('[data-service]')];
 const panels = [...servicePicker.querySelectorAll('[data-service-panel]')];
 const tablist = servicePicker.querySelector('.service-tabs');
 tablist.setAttribute('role', 'tablist');
 tablist.hidden = false;
 tabs.forEach(tab => { tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', tab.dataset.service); });
 panels.forEach(panel => { panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', `tab-${panel.id}`); panel.tabIndex = 0; });
 function selectService(id, updateURL = false) {
  if (!tabs.some(tab => tab.dataset.service === id)) return;
  tabs.forEach(tab => {
   const selected = tab.dataset.service === id;
   tab.setAttribute('aria-selected', String(selected));
   tab.tabIndex = selected ? 0 : -1;
   tab.querySelector('.service-card-state').textContent = t(selected ? 'Selected service' : 'View service');
  });
  panels.forEach(panel => { panel.hidden = panel.id !== id; panel.classList.toggle('panel-enter', panel.id === id); });
  const counter = document.querySelector('[data-service-counter]');
  if (counter) counter.textContent = `${String(tabs.findIndex(tab => tab.dataset.service === id) + 1).padStart(2, '0')} / ${String(tabs.length).padStart(2, '0')}`;
  if (updateURL) { history.replaceState(null, '', `#${id}`); document.dispatchEvent(new CustomEvent('rk:servicechange', {detail:{id}})); }
 }
 document.querySelector('.service-stepper')?.removeAttribute('hidden');
 function stepService(direction) {
  const active = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
  selectService(tabs[(active + direction + tabs.length) % tabs.length].dataset.service, true);
 }
 document.querySelector('[data-service-prev]')?.addEventListener('click', () => stepService(-1));
 document.querySelector('[data-service-next]')?.addEventListener('click', () => stepService(1));
 function refreshServiceLanguage() {
  tabs.forEach(tab => { tab.querySelector('.service-card-state').textContent = t(tab.getAttribute('aria-selected') === 'true' ? 'Selected service' : 'View service'); });
  panels.forEach(panel => {
   const title = panel.querySelector('h3').textContent;
   const message = window.RKLanguage?.current === 'id'
    ? `Halo, saya ingin berkonsultasi mengenai ${title} dengan kantor notaris. Mohon informasikan persyaratan dan jadwal konsultasi yang tersedia.`
    : `Hello, I would like to discuss ${title} with the notary office. Could you confirm the requirements and arrange a consultation?`;
   panel.querySelector('.button').href = `https://wa.me/6285156129839?text=${encodeURIComponent(message)}`;
  });
 }
 document.addEventListener('rk:languagechange', refreshServiceLanguage);
 refreshServiceLanguage();
 const initialID = location.hash.slice(1);
 selectService(tabs.some(tab => tab.dataset.service === initialID) ? initialID : tabs[0].dataset.service);
 tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectService(tab.dataset.service, true));
  tab.addEventListener('keydown', event => {
   let next;
   if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
   if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
   if (event.key === 'Home') next = 0;
   if (event.key === 'End') next = tabs.length - 1;
   if (next !== undefined) { event.preventDefault(); tabs[next].focus(); selectService(tabs[next].dataset.service, true); }
  });
 });
 window.addEventListener('hashchange', () => selectService(location.hash.slice(1)));
}
// The supplied decorative hero video is silent and optional.
const heroVideo = document.querySelector('.hero-video');
const videoToggle = document.querySelector('.video-toggle');
if (heroVideo && videoToggle) {
 videoToggle.hidden = false;
 function syncVideoButton() { videoToggle.textContent = t(heroVideo.paused ? 'Play motion' : 'Pause motion'); videoToggle.setAttribute('aria-label', t(heroVideo.paused ? 'Play background video' : 'Pause background video')); }
 function loadVideo() { if (!heroVideo.getAttribute('src')) heroVideo.src = heroVideo.dataset.videoSrc; }
 function playVideo() { loadVideo(); heroVideo.play().then(syncVideoButton).catch(syncVideoButton); }
 const saveData = navigator.connection?.saveData;
 function autoPlayHero() { if (!reducedMotion.matches && !saveData) playVideo(); }
 if (!openingActive) autoPlayHero();
 document.addEventListener('rk:openingcomplete', autoPlayHero, {once:true});
 document.addEventListener('rk:languagechange', syncVideoButton);
 videoToggle.addEventListener('click', () => { if (heroVideo.paused) playVideo(); else heroVideo.pause(); });
 heroVideo.addEventListener('play', syncVideoButton);heroVideo.addEventListener('pause', syncVideoButton);
 reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) heroVideo.pause(); });
 syncVideoButton();
}
const stickyHeader = document.querySelector('.site-header');
const backTop = document.querySelector('.back-top');
let headerTick = false;
function syncHeader() { if (headerTick) return; headerTick = true; requestAnimationFrame(() => { stickyHeader?.classList.toggle('is-scrolled', scrollY > 40); if (backTop) backTop.hidden = scrollY < 400; headerTick = false; }); }
window.addEventListener('scroll', syncHeader, {passive:true});syncHeader();

// A reversible, choice-driven rehearsal of the notary enquiry journey.
const planner = document.querySelector('.visit-planner');
if (planner) {
 let triggeringButton;
 let scene = 1;
 let changingRoute = false;
 function journey(stage) { document.querySelectorAll('[data-journey]').forEach(step => { if (Number(step.dataset.journey) === stage) step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current'); }); }
 function updatePlanner() {
  const selected = document.querySelector('[data-service-panel]:not([hidden])');
  if (!selected) return;
  const title = selected.querySelector('h3').textContent;
  planner.querySelector('[data-planner-service]').textContent = title;
  const party = planner.querySelector('[name=party]:checked').value;
  const readiness = planner.querySelector('[name=readiness]:checked').value;
  const id = window.RKLanguage?.current === 'id';
  const message = id
   ? `Halo, saya ingin mengatur konsultasi mengenai ${title}. Layanan ini untuk ${party === 'business' ? 'badan usaha' : 'perorangan'}. ${readiness === 'documents' ? 'Saya memiliki dokumen untuk dibahas.' : 'Saya membutuhkan arahan awal.'} Mohon informasikan persyaratan, biaya, dan jadwal yang tersedia.`
   : `Hello, I would like to arrange a consultation about ${title}. This is for ${party === 'business' ? 'a business' : 'an individual'}. ${readiness === 'documents' ? 'I have documents to discuss.' : 'I need initial guidance.'} Please confirm the requirements, fees and available appointments.`;
  planner.querySelector('.planner-send').href = `https://wa.me/6285156129839?text=${encodeURIComponent(message)}`;
  planner.querySelector('[data-summary=service]').textContent = title;
  planner.querySelector('[data-summary=party]').textContent = t(party === 'business' ? 'A business' : 'An individual');
  planner.querySelector('[data-summary=readiness]').textContent = t(readiness === 'documents' ? 'Documents to discuss' : 'Initial guidance');
  planner.querySelector('[data-sim-party-feedback]').textContent = t(party === 'business'
   ? 'Your route will focus on a business matter. The office will confirm the relevant company records and authorised parties.'
   : 'Your route will focus on an individual matter. The office will confirm who needs to attend.');
  planner.querySelector('[data-sim-readiness-feedback]').textContent = t(readiness === 'documents'
   ? 'Your next move is a document discussion. Ask the office which originals or supporting records to bring.'
   : 'Your next move is an initial consultation. Ask the office which documents will be needed.');
 }
 function showScene(number, focus = true) {
  scene = Math.max(1, Math.min(3, number));
  planner.querySelectorAll('[data-scene]').forEach(section => { section.hidden = Number(section.dataset.scene) !== scene; });
  planner.querySelectorAll('[data-sim-stage]').forEach(step => {
   const current = Number(step.dataset.simStage) === scene;
   step.classList.toggle('is-complete', Number(step.dataset.simStage) < scene);
   if (current) step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current');
  });
  planner.querySelector('[data-simulation-counter]').textContent = `${String(scene).padStart(2, '0')} / 03`;
  planner.querySelector('progress').value = scene;
  planner.querySelector('[data-sim-back]').disabled = scene === 1;
  planner.querySelector('[data-sim-next]').hidden = scene === 3;
  planner.querySelector('[data-sim-restart]').hidden = scene !== 3;
  updatePlanner();
  if (focus && planner.open) planner.querySelector(`[data-scene="${scene}"] h3`).focus({preventScroll:true});
 }
 function resetSimulation() {
  planner.querySelector('[name=party][value=individual]').checked = true;
  planner.querySelector('[name=readiness][value=first]').checked = true;
  showScene(1);
 }
 document.querySelectorAll('.prepare-visit').forEach(button => { button.hidden = false; button.addEventListener('click', () => {
  triggeringButton = button; changingRoute = false; resetSimulation(); planner.showModal(); showScene(1); journey(3);
 }); });
 planner.querySelector('.planner-close').addEventListener('click', () => planner.close());
 planner.querySelector('[data-sim-next]').addEventListener('click', () => showScene(scene + 1));
 planner.querySelector('[data-sim-back]').addEventListener('click', () => showScene(scene - 1));
 planner.querySelector('[data-sim-restart]').addEventListener('click', resetSimulation);
 planner.querySelector('[data-sim-change-route]').addEventListener('click', () => { changingRoute = true; planner.close(); });
 planner.addEventListener('close', () => {
  journey(2);
  if (changingRoute) document.querySelector('[data-service][aria-selected=true]')?.focus(); else triggeringButton?.focus();
 });
 planner.addEventListener('change', updatePlanner);
 document.addEventListener('rk:languagechange', updatePlanner);
 document.addEventListener('rk:servicechange', () => { journey(2); updatePlanner(); });
}

// Film chapters map to the original notary clip's actual timeline.
const storyChapters = [...document.querySelectorAll('[data-story-time]')];
if (heroVideo && storyChapters.length) {
 function syncStory() {
  const time = heroVideo.currentTime || 0;
  const duration = Number.isFinite(heroVideo.duration) ? heroVideo.duration : 10;
  const active = time >= 7 ? 2 : time >= 3.5 ? 1 : 0;
  storyChapters.forEach((button, index) => {
   button.setAttribute('aria-pressed', String(index === active));
   const start = Number(button.dataset.storyTime);
   const end = index < storyChapters.length - 1 ? Number(storyChapters[index + 1].dataset.storyTime) : duration;
   const fraction = Math.max(0, Math.min(1, (time - start) / (end - start)));
   button.style.setProperty('--chapter-progress', `${fraction * 100}%`);
  });
 }
 storyChapters.forEach(button => button.addEventListener('click', () => {
  const seek = () => { heroVideo.currentTime = Number(button.dataset.storyTime); heroVideo.play().catch(() => {}); syncStory(); };
  if (heroVideo.readyState >= 1) seek(); else { heroVideo.addEventListener('loadedmetadata', seek, {once:true}); heroVideo.preload = 'auto'; heroVideo.src = heroVideo.dataset.videoSrc; heroVideo.load(); }
 }));
 heroVideo.addEventListener('timeupdate', syncStory); heroVideo.addEventListener('loadedmetadata', syncStory); syncStory();
}
