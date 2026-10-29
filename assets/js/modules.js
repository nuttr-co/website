// NUTTR's page modules, served as assets/js/modules.js.

// Step tour: a tap on a step opens it and shows its screen. While the tour is on screen the steps move on every
// 5 seconds, starting over when it comes back into view. With Reduce Motion nothing moves on its own.
document.querySelectorAll('[data-step-tour]').forEach(tour => {
  const steps = [...tour.querySelectorAll('.step-list li')];
  const shots = [...tour.querySelectorAll('.step-stage > *')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;
  let onScreen = false;

  function show(n) {
    current = (n + steps.length) % steps.length;
    steps.forEach((step, k) => {
      step.classList.toggle('is-on', k === current);
      step.querySelector('button').setAttribute('aria-expanded', k === current);
      const bar = step.querySelector('.step-bar i');
      bar.style.animation = 'none';
      void bar.offsetWidth; // restart the fill
      bar.style.animation = '';
    });
    shots.forEach((shot, k) => {
      const on = shots.length === 1 || k === current;   // a single drawn scene serves every step
      const video = shot.tagName === 'VIDEO' ? shot : null;
      shot.classList.toggle('is-on', on);
      shot.classList.remove('is-playing');
      if (video && !(on && onScreen && !still)) video.pause();
      if (on && onScreen) { // scenes play only in view, from the start each time
        shot.querySelectorAll('[data-countdown]').forEach(el => { delete el.dataset.left; el.textContent = clock(el, +el.dataset.countdown); });
        void shot.offsetWidth;
        shot.classList.add('is-playing');
        if (video && !still) { video.currentTime = 0; video.play().catch(() => {}); }
      }
    });
    tour.dataset.step = current + 1;
    clearTimeout(timer);
    if (onScreen && !still) timer = setTimeout(() => show(current + 1), 5000);
  }

  steps.forEach((step, k) => step.querySelector('button').addEventListener('click', () => show(k)));

  // A step can be a short video. Its first frame is its poster, so with Reduce Motion it's a still. The videos start
  // loading a screen before the tour arrives.
  const videos = shots.filter(shot => shot.tagName === 'VIDEO');
  if (videos.length && !still) {
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      // load() would cancel a clip that's already starting, so the showing one loads as it plays
      videos.forEach(video => { video.preload = 'auto'; if (!video.classList.contains('is-on')) video.load(); });
      near.disconnect();
    }, { rootMargin: '0px 0px 100% 0px' });
    near.observe(tour);
  }

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    tour.classList.toggle('is-running', onScreen && !still);
    show(onScreen ? current : 0);
  }, { threshold: 0.4 }).observe(tour);

  show(0);
});

// The pictures at the top of a page fade in as each one loads, instead of popping in one by one after the words on a
// first visit. modules.css hides them until then, only while arrival is on.
document.querySelectorAll('.s-hero img, .home-hero img').forEach(img => {
  const shown = () => img.classList.add('is-loaded');
  if (img.complete) shown();
  else { img.addEventListener('load', shown, { once: true }); img.addEventListener('error', shown, { once: true }); }
});

// Arrival: each piece fades in and rises when it comes into view; pieces that arrive together go one after another,
// 0.12 s apart, at most 5 steps. The hero isn't in the list, so it shows at once. The page's head script adds
// "arrive-on" before the first paint; this marks the script as loaded. Keep ARRIVE the same as the list in modules.css.
window.__arrive = true;
const ARRIVE = document.body.classList.contains('home') ? '.home-app--stacks .home-shots' :
  '.moment, .s-promise-item, .s-head > *, .s-h2-small, ' +
  '.f-ways-title, .eyebrow, .bento > *, .step-tour, .s-gallery-list > li, .s-features > *, .s-howlist > li, ' +
  '.s-score-lists > *, .f-also > li, .f-pair, .f-trends, .hud-diagram, .hud-legend > li';
// The homepage has no fade. Its flipper moves, and the first app's phones rise into place (modules.css) once they're a
// quarter of the way up the screen, so the rise happens where it can be seen (lower down on a phone, it would happen
// under Safari's toolbar).
// Count-up: a number marked data-count="44600" (with data-from and data-decimals if needed) counts up to its value as
// its piece arrives. The page's text already holds the final number, so it reads right without the script.
function countUp(el) {
  const to = parseFloat(el.dataset.count), from = parseFloat(el.dataset.from || 0), dec = +(el.dataset.decimals || 0);
  const start = performance.now(), length = 1400;
  const step = now => {
    const t = Math.min(1, (now - start) / length), eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (from + (to - from) * eased).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

if (document.documentElement.classList.contains('arrive-on')) {
  // Pictures start loading a screen and a half before their piece arrives (iPhone Safari otherwise waits until they're
  // almost on screen), and a piece waits up to 0.6 s for its pictures, so they fade in with it instead of popping in
  // partway through. Pictures the layout hides (the homepage's third phone on small screens) are left alone, so they
  // aren't downloaded.
  const pictures = el => (el.tagName === 'IMG' ? [el] : [...el.querySelectorAll('img')]).filter(img => img.getClientRects().length);
  const ahead = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    pictures(entry.target).forEach(img => { if (img.loading === 'lazy') img.loading = 'eager'; });
    ahead.unobserve(entry.target);
  }), { rootMargin: '0px 0px 150% 0px' });
  const ready = el => Promise.race([
    Promise.all(pictures(el).filter(img => !img.complete).map(img => img.decode().catch(() => {}))),
    new Promise(done => setTimeout(done, 600)),
  ]);
  const arrive = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, i) => {
      arrive.unobserve(entry.target);
      ready(entry.target).then(() => {
        entry.target.style.setProperty('--arrive-i', Math.min(i, 5));
        entry.target.classList.add('arrived');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
      });
    });
  }, { rootMargin: document.body.classList.contains('home') ? '0px 0px -25% 0px' : '0px 0px -10% 0px' });
  document.querySelectorAll('main').forEach(main => main.querySelectorAll(ARRIVE).forEach(el => { arrive.observe(el); ahead.observe(el); }));
}

// Countdown: a clock marked data-countdown="10792" (seconds) ticks down once a second while its scene is playing, and
// starts over each time the scene plays. data-format="ms" shows m:ss, like FITTR's rest; otherwise h:mm:ss.
function clock(el, left) {
  const sec = String(left % 60).padStart(2, '0');
  if (el.dataset.format === 'ms') return `${Math.floor(left / 60)}:${sec}`;
  return `${Math.floor(left / 3600)}:${String(Math.floor(left % 3600 / 60)).padStart(2, '0')}:${sec}`;
}
setInterval(() => document.querySelectorAll('.is-playing [data-countdown]').forEach(el => {
  const left = Math.max(0, (+el.dataset.left || +el.dataset.countdown) - 1);
  el.dataset.left = left;
  el.textContent = clock(el, left);
}), 1000);
