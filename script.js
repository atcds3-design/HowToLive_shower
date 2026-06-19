/* ============================================================
   HOW TO LIVE? — script.js  (v2)
   ============================================================ */

'use strict';

/* ============================================================
   ★ EDITABLE CONTENT
   ============================================================ */

/** Gameboard hotspot descriptions */
const HOTSPOT_DESCRIPTIONS = {
  topLeft:     "'이 아이는 커서 자신의 아이를 마구간에서 낳게 될 거에요.'\n그(내)가 존재하게 된 순간, 이 얼마나 축복할 일인가요.\n\n이 곳에서 시작하여 이 곳에서 게임이 끝납니다.",
  topRight:    "'아버지, 난 내 집으로 가겠어요. 난 내 집이 좋아요.'\n나무 위에 올라 잠을 잔 작은 노마와 달리 큰 노마는 굴뚝가에서 얼어 죽었습니다.\n\n갈림길 중 하나를 선택하여 이동합니다.",
  center:      "'그는 너무 늙고 지쳐 있었다. 사람들은 그가 조금 돌아버린 미친 늙은이라고 말들을 했다.'\n노마는 50년 세월의 동냥으로 그의 온 젊음을 써 버렸습니다.\n\n갈림길 중 하나를 선택하여 이동합니다.",
  bottomLeft:  "'그는 그의 집을 먹어버린 셈이었다.'\n산업화의 그림자는 노마는 집을 앗아갔고, 그는 자신의 존재를 집으로 삼았습니다.\n\n건물 카드 한 장 또는 점수 카드 세 장을 버립니다.",
  bottomRight: "'그는 분명히 액자가 걸릴 만큼 튼튼하게 못을 박았음에도 서너 번 더 못질을 했었다.'\n동냥을 하며 모은 돈으로 노마는 소중한 판자집 하나를 얻어냈습니다.\n\n건물 카드를 한 장 획득합니다.",
};

/** Hotspot zoom crop regions (% of gameboard image) */
const HOTSPOT_ZOOM = {
  topLeft:     { x:  0,  y:  0,  w: 45, h: 45 },
  topRight:    { x: 55,  y:  0,  w: 45, h: 45 },
  center:      { x: 25,  y: 25,  w: 50, h: 50 },
  bottomLeft:  { x:  0,  y: 55,  w: 45, h: 45 },
  bottomRight: { x: 55,  y: 55,  w: 45, h: 45 },
};

/** Score card titles & descriptions (35 items, index 0–34) */
const SCORE_TITLES = Array.from({ length: 35 }, (_, i) => `${i + 1}`);
const SCORE_DESCS  = Array.from({ length: 35 }, (_, i) => `카드를 클릭하면 뒷면을 볼 수 있습니다.`);

/** Build card titles & descriptions (15 items, index 0–14) */
const BUILD_TITLES = Array.from({ length: 15 }, (_, i) => `${i + 1}`);
const BUILD_DESCS  = Array.from({ length: 15 }, (_, i) => `카드를 클릭하면 뒷면을 볼 수 있습니다.`);

/** Total card counts */
const SCORE_COUNT = 35;
const BUILD_COUNT = 15;

/**
 * Score card back image:
 *   - All 35 cards share one back image: img/score_card_back.png
 */
const SCORE_BACK_IMG = 'img/score_card_back.png';

/**
 * Build card back images:
 *   - Cards 1–12  → img/build_card_back.png        (shared)
 *   - Cards 13–15 → img/build_card_back_13.png etc. (individual)
 *   Return null to show text-only fallback.
 */
function getBuildBackImg(cardNumber) {
  if (cardNumber >= 13 && cardNumber <= 15) {
    return `img/build_card_back_${cardNumber}.png`;
  }
  return 'img/build_card_back.png';
}

/** Rules / Message fallback text */
const RULES_FALLBACK = `게임 규칙을 여기에 입력하세요.

data/rules.txt 파일을 생성하면 자동으로 해당 내용이 표시됩니다.`;

const MESSAGE_FALLBACK = `전하고 싶은 말을 여기에 입력하세요.

data/message.txt 파일을 생성하면 자동으로 해당 내용이 표시됩니다.`;

