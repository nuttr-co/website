// Davevite's Daves box on nuttr.co/davevite. The Daves are drawn with the same code as fun.davevite.com's parade
// (SKIN through headSvg); keep the two the same when the Daves change.
// Three scenes take turns while the box is on screen: the parade into Dave's Percent Night, the party, and the mingling.
// With Reduce Motion the box shows the parade's end, still.
(() => {
  const box = document.querySelector('.dv-daves-stage');
  if (!box) return;

    const SKIN = ['#F8DCC4', '#F1C9A5', '#E3AE87', '#C98E66', '#9C6A48', '#6E4630'];
    const HAIR = ['#1C1C1C', '#3B2618', '#5A3A22', '#8A5A35', '#C9874F', '#C9A06A', '#E9C77A', '#B5452E', '#8C93A3'];
    const SHIRT = ['#2A2D33', '#9AA3AE', '#F1F2F4', '#7A2E3A', '#F05A9B', '#8C9284', '#7E95A8', '#6B5A4C', '#5E6470', '#FF776D', '#FFD14B', '#22B5FF', '#50D5AD', '#2D466A', '#A88BEB'];
    const BODIES = ['guy', 'girl'];
    // Guys and girls each have their own hairstyles and hats (both can be bald); facial hair is for guys, blush for girls.
    const STYLES = { guy: ['short', 'swept', 'buzz', 'curly', 'none'], girl: ['bob', 'ponytail', 'braids', 'long', 'none'] };
    const HATS = { guy: ['none', 'cap', 'trucker'], girl: ['none', 'cap', 'trucker', 'bow'] };
    const EYES = ['dots', 'happy', 'wide', 'wink'];
    const MOUTHS = ['smile', 'grin', 'oh'];
    const FACIAL = ['none', 'stubble', 'mustache', 'beard'];
    const GLASSES = ['none', 'glasses'];

    // ---------- Drawing a character from its look ----------
    const HAIR_BACK = {
      long: 'M11 28 Q9 6 30 5 Q51 6 49 28 L50 46 Q45 49 43 40 L43 24 L17 24 L17 40 Q15 49 10 46 Z',
      ponytail: 'M43 14 Q59 21 53 45 Q49 50 45 45 Q50 33 41 20 Z' };
    const HAIR_TOP = {
      short: 'M12 22 Q12 6 30 6 Q48 6 48 22 Q44 13 30 13 Q16 13 12 22 Z',
      swept: 'M11 25 Q9 3 31 3 Q51 4 49 22 Q47 13 38 12 Q30 11 22 13 Q14 16 11 25 Z',
      buzz: 'M13 21 Q13 8 30 8 Q47 8 47 21 Q41 14 30 14 Q19 14 13 21 Z',
      spiky: 'M12 20 L16 8 L22 14 L28 5 L34 13 L40 6 L44 14 L48 20 Q42 13 30 13 Q18 13 12 20 Z',
      bob: 'M10 30 Q8 6 30 5 Q52 6 50 30 Q48 18 44 15 Q30 20 16 15 Q12 18 10 30 Z',
      ponytail: 'M12 24 Q12 6 30 6 Q48 6 48 24 Q44 12 30 12 Q16 12 12 24 Z',
      braids: 'M12 24 Q12 6 30 6 Q48 6 48 24 Q44 12 30 12 Q16 12 12 24 Z',
      long: 'M12 22 Q12 6 30 6 Q48 6 48 22 Q40 12 30 14 Q20 12 12 22 Z' };
    const curls = c => [[14, 16], [19, 9], [26, 6], [34, 6], [41, 9], [46, 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.2" fill="${c}"/>`).join('');
    const braids = c => [[12.5, 34], [13.5, 40], [14.5, 46], [47.5, 34], [46.5, 40], [45.5, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.3" fill="${c}"/>`).join('');
    const LASH = '<path d="M20.4 24.6 L18.8 23 M39.6 24.6 L41.2 23" stroke="#24324F" stroke-width="1.3" stroke-linecap="round"/>';
    const BLUSH = '<circle cx="19.5" cy="32" r="2.6" fill="#FF9F9A" opacity="0.45"/><circle cx="40.5" cy="32" r="2.6" fill="#FF9F9A" opacity="0.45"/>';
    const EYE = {
      dots: '<ellipse cx="23.5" cy="27" rx="2" ry="2.8" fill="#24324F"/><ellipse cx="36.5" cy="27" rx="2" ry="2.8" fill="#24324F"/>',
      happy: '<path d="M21 28 Q23.5 24.5 26 28 M34 28 Q36.5 24.5 39 28" stroke="#24324F" stroke-width="2" fill="none" stroke-linecap="round"/>',
      wide: '<circle cx="23.5" cy="27" r="3.6" fill="#FFFFFF"/><circle cx="36.5" cy="27" r="3.6" fill="#FFFFFF"/><circle cx="24" cy="27.5" r="1.9" fill="#24324F"/><circle cx="37" cy="27.5" r="1.9" fill="#24324F"/>',
      wink: '<ellipse cx="23.5" cy="27" rx="2" ry="2.8" fill="#24324F"/><path d="M34 27.5 Q36.5 25 39 27.5" stroke="#24324F" stroke-width="2" fill="none" stroke-linecap="round"/>' };
    const MOUTH = {
      smile: '<path d="M24.5 35 Q30 39.5 35.5 35" stroke="#24324F" stroke-width="2" fill="none" stroke-linecap="round"/>',
      grin: '<path d="M23.5 34 Q30 34 36.5 34 Q35 40.5 30 40.5 Q25 40.5 23.5 34 Z" fill="#24324F"/><path d="M25 34.4 L35 34.4 L34.6 36 L25.4 36 Z" fill="#FFFFFF"/>',
      oh: '<ellipse cx="30" cy="36.5" rx="2.6" ry="3" fill="#24324F"/>' };
    // Stubble and a beard cover the lower face from the sideburns down, around the mouth. The beard's hole (evenodd) shows
    // the lips' skin.
    const LIPS = 'M24 37.2 a6 3.3 0 1 0 12 0 a6 3.3 0 1 0 -12 0 Z';
    const STUBBLE = 'M12.11 23 A18 18 0 1 0 47.89 23 L45.2 28 Q30 35 14.8 28 Z';
    const BEARD = `M12.11 23 Q11.4 33 14.3 38.8 Q19 46.6 30 46.8 Q41 46.6 45.7 38.8 Q48.6 33 47.89 23 L45.2 28 Q30 35 14.8 28 Z ${LIPS}`;
    const STACHE = 'M23.5 32.6 Q27 30.2 30 32 Q33 30.2 36.5 32.6 Q33 34.2 30 33.2 Q27 34.2 23.5 32.6 Z';
    const FACE_HAIR = {
      none: () => '',
      stubble: c => `<path d="${STUBBLE}" fill="${c}" opacity="0.32"/>`,
      mustache: c => `<path d="${STACHE}" fill="${c}"/>`,
      beard: c => `<path d="${BEARD}" fill="${c}" fill-rule="evenodd"/>` };
    const GLASS = { none: '', glasses: '<g fill="none" stroke="#24324F" stroke-width="1.8"><circle cx="23.5" cy="27" r="5"/><circle cx="36.5" cy="27" r="5"/><path d="M28.5 27 L31.5 27"/></g>' };
    const HAT = {
      none: '',
      cap: '<path d="M11 19 Q12 4 30 4 Q48 4 49 19 Z" fill="#2A2D33"/><path d="M40 18 Q52 17 56 21 Q49 22 40 21 Z" fill="#17191D"/>',
      trucker: '<path d="M11 19 Q12 4 30 4 Q48 4 49 19 Z" fill="#6E7458"/><path d="M19 18 Q20 7 30 7 Q40 7 41 18 Z" fill="#E9E1CF"/><path d="M40 18 Q52 17 56 21 Q49 22 40 21 Z" fill="#555B43"/>',
      bow: '<path d="M38 8 L46 3 L46 13 Z M38 8 L30 3 L30 13 Z" fill="#FF776D"/><circle cx="38" cy="8" r="2.2" fill="#D9564D"/>' };
    // From behind (movie night): no face, hair over the back of the head, a hat as a plain dome.
    const BACK_CAP = 'M12 26 Q12 7 30 7 Q48 7 48 26 Q48 37 30 39 Q12 37 12 26 Z';
    const BACK_HAIR = {
      buzz: 'M12.5 24 Q12.5 7.5 30 7.5 Q47.5 7.5 47.5 24 Q47.5 33 30 34 Q12.5 33 12.5 24 Z',
      bob: 'M10 30 Q8 6 30 5 Q52 6 50 30 Q50 40 30 42 Q10 40 10 30 Z',
      long: 'M11 28 Q9 6 30 5 Q51 6 49 28 L50 46 Q30 52 10 46 Z' };
    const DOME = c => `<path d="M11 19 Q12 4 30 4 Q48 4 49 19 Z" fill="${c}"/>`;
    const HAT_BACK = { none: '', cap: DOME('#2A2D33'), trucker: DOME('#6E7458'), bow: HAT.bow };
    function backHead(l) {
      const c = l.hairColor, h = l.hair;
      const cap = h === 'none' ? '' : `<path d="${BACK_HAIR[h] || BACK_CAP}" fill="${c}"${h === 'buzz' ? ' opacity="0.6"' : ''}/>`;
      const more = { curly: curls(c), spiky: `<path d="${HAIR_TOP.spiky}" fill="${c}"/>`, braids: braids(c),
        ponytail: `<path d="M26.5 30 Q24.5 44 30 51 Q35.5 44 33.5 30 Z" fill="${c}"/><circle cx="30" cy="31" r="2.3" fill="#FF776D"/>` }[h] || '';
      return `<circle cx="30" cy="25" r="18" fill="${l.skin}"/>${cap}${more}${HAT_BACK[l.hat]}`;
    }
    // Slim, Mii-like bodies: a straight shirt and wider legs for guys, a flared top and slimmer legs for girls. Arms
    // hang out from the shoulders (drawn behind the shirt) and end in round hands.
    const BODY = {
      guy: { torso: 'M18 45.5 Q18 42 21.5 42 L38.5 42 Q42 42 42 45.5 L41 66.5 L19 66.5 Z', arms: [[19.5, 45, 12, 60.5], [40.5, 45, 48, 60.5]], legs: [21.5, 31.5], legW: 7 },
      girl: { torso: 'M20.5 45 Q20.5 42 23.5 42 L36.5 42 Q39.5 42 39.5 45 L45 67 Q30 70.5 15 67 Z', arms: [[21.5, 45, 11, 59.5], [38.5, 45, 49, 59.5]], legs: [23.4, 31.2], legW: 5.4 } };
    const EDGE = 'rgba(36,50,79,0.16)'; // a faint outline, so a white shirt still shows on the light floor
    const arm = ([x1, y1, x2, y2], c) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${EDGE}" stroke-width="5.4" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="3.4" fill="${c}" stroke="${EDGE}" stroke-width="0.8"/>`;
    const hairBack = l => (l.hair === 'braids' ? braids(l.hairColor) : HAIR_BACK[l.hair] ? `<path d="${HAIR_BACK[l.hair]}" fill="${l.hairColor}"/>` : '');
    function face(l) {
      const girl = l.body === 'girl', top = l.hair === 'curly' ? curls(l.hairColor) : HAIR_TOP[l.hair] ? `<path d="${HAIR_TOP[l.hair]}" fill="${l.hairColor}"/>` : '';
      return `<circle cx="30" cy="25" r="18" fill="${l.skin}"/>${girl ? '' : FACE_HAIR[l.facial](l.hairColor)}${top}${EYE[l.eyes]}${girl && l.eyes !== 'wide' ? LASH : ''}${MOUTH[l.mouth]}${girl ? BLUSH : ''}${GLASS[l.glasses]}${HAT[l.hat]}`;
    }
    // o.flag: the host's crown. o.sit: lowered onto crossed legs. o.back: seen from behind.
    function draw(l, o = {}) {
      const b = BODY[l.body], [left, right] = b.arms, pole = left[2] - 1.1;
      // The host wears a crown.
      const crown = o.flag ? '<g><path d="M16 12.8 L14.9 3.4 L22.6 8 L30 0.6 L37.4 8 L45.1 3.4 L44 12.8 Z" fill="#FFD14B" stroke="#D99A00" stroke-width="1" stroke-linejoin="round"/><circle cx="30" cy="9.8" r="1.6" fill="#FF776D"/><circle cx="22.6" cy="10.6" r="1.15" fill="#22B5FF"/><circle cx="37.4" cy="10.6" r="1.15" fill="#22B5FF"/></g>' : '';
      const leg = (cls, x) => `<rect class="${cls}" x="${x}" y="62" width="${b.legW}" height="26" rx="${b.legW / 2}" fill="#444851"/>`;
      const legs = o.sit ? '<rect x="14" y="80.5" width="32" height="7.5" rx="3.75" fill="#444851"/>' : leg('leg-a', b.legs[0]) + leg('leg-b', b.legs[1]);
      return `<svg viewBox="0 0 60 92" aria-hidden="true"><ellipse cx="30" cy="89" rx="${o.sit ? 18 : 13}" ry="2.4" fill="rgba(36,50,79,0.13)"/>
        <g class="bob">${legs}<g${o.sit ? ' transform="translate(0 14)"' : ''}>${o.back ? '' : hairBack(l)}
          ${arm(left, l.shirt)}<g class="arm-r" style="transform-origin: ${right[0]}px ${right[1]}px">${arm(right, l.shirt)}</g>
          <path d="${b.torso}" fill="${l.shirt}" stroke="${EDGE}" stroke-width="0.8"/>
          ${o.back ? backHead(l) : face(l)}${crown}
        </g></g></svg>`;
    }
    const headSvg = l => `<svg viewBox="4 -2 52 48" aria-hidden="true">${hairBack(l)}${face(l)}</svg>`;


  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = [...box.querySelectorAll('.dvd-scene')];
  const fit = () => box.style.setProperty('--u', box.clientWidth / 100 + 'px');
  fit();
  addEventListener('resize', fit);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // fun.davevite.com's run club crew, without names; the host (first) wears the crown
  const L = (body, skin, hair, hairColor, shirt, more = {}) => ({ body, skin: SKIN[skin], hair, hairColor, eyes: 'dots', mouth: 'grin', facial: 'none', glasses: 'none', hat: 'none', shirt, ...more });
  const LOOKS = [
    L('guy', 0, 'swept', '#C9874F', '#7A2E3A'),
    L('girl', 0, 'ponytail', '#5A3A22', '#2A2D33', { glasses: 'glasses', mouth: 'smile' }),
    L('guy', 1, 'short', '#3B2618', '#9AA3AE'),
    L('guy', 3, 'swept', '#1C1C1C', '#2A2D33', { facial: 'stubble', mouth: 'smile' }),
    L('girl', 0, 'ponytail', '#C9A06A', '#5E6470', { eyes: 'happy' }),
    L('guy', 0, 'short', '#5A3A22', '#8C9284', { facial: 'mustache', glasses: 'glasses', hat: 'cap' }),
    L('girl', 0, 'ponytail', '#E9C77A', '#F05A9B', { eyes: 'happy' }),
  ];
  const scene = name => scenes.find(s => s.dataset.scene === name);
  function place(el, x, y) { el.style.left = x + '%'; el.style.top = y + '%'; el.style.zIndex = 10 + Math.round(y * 10); el.dataset.x = x; el.dataset.y = y; }
  function dave(stage, look, x, y, host) {
    const el = document.createElement('div');
    el.className = 'dvd-mii';
    el.innerHTML = draw(look, { flag: host });
    place(el, x, y);
    stage.append(el);
    return el;
  }
  function walk(el, x, y, ms) {
    const dx = x - el.dataset.x;
    ms = ms || Math.max(600, Math.hypot(dx, y - el.dataset.y) * 55);
    el.classList.add('is-walking');
    el.classList.toggle('lean-r', dx > 2); el.classList.toggle('lean-l', dx < -2);
    el.style.transition = `left ${ms}ms linear, top ${ms}ms linear`;
    place(el, x, y);
    return wait(ms).then(() => el.classList.remove('is-walking', 'lean-l', 'lean-r'));
  }

  // The parade: the host leads everyone in to the sign, then confetti.
  const parade = scene('parade');
  parade.insertAdjacentHTML('beforeend', '<i class="dvd-post"></i><p class="dvd-sign">Dave’s Percent Night<small>Wed · 7:30 pm</small></p>');
  const SPOTS = [[58, 74], [48, 80], [68, 82], [40, 72], [78, 74], [56, 90], [32, 86]];
  const marchers = LOOKS.map((l, i) => dave(parade, l, still ? SPOTS[i][0] : -10, still ? SPOTS[i][1] : 82, i === 0));
  async function runParade() {
    parade.querySelectorAll('.dvd-confetti').forEach(c => c.remove());
    marchers.forEach(el => { el.style.transition = 'none'; el.classList.remove('is-hopping', 'is-waving'); place(el, -10, 82); });
    void parade.offsetWidth;
    marchers.forEach((el, i) => setTimeout(() => walk(el, ...SPOTS[i], 2600), 300 + i * 520));
    await wait(300 + 520 * marchers.length + 2500);
    const colors = ['#FF776D', '#FFD14B', '#50D5AD', '#22B5FF', '#A88BEB'];
    for (let i = 0; i < 26; i++) {
      const c = document.createElement('i'); c.className = 'dvd-confetti';
      c.style.left = (20 + Math.random() * 70) + '%'; c.style.top = (8 + Math.random() * 20) + '%';
      c.style.background = colors[i % 5]; c.style.animationDelay = Math.random() * 0.5 + 's';
      parade.append(c);
    }
    marchers.forEach((el, i) => setTimeout(() => el.classList.add('is-hopping'), i * 90));
    marchers[0].classList.add('is-waving');
  }

  // The party: lights, the mirror ball and its beams, everyone dancing.
  const party = scene('party');
  const colors = ['#FF776D', '#FFD14B', '#50D5AD', '#22B5FF', '#A88BEB'];
  for (let i = 0; i < 13; i++) {
    const b = document.createElement('i'); b.className = 'dvd-bulb';
    b.style.left = (4 + i * 7.6) + '%'; b.style.color = colors[i % 5]; b.style.animationDelay = (i % 3) * 0.4 + 's';
    party.append(b);
  }
  party.insertAdjacentHTML('beforeend', '<i class="dvd-floor"></i><i class="dvd-beam" style="color:#22B5FF"></i><i class="dvd-beam" style="color:#FF776D;animation-delay:-1.7s"></i><i class="dvd-ball"></i>');
  [[22, 84], [38, 76], [50, 88], [62, 76], [78, 84], [30, 94], [70, 94]].forEach(([x, y], i) => {
    const d = dave(party, LOOKS[i], x, y, i === 2);
    d.classList.add('is-dancing'); d.style.setProperty('--d', (i * 0.13) + 's');
  });

  // The mingling: the Daves wander, and two who meet talk.
  const mingle = scene('mingle');
  const people = LOOKS.slice(0, 6).map((l, i) => dave(mingle, l, [14, 30, 46, 62, 78, 88][i], [72, 86, 74, 88, 72, 90][i], i === 0));
  function say(el, text, ms = 1700) {
    const b = document.createElement('p');
    b.className = 'dvd-bubble'; b.textContent = text;
    b.style.left = el.dataset.x + '%'; b.style.top = (el.dataset.y - 21) + '%';
    mingle.append(b);
    setTimeout(() => b.remove(), ms);
  }
  const TALKS = [[0, 2, 32, 76, 'You in?', 'I’m in!', [[1, 70, 70], [3, 84, 86], [4, 58, 92], [5, 16, 92]]],
                 [3, 4, 62, 86, 'Bringing chips', 'Legend', [[0, 16, 72], [2, 40, 70], [1, 84, 74], [5, 24, 90]]]];
  async function runMingle() {
    for (const [ai, bi, mx, my, q, r, spots] of TALKS) {
      const a = people[ai], b = people[bi];
      await Promise.all([walk(a, mx - 7, my), walk(b, mx + 7, my), ...spots.map(([i, x, y]) => walk(people[i], x, y))]);
      a.classList.add('lean-r'); b.classList.add('lean-l');
      say(a, q); await wait(1100); say(b, r); await wait(1400);
      a.classList.remove('lean-r'); b.classList.remove('lean-l');
    }
  }

  function show(name) { scenes.forEach(s => s.classList.toggle('is-on', s.dataset.scene === name)); }
  if (still) { show('parade'); return; }
  // In turn while the box is on screen: the parade, the party, then the mingling.
  let started = false;
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || started) return;
    started = true;
    (async () => {
      for (;;) {
        show('parade'); runParade(); await wait(8600);
        show('party'); await wait(6000);
        show('mingle'); await runMingle(); await wait(400);
      }
    })();
  }, { threshold: 0.3 }).observe(box);
})();
