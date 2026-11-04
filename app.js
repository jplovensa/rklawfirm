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
   tab.querySelector('.service-card-state').textContent = selected ? 'Selected service' : 'View service';
  });
  panels.forEach(panel => { panel.hidden = panel.id !== id; });
  if (updateURL) history.replaceState(null, '', `#${id}`);
 }
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
 function syncVideoButton() { videoToggle.textContent = heroVideo.paused ? 'Play motion' : 'Pause motion'; videoToggle.setAttribute('aria-label', heroVideo.paused ? 'Play background video' : 'Pause background video'); }
 function loadVideo() { if (!heroVideo.getAttribute('src')) heroVideo.src = heroVideo.dataset.videoSrc; }
 function playVideo() { loadVideo(); heroVideo.play().then(syncVideoButton).catch(syncVideoButton); }
 const saveData = navigator.connection?.saveData;
 if (!reducedMotion.matches && !saveData) playVideo();
 videoToggle.addEventListener('click', () => { if (heroVideo.paused) playVideo(); else heroVideo.pause(); });
 heroVideo.addEventListener('play', syncVideoButton);heroVideo.addEventListener('pause', syncVideoButton);
 reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) heroVideo.pause(); });
 syncVideoButton();
}
const stickyHeader = document.querySelector('.site-header');
let headerTick = false;
function syncHeader() { if (headerTick) return; headerTick = true; requestAnimationFrame(() => { stickyHeader?.classList.toggle('is-scrolled', scrollY > 40); headerTick = false; }); }
window.addEventListener('scroll', syncHeader, {passive:true});syncHeader();