/* ============================================================
   SOUND
   ============================================================ */
const SFX = { hover: null, click: null, transition: null };

function loadSounds() {
  ['hover', 'click', 'transition'].forEach(name => {
    const a = new Audio(`audio/${name}.mp3`);
    a.volume = name === 'hover' ? 0.35 : 0.6;
    a.preload = 'auto';
    SFX[name] = a;
  });
}

function playSound(name) {
  try {
    const s = SFX[name];
    if (!s) return;
    s.currentTime = 0;
    s.play().catch(() => {});
  } catch (_) {}
}

/* ============================================================
   PARTICLE BACKGROUND
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function mkP() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.25 - 0.05,
      a: Math.random() * 0.7 + 0.3,
    };
  }

  resize();
  particles = Array.from({ length: 90 }, mkP);

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#c8a96e';
    particles.forEach(p => {
      ctx.globalAlpha = p.a;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -2) { Object.assign(p, mkP()); p.y = H + 2; }
      if (p.x < -2) p.x = W + 2;
      if (p.x > W + 2) p.x = -2;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  })();

  window.addEventListener('resize', resize);
}

/* ============================================================
   SCREEN MANAGEMENT
   ============================================================ */
let currentScreen = 'screen-title';
const navHistory = [];

// Screens that use the light (parchment) background
const LIGHT_SCREENS = new Set([
  'screen-score', 'screen-build',
]);

function goTo(id, addHistory = true) {
  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(id);
  if (!next || id === currentScreen) return;

  playSound('transition');
  if (addHistory) navHistory.push(currentScreen);

  prev.classList.remove('active');
  next.classList.add('active');
  currentScreen = id;

  // Toggle body class for back-button light adaptation
  document.body.classList.toggle('light-active', LIGHT_SCREENS.has(id));

  updateBackBtn();

  if (id === 'screen-menu')      triggerMenuEntrance();
  if (id === 'screen-gameboard') initGameboard();
}

function goBack() {
  if (navHistory.length === 0) return;
  playSound('click');
  const prev = navHistory.pop();
  const curr = document.getElementById(currentScreen);
  const target = document.getElementById(prev);
  curr.classList.remove('active');
  target.classList.add('active');
  currentScreen = prev;
  document.body.classList.toggle('light-active', LIGHT_SCREENS.has(prev));
  updateBackBtn();
}

function updateBackBtn() {
  const btn = document.getElementById('back-btn');
  // Hide back button on title screen (수정 4)
  if (currentScreen === 'screen-title' || currentScreen === 'screen-menu') {
    btn.classList.remove('visible');
  } else {
    btn.classList.add('visible');
  }
}

/* ============================================================
   SCREEN 1 — TITLE
   ============================================================ */
function initTitle() {
  const screen  = document.getElementById('screen-title');
  const content = document.getElementById('title-content');

  screen.addEventListener('click', () => {
    playSound('click');
    content.classList.add('exit');
    setTimeout(() => {
      goTo('screen-menu');
      setTimeout(() => content.classList.remove('exit'), 200);
    }, 750);
  });
}

/* ============================================================
   SCREEN 2 — MAIN MENU
   ============================================================ */
function triggerMenuEntrance() {
  const items = document.querySelectorAll('.menu-item');
  items.forEach(el => el.classList.remove('entered'));
  items.forEach((el, i) => setTimeout(() => el.classList.add('entered'), 80 + i * 110));
}

function initMenu() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', () => playSound('hover'));
    item.addEventListener('click', () => {
      playSound('click');
      const target = item.dataset.target;
      if (target) goTo(target);
    });
  });
}

/* --- 게임 어시스턴트 사이트 (주사위 버튼) --- */
const ASSISTANT_SITE_URL = 'https://atcds3-design.github.io/Boardgame_HowToLive_Assistant/howtolive-boardgameplay/';

function initDiceAssistantBtn() {
  const btn = document.getElementById('dice-assistant-btn');
  if (!btn) return;

  const openAssistant = () => {
    playSound('click');
    window.open(ASSISTANT_SITE_URL, '_blank', 'noopener');
  };

  btn.addEventListener('mouseenter', () => playSound('hover'));
  btn.addEventListener('click', openAssistant);
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAssistant();
    }
  });
}

/* ============================================================
   SCREEN 3 — GAMEBOARD  (parallax + no '+' icon)
   ============================================================ */
let parallaxReady = false;

function initGameboard() {
  if (parallaxReady) return;
  parallaxReady = true;

  const container = document.getElementById('gameboard-container');
  const img = document.getElementById('gameboard-img');

  container.addEventListener('mousemove', e => {
    const r = container.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    img.style.transform = `translate(${dx * 5}px, ${dy * 4}px) scale(1.02)`;
  });
  container.addEventListener('mouseleave', () => {
    img.style.transform = 'translate(0,0) scale(1)';
  });
  container.addEventListener('touchmove', e => {
    const t = e.touches[0];
    const r = container.getBoundingClientRect();
    const dx = (t.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (t.clientY - r.top  - r.height / 2) / (r.height / 2);
    img.style.transform = `translate(${dx * 4}px, ${dy * 3}px) scale(1.02)`;
  }, { passive: true });
  container.addEventListener('touchend', () => {
    img.style.transform = 'translate(0,0) scale(1)';
  });
}

function initHotspots() {
  const overlay   = document.getElementById('hotspot-overlay');
  const desc      = document.getElementById('hotspot-desc');
  const zoomedImg = document.getElementById('hotspot-zoomed-img');
  const closeBtn  = document.getElementById('hotspot-close');

  document.querySelectorAll('.hotspot').forEach(spot => {
    spot.addEventListener('click', () => {
      playSound('click');
      const zone = spot.dataset.zone;
      desc.textContent = HOTSPOT_DESCRIPTIONS[zone] || '';

      const z = HOTSPOT_ZOOM[zone] || { x: 25, y: 25, w: 50, h: 50 };
      const scale = 100 / z.w;
      const ox = -(z.x / 100) * scale * 100;
      const oy = -(z.y / 100) * scale * 100;
      zoomedImg.style.transform = `scale(${scale}) translate(${ox / scale}%, ${oy / scale}%)`;
      zoomedImg.style.transformOrigin = '0 0';

      overlay.classList.remove('hidden');
    });
  });

  closeBtn.addEventListener('click', () => { overlay.classList.add('hidden'); playSound('click'); });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.add('hidden'); });
}

/* ============================================================
   TEXT SCREENS
   ============================================================ */
async function loadText(url, fallback, elementId) {
  const el = document.getElementById(elementId);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('not found');
    el.textContent = await res.text();
  } catch (_) {
    el.textContent = fallback;
  }
}

/* ============================================================
   CARD SCREENS
   ============================================================ */
/**
 * @param {string}   trackId    — id of .card-track element
 * @param {number}   count      — total card count
 * @param {string}   imgPrefix  — e.g. 'score_card' or 'build_card'
 * @param {string[]} titles     — subtitle per card
 * @param {Function} backImgFn  — (cardNumber) => image src string
 */
function buildCards(trackId, count, imgPrefix, titles, backImgFn) {
  const track = document.getElementById(trackId);
  track.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const item  = document.createElement('div');
    item.className = 'card-item';

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    /* --- Front face --- */
    const front = document.createElement('div');
    front.className = 'card-face front';
    const frontImg = document.createElement('img');
    frontImg.alt = titles[i - 1] || `카드 ${i}`;
    frontImg.src = `img/${imgPrefix}_${i}.png`;
    frontImg.onerror = function () {
      this.style.display = 'none';
      const ph = document.createElement('div');
      ph.className = 'card-placeholder';
      ph.textContent = `${imgPrefix}_${i}.png`;
      front.appendChild(ph);
    };
    front.appendChild(frontImg);

    /* --- Back face --- */
    const back = document.createElement('div');
    back.className = 'card-face back';

    const backSrc = backImgFn ? backImgFn(i) : null;
    if (backSrc) {
      const backImg = document.createElement('img');
      backImg.src = backSrc;
      backImg.alt = `${titles[i - 1] || `카드 ${i}`} 뒷면`;
      backImg.onerror = function () {
        // Fallback to text if image missing
        this.style.display = 'none';
        const bc = document.createElement('div');
        bc.className = 'card-back-content';
        bc.innerHTML = `<span>${titles[i - 1] || `카드 ${i}`}</span>`;
        back.appendChild(bc);
      };
      back.appendChild(backImg);
    } else {
      const bc = document.createElement('div');
      bc.className = 'card-back-content';
      bc.innerHTML = `<span>${titles[i - 1] || `카드 ${i}`}</span>`;
      back.appendChild(bc);
    }

    inner.appendChild(front);
    inner.appendChild(back);

    inner.addEventListener('click', () => {
      playSound('click');
      inner.classList.toggle('flipped');
    });

    item.appendChild(inner);
    track.appendChild(item);
  }
}

function initCardNav(viewportId, trackId, prevId, nextId, counterId, subtitleId, descId, total, titles, descs) {
  let current = 0;

  const track    = document.getElementById(trackId);
  const prevBtn  = document.getElementById(prevId);
  const nextBtn  = document.getElementById(nextId);
  const counter  = document.getElementById(counterId);
  const subtitle = document.getElementById(subtitleId);
  const descEl   = document.getElementById(descId);

  function goCard(idx) {
    current = Math.max(0, Math.min(total - 1, idx));
    track.style.transform = `translateX(-${current * 100}%)`;
    counter.textContent  = `${current + 1} / ${total}`;
    if (subtitle) subtitle.textContent = titles[current] || '';
    if (descEl)   descEl.textContent   = (descs && descs[current]) ? descs[current] : '';
  }

  prevBtn.addEventListener('click', () => { playSound('click'); goCard(current - 1); });
  nextBtn.addEventListener('click', () => { playSound('click'); goCard(current + 1); });

  document.addEventListener('keydown', e => {
    const isScore = currentScreen === 'screen-score' && trackId === 'score-track';
    const isBuild = currentScreen === 'screen-build' && trackId === 'build-track';
    if (!isScore && !isBuild) return;
    if (e.key === 'ArrowLeft')  { playSound('click'); goCard(current - 1); }
    if (e.key === 'ArrowRight') { playSound('click'); goCard(current + 1); }
  });

  const viewport = document.getElementById(viewportId);
  let startX = null;

  viewport.addEventListener('mousedown',  e => { startX = e.clientX; });
  viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });

  function endDrag(endX) {
    if (startX === null) return;
    const dx = endX - startX;
    if (Math.abs(dx) > 40) { playSound('click'); goCard(dx < 0 ? current + 1 : current - 1); }
    startX = null;
  }

  viewport.addEventListener('mouseup',    e => endDrag(e.clientX));
  viewport.addEventListener('touchend',   e => endDrag(e.changedTouches[0].clientX));
  viewport.addEventListener('mouseleave', () => { startX = null; });

  goCard(0);
}

/* ============================================================
   BACK BUTTON
   ============================================================ */
function initBackBtn() {
  document.getElementById('back-btn').addEventListener('click', goBack);
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadSounds();
  initParticles();
  initTitle();
  initMenu();
  initDiceAssistantBtn();
  initHotspots();
  initBackBtn();

  // Score cards — all share one back image
  buildCards('score-track', SCORE_COUNT, 'score_card', SCORE_TITLES, () => SCORE_BACK_IMG);
  // Build cards — 1-12 shared back, 13-15 individual
  buildCards('build-track', BUILD_COUNT, 'build_card', BUILD_TITLES, getBuildBackImg);

  // Card navigation (now includes desc element ids)
  initCardNav(
    'score-viewport', 'score-track',
    'score-prev', 'score-next', 'score-counter',
    'score-subtitle', 'score-desc',
    SCORE_COUNT, SCORE_TITLES, SCORE_DESCS
  );
  initCardNav(
    'build-viewport', 'build-track',
    'build-prev', 'build-next', 'build-counter',
    'build-subtitle', 'build-desc',
    BUILD_COUNT, BUILD_TITLES, BUILD_DESCS
  );

  loadText('data/rules.txt',   RULES_FALLBACK,   'rules-body');
  loadText('data/message.txt', MESSAGE_FALLBACK, 'message-body');

  document.getElementById('screen-title').classList.add('active');
});
