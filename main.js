const workspace = document.getElementById('workspace');
const canvasContainer = document.getElementById('canvasContainer');
const drawingCanvas = document.getElementById('drawingCanvas');
const activeCanvas = document.getElementById('activeCanvas');
const templateCanvas = document.getElementById('templateCanvas');
const gridCanvas = document.getElementById('gridCanvas');
const heatmapCanvas = document.getElementById('heatmapCanvas');
// Ultra-low latency desynchronized context for hardware GPU-accelerated inking
const dCtx = drawingCanvas.getContext('2d', { desynchronized: true, alpha: true });
const aCtx = activeCanvas.getContext('2d', { desynchronized: true, alpha: true });
const tCtx = templateCanvas.getContext('2d', { willReadFrequently: true });
const gCtx = gridCanvas.getContext('2d');
const hCtx = heatmapCanvas.getContext('2d');

// Hierarchical Popover Pods & Flyouts
const penPodBtn = document.getElementById('penPodBtn');
const penPopover = document.getElementById('penPopover');
const penPodWrapper = document.getElementById('penPodWrapper');
const activePenIcon = document.getElementById('activePenIcon');
const activePenLabel = document.getElementById('activePenLabel');
const activePenSizeBadge = document.getElementById('activePenSizeBadge');
const brushSizeDisplay = document.getElementById('brushSizeDisplay');
const activeScriptLabel = document.getElementById('activeScriptLabel');
const miniAngleCompass = document.getElementById('miniAngleCompass');
const compassNeedle = document.getElementById('compassNeedle');
const playerMiniLevel = document.getElementById('playerMiniLevel');
const penToolsGroup = document.getElementById('penToolsGroup');
const penToolBtns = document.querySelectorAll('.pen-tool-btn');
let currentPenType = 'qalam';

// Interactive Calligraphy Demonstration Elements
const interactiveDemoBtn = document.getElementById('interactiveDemoBtn');
const interactiveDemoModal = document.getElementById('interactiveDemoModal');
const closeInteractiveDemoBtn = document.getElementById('closeInteractiveDemoBtn');
const demoCanvas = document.getElementById('demoCanvas');
const demoCtx = demoCanvas ? demoCanvas.getContext('2d') : null;
const demoNibCursor = document.getElementById('demoNibCursor');
const demoNibBlade = document.getElementById('demoNibBlade');
const demoNibAngleTag = document.getElementById('demoNibAngleTag');
const demoLetterTitle = document.getElementById('demoLetterTitle');
const demoScriptDesc = document.getElementById('demoScriptDesc');
const demoChipsRow = document.getElementById('demoChipsRow');
const demoStep1 = document.getElementById('demoStep1');
const demoStep2 = document.getElementById('demoStep2');
const demoStep3 = document.getElementById('demoStep3');
const demoStep1Title = document.getElementById('demoStep1Title');
const demoStep1Desc = document.getElementById('demoStep1Desc');
const demoStep2Title = document.getElementById('demoStep2Title');
const demoStep2Desc = document.getElementById('demoStep2Desc');
const demoStep3Title = document.getElementById('demoStep3Title');
const demoStep3Desc = document.getElementById('demoStep3Desc');
const demoPlayPauseBtn = document.getElementById('demoPlayPauseBtn');
const demoReplayBtn = document.getElementById('demoReplayBtn');
const demoPracticeNowBtn = document.getElementById('demoPracticeNowBtn');

// Teacher's Hint & Classical Pedagogy Modal
const teacherHintBtn = document.getElementById('teacherHintBtn');
const teacherHintModal = document.getElementById('teacherHintModal');
const closeTeacherHintBtn = document.getElementById('closeTeacherHintBtn');
const closeTeacherModalBottomBtn = document.getElementById('closeTeacherModalBottomBtn');
const applyTeacherSettingsBtn = document.getElementById('applyTeacherSettingsBtn');
const teacherVoiceText = document.getElementById('teacherVoiceText');
const teacherScriptSubtitle = document.getElementById('teacherScriptSubtitle');
const teacherDotRule = document.getElementById('teacherDotRule');
const teacherAngleRule = document.getElementById('teacherAngleRule');
const teacherPenRule = document.getElementById('teacherPenRule');
const teacherMistakesRule = document.getElementById('teacherMistakesRule');
const dotScaleContainer = document.getElementById('dotScaleContainer');

// Multi-Player Profiles Modal
const playerProfileBtn = document.getElementById('playerProfileBtn');
const playerAvatarIcon = document.getElementById('playerAvatarIcon');
const playerNameLabel = document.getElementById('playerNameLabel');
const playerModal = document.getElementById('playerModal');
const closePlayerModalBtn = document.getElementById('closePlayerModalBtn');
const apBannerAvatar = document.getElementById('apBannerAvatar');
const apBannerName = document.getElementById('apBannerName');
const apBannerLevel = document.getElementById('apBannerLevel');
const apBannerStats = document.getElementById('apBannerStats');
const playersGrid = document.getElementById('playersGrid');
const newPlayerNameInput = document.getElementById('newPlayerNameInput');
const createNewPlayerBtn = document.getElementById('createNewPlayerBtn');
const avatarPickerRow = document.getElementById('avatarPickerRow');
let selectedAvatar = '✍️';

// HUD & Diagnostics Elements
const hudToggleBtn = document.getElementById('hudToggleBtn');
const stylusHud = document.getElementById('stylusHud');
const hudDragHandle = document.getElementById('hudDragHandle');
const closeHudBtn = document.getElementById('closeHudBtn');
const hudToolType = document.getElementById('hudToolType');
const hudSpeedVal = document.getElementById('hudSpeedVal');
const hudRateVal = document.getElementById('hudRateVal');
const hudLatencyVal = document.getElementById('hudLatencyVal');
const hudPressureBar = document.getElementById('hudPressureBar');
const hudPressureVal = document.getElementById('hudPressureVal');
const hudTiltVal = document.getElementById('hudTiltVal');
const hudPalmStatus = document.getElementById('hudPalmStatus');
const hudCoalescedCount = document.getElementById('hudCoalescedCount');
const hudPointsCount = document.getElementById('hudPointsCount');
const hudGenReportBtn = document.getElementById('hudGenReportBtn');
const hudResetMetricsBtn = document.getElementById('hudResetMetricsBtn');
const hudReportBox = document.getElementById('hudReportBox');
const hudReportText = document.getElementById('hudReportText');
const hudCopyReportBtn = document.getElementById('hudCopyReportBtn');

// Gamification Elements
const gameModeBtn = document.getElementById('gameModeBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const levelName = document.getElementById('levelName');
const levelNum = document.getElementById('levelNum');
const levelIcon = document.getElementById('levelIcon');
const xpBarFill = document.getElementById('xpBarFill');
const xpText = document.getElementById('xpText');
const streakCount = document.getElementById('streakCount');
const challengePopup = document.getElementById('challengePopup');
const closeChallengeBtn = document.getElementById('closeChallengeBtn');
const challengeList = document.getElementById('challengeList');
const scoreStarContainer = document.getElementById('scoreStarContainer');
const scoreXpTag = document.getElementById('scoreXpTag');
const fxCanvas = document.getElementById('fxCanvas');
const fxCtx = fxCanvas ? fxCanvas.getContext('2d') : null;

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');
const scoreBtn = document.getElementById('scoreBtn');
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const practiceTextInput = document.getElementById('practiceText');
const ghostOpacityInput = document.getElementById('ghostOpacity');
const gridSelect = document.getElementById('gridSelect');
const templateBtns = document.querySelectorAll('.template-btn');
const scorePopup = document.getElementById('scorePopup');
const closeScoreBtn = document.getElementById('closeScoreBtn');
const angleDisplay = document.getElementById('angleDisplay');
const fitViewBtn = document.getElementById('fitViewBtn');
const resetViewBtn = document.getElementById('resetViewBtn');
const statusMessage = document.getElementById('statusMessage');
const nibAngleSlider = document.getElementById('nibAngleSlider');
const undoBtn = document.getElementById('undoBtn');
let undoneStrokes = [];

const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 800;
const MARGIN = 64;
const MAX_FONT = 150;
const TEXT_LIMIT = 500;

let currentFont = 'Aref Ruqaa';
let isEnglishFlex = false;
let defaultNibAngle = -45 * (Math.PI / 180);
let baseSize = parseInt(brushSize.value);
let scale = 1;
let translateX = 0;
let translateY = 0;

let activePointerId = null;
let activePointerType = null;
let activeIsStylus = false;
let isDrawing = false;
let pointerCache = [];
let initialPinchDist = null;
let pinchLogicalMidpoint = null;

let strokes = [];
let currentStroke = null;
let lastPt = null;
let lastPressure = null;
let templateDrawId = 0;
let scoreJobId = 0;

let currentActiveButtonIndex = 0;
let lastValidState = null;
let layoutVersion = 0;
let templateLayout = {
  ready: false,
  version: 0,
  font: '',
  fontSize: 0,
  direction: 'rtl',
  textAlign: 'center',
  textBaseline: 'middle',
  lines: [],
  worldWidth: WORLD_WIDTH,
  worldHeight: WORLD_HEIGHT,
  contentBounds: { left: 0, right: 0, top: 0, bottom: 0 }
};
let scoringImageData = null;

window.getTemplateLayout = () => {
  return JSON.parse(JSON.stringify(templateLayout));
};

// ==========================================
// 1. Web Audio Synthesizer (100% Offline, Zero Dependencies)
// ==========================================
let audioCtx = null;
let soundEnabled = localStorage.getItem('calligraphy_sound') !== 'false';

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'stroke') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'xp') {
    osc.type = 'triangle';
    const notes = [523.25, 587.33, 659.25, 783.99, 880.0];
    const note = notes[Math.floor(Math.random() * notes.length)];
    osc.frequency.setValueAtTime(note, now);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.22);
  } else if (type === 'levelup') {
    const chords = [523.25, 659.25, 783.99, 1046.5];
    chords.forEach((freq, idx) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      o.type = 'triangle';
      const t = now + idx * 0.09;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.start(t);
      o.stop(t + 0.35);
    });
  } else if (type === 'star') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.28);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.28);
  }
}

function updateSoundButton() {
  if (soundToggleBtn) {
    soundToggleBtn.textContent = soundEnabled ? '🔔' : '🔕';
    soundToggleBtn.title = soundEnabled ? 'المؤثرات الصوتية مفعلة' : 'المؤثرات الصوتية مكتومة';
  }
}
if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('calligraphy_sound', soundEnabled);
    updateSoundButton();
    if (soundEnabled) playSound('xp');
  });
  updateSoundButton();
}

// ==========================================
// 2. Multi-Player & Gamification Engine
// ==========================================
const LEVEL_THRESHOLDS = [
  { level: 1, title: 'خطاط مبتدئ', xpRequired: 100, icon: '🎖️' },
  { level: 2, title: 'متدرب الديوان', xpRequired: 250, icon: '📜' },
  { level: 3, title: 'كاتب بارع', xpRequired: 500, icon: '🖋️' },
  { level: 4, title: 'أستاذ الخط', xpRequired: 900, icon: '⭐' },
  { level: 5, title: 'عميد الخطاطين', xpRequired: 1500, icon: '👑' }
];

const DEFAULT_PLAYERS = [
  {
    id: 'player_1',
    name: 'المتدرب الأول',
    avatar: '✍️',
    xp: parseInt(localStorage.getItem('calligraphy_xp') || '0'),
    level: parseInt(localStorage.getItem('calligraphy_level') || '1'),
    streak: 1,
    totalStrokes: parseInt(localStorage.getItem('calligraphy_total_strokes') || '0'),
    completedChallenges: [],
    history: []
  }
];

function getStoredPlayers() {
  try {
    const raw = localStorage.getItem('calligraphy_players_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) {}
  return DEFAULT_PLAYERS;
}

let playersList = getStoredPlayers();
let activePlayerId = localStorage.getItem('calligraphy_active_player_id_v2') || playersList[0].id;
let activePlayer = playersList.find(p => p.id === activePlayerId) || playersList[0];

let gameState = {
  xp: activePlayer.xp || 0,
  level: activePlayer.level || 1,
  streak: activePlayer.streak || 1,
  totalStrokesDrawn: activePlayer.totalStrokes || 0
};

function savePlayersList() {
  try {
    localStorage.setItem('calligraphy_players_v2', JSON.stringify(playersList));
    localStorage.setItem('calligraphy_active_player_id_v2', activePlayer.id);
  } catch(e) {}
}

function syncGameStateWithPlayer() {
  if (!activePlayer) activePlayer = playersList[0];
  gameState.xp = activePlayer.xp || 0;
  gameState.level = activePlayer.level || 1;
  gameState.streak = activePlayer.streak || 1;
  gameState.totalStrokesDrawn = activePlayer.totalStrokes || 0;
  
  if (playerNameLabel) playerNameLabel.textContent = activePlayer.name;
  if (playerAvatarIcon) playerAvatarIcon.textContent = activePlayer.avatar || '✍️';
  if (playerMiniLevel) playerMiniLevel.textContent = `Lv.${activePlayer.level || 1}`;

  updateGamifyUI();
}

function getLevelInfo(level) {
  return LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

function updateGamifyUI() {
  const currentInfo = getLevelInfo(gameState.level);
  if (levelName) levelName.textContent = currentInfo.title;
  if (levelNum) levelNum.textContent = `Lv.${gameState.level}`;
  if (levelIcon) levelIcon.textContent = currentInfo.icon;
  if (streakCount) streakCount.textContent = gameState.streak;

  const prevXp = gameState.level === 1 ? 0 : (LEVEL_THRESHOLDS.find(l => l.level === gameState.level - 1)?.xpRequired || 0);
  const targetXp = currentInfo.xpRequired;
  const currentLevelXp = Math.max(0, gameState.xp - prevXp);
  const neededLevelXp = Math.max(1, targetXp - prevXp);
  const progressPct = Math.min(100, Math.round((currentLevelXp / neededLevelXp) * 100));

  if (xpBarFill) xpBarFill.style.width = `${progressPct}%`;
  if (xpText) xpText.textContent = `${gameState.xp} / ${targetXp} XP`;
}

function addXp(amount, clientX = null, clientY = null) {
  gameState.xp += amount;
  activePlayer.xp = gameState.xp;

  const currentInfo = getLevelInfo(gameState.level);
  if (gameState.xp >= currentInfo.xpRequired && gameState.level < LEVEL_THRESHOLDS.length) {
    gameState.level++;
    activePlayer.level = gameState.level;
    playSound('levelup');
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 70);
    setStatusMessage(`🎉 مبارك يا ${activePlayer.name}! ارتقيت إلى رتبة: ${getLevelInfo(gameState.level).title} (المستوى ${gameState.level})`, false);
  } else {
    playSound('xp');
  }

  savePlayersList();

  if (clientX !== null && clientY !== null) {
    showFloatingXp(`+${amount} XP`, clientX, clientY);
  }

  updateGamifyUI();
}

function showFloatingXp(text, x, y) {
  const el = document.createElement('div');
  el.className = 'floating-xp';
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// Multi-Player Modal Handlers
function renderPlayersModal() {
  if (!playerModal) return;
  if (apBannerAvatar) apBannerAvatar.textContent = activePlayer.avatar || '✍️';
  if (apBannerName) apBannerName.textContent = activePlayer.name || 'المتدرب';
  if (apBannerLevel) apBannerLevel.textContent = `المستوى ${activePlayer.level || 1} (${getLevelInfo(activePlayer.level || 1).title})`;
  if (apBannerStats) {
    const exCount = activePlayer.history ? activePlayer.history.length : 0;
    apBannerStats.textContent = `الخبرة: ${activePlayer.xp || 0} XP | الحماس: 🔥 ${activePlayer.streak || 1} | التمارين: ${exCount}`;
  }

  if (playersGrid) {
    playersGrid.innerHTML = '';
    playersList.forEach(player => {
      const card = document.createElement('div');
      card.className = 'player-item-card' + (player.id === activePlayer.id ? ' active' : '');
      
      const avatarSpan = document.createElement('span');
      avatarSpan.className = 'pic-avatar';
      avatarSpan.textContent = player.avatar || '✍️';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'pic-name';
      nameSpan.textContent = player.name;

      const statsSpan = document.createElement('span');
      statsSpan.className = 'pic-stats';
      statsSpan.textContent = `Lv.${player.level || 1} • ${player.xp || 0} XP`;

      card.appendChild(avatarSpan);
      card.appendChild(nameSpan);
      card.appendChild(statsSpan);

      if (playersList.length > 1 && player.id !== activePlayer.id) {
        const delBtn = document.createElement('button');
        delBtn.className = 'pic-delete-btn';
        delBtn.title = 'حذف هذا المتدرب';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          deletePlayer(player.id);
        });
        card.appendChild(delBtn);
      }

      card.addEventListener('click', () => {
        selectPlayer(player.id);
      });

      playersGrid.appendChild(card);
    });
  }
}

function selectPlayer(id) {
  const found = playersList.find(p => p.id === id);
  if (!found) return;
  activePlayer = found;
  activePlayerId = id;
  savePlayersList();
  syncGameStateWithPlayer();
  renderPlayersModal();
  playSound('tap');
  setStatusMessage(`مرحباً بك يا ${activePlayer.name}! 🌟 تابع تمرينك`, false);
  if (playerModal) playerModal.classList.add('hidden');
}

function createNewPlayer(name, avatar) {
  const cleanName = (name || '').trim();
  if (!cleanName) {
    setStatusMessage('⚠️ يرجى كتابة اسم المتدرب أولاً!', true);
    return;
  }
  const newP = {
    id: 'player_' + Date.now(),
    name: cleanName,
    avatar: avatar || '✍️',
    xp: 0,
    level: 1,
    streak: 1,
    totalStrokes: 0,
    completedChallenges: [],
    history: [],
    createdAt: Date.now()
  };
  playersList.push(newP);
  savePlayersList();
  selectPlayer(newP.id);
  if (newPlayerNameInput) newPlayerNameInput.value = '';
}

function deletePlayer(id) {
  if (playersList.length <= 1) return;
  playersList = playersList.filter(p => p.id !== id);
  savePlayersList();
  if (activePlayer.id === id) {
    selectPlayer(playersList[0].id);
  } else {
    renderPlayersModal();
  }
}

if (playerProfileBtn) {
  playerProfileBtn.addEventListener('click', () => {
    renderPlayersModal();
    if (playerModal) playerModal.classList.remove('hidden');
    playSound('tap');
  });
}

if (closePlayerModalBtn) {
  closePlayerModalBtn.addEventListener('click', () => {
    if (playerModal) playerModal.classList.add('hidden');
    playSound('tap');
  });
}

if (avatarPickerRow) {
  avatarPickerRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.avatar-opt-btn');
    if (!btn) return;
    avatarPickerRow.querySelectorAll('.avatar-opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedAvatar = btn.dataset.avatar || '✍️';
    playSound('tap');
  });
}

if (createNewPlayerBtn) {
  createNewPlayerBtn.addEventListener('click', () => {
    const name = newPlayerNameInput ? newPlayerNameInput.value : '';
    createNewPlayer(name, selectedAvatar);
  });
}

// ==========================================
// 3. Fast Canvas Particle Effects (Confetti & Stars)
// ==========================================
let particles = [];
let animFrameId = null;

function resizeFxCanvas() {
  if (!fxCanvas) return;
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeFxCanvas);
resizeFxCanvas();

function triggerConfetti(originX, originY, count = 45) {
  if (!fxCtx) return;
  const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6', '#ffd700'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 10 + 3;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.2
    });
  }
  if (!animFrameId) updateParticles();
}

function updateParticles() {
  if (!fxCtx) return;
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.alpha -= p.decay;
    p.rotation += p.rotSpeed;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    fxCtx.save();
    fxCtx.globalAlpha = p.alpha;
    fxCtx.translate(p.x, p.y);
    fxCtx.rotate(p.rotation);
    fxCtx.fillStyle = p.color;
    fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
    fxCtx.restore();
  }

  if (particles.length > 0) {
    animFrameId = requestAnimationFrame(updateParticles);
  } else {
    animFrameId = null;
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  }
}

function invalidateScore() {
  scoreJobId++;
  if (!scorePopup.classList.contains('hidden')) {
    scorePopup.classList.add('hidden');
    hCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  }
}

function updateCamera() {
  canvasContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function fitView() {
  const rect = workspace.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  const paddingX = 48;
  const paddingY = 48;
  const availW = Math.max(rect.width - paddingX * 2, 200);
  const availH = Math.max(rect.height - paddingY * 2, 200);
  const scaleX = availW / WORLD_WIDTH;
  const scaleY = availH / WORLD_HEIGHT;
  scale = Math.min(scaleX, scaleY);
  translateX = (rect.width - WORLD_WIDTH * scale) / 2;
  translateY = (rect.height - WORLD_HEIGHT * scale) / 2;
  updateCamera();
}

function resetView() {
  const rect = workspace.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  scale = 1;
  translateX = (rect.width - WORLD_WIDTH) / 2;
  translateY = (rect.height - WORLD_HEIGHT) / 2;
  updateCamera();
}

if (fitViewBtn) fitViewBtn.addEventListener('click', () => { interruptGestures(); fitView(); });
if (resetViewBtn) resetViewBtn.addEventListener('click', () => { interruptGestures(); resetView(); });

// ==========================================
// 4. Physical Pen Tools & Popover Controller
// ==========================================
const PEN_INFO = {
  qalam: { icon: '✒️', name: 'قصبة عربي', defaultSize: 20 },
  ruling: { icon: '📏', name: 'مسطرة هندسي', defaultSize: 14 },
  fountain: { icon: '🖋️', name: 'حبر سائل', defaultSize: 16 },
  ballpoint: { icon: '🖊️', name: 'قلم جاف', defaultSize: 8 },
  pencil: { icon: '✏️', name: 'رصاص فني', defaultSize: 18 },
  brush: { icon: '🖌️', name: 'فرشاة حرة', defaultSize: 22 }
};

function setPenType(type) {
  currentPenType = type;
  if (penToolBtns) {
    penToolBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pen === type);
    });
  }

  const info = PEN_INFO[type] || PEN_INFO.qalam;
  if (activePenIcon) activePenIcon.textContent = info.icon;
  if (activePenLabel) activePenLabel.textContent = info.name;

  // Adjust tool defaults to simulate real physical tool behavior
  if (type === 'pencil') {
    colorPicker.value = '#334155';
    brushSize.value = 18;
    baseSize = 18;
    setStatusMessage('✏️ قلم الرصاص الفني: استجابة للميل والتظليل العريض', false);
  } else if (type === 'ballpoint') {
    brushSize.value = 8;
    baseSize = 8;
    setStatusMessage('🖊️ قلم جاف 0.8 مم: استجابة دقيقة وحبر انسيابي ثابت', false);
  } else if (type === 'ruling') {
    brushSize.value = 14;
    baseSize = 14;
    setStatusMessage('📏 قلم المسطرة والتحبير: خط هندسي دقيق موحد', false);
  } else if (type === 'fountain') {
    brushSize.value = 16;
    baseSize = 16;
    setStatusMessage('🖋️ قلم حبر سائل: ريشة مرنة ذات انسيابية شعرية', false);
  } else if (type === 'brush') {
    brushSize.value = 22;
    baseSize = 22;
    setStatusMessage('🖌️ فرشاة حرة: مرونة فائقة وتدرج ديناميكي واسع', false);
  } else if (type === 'qalam') {
    brushSize.value = 20;
    baseSize = 20;
    setStatusMessage('✒️ قصبة الخط العربي: سن مشطوف بميزان النقط الأصيل', false);
  }

  if (activePenSizeBadge) activePenSizeBadge.textContent = `${baseSize}px`;
  if (brushSizeDisplay) brushSizeDisplay.textContent = `${baseSize}px`;

  document.querySelectorAll('.size-chip').forEach(chip => {
    chip.classList.toggle('active', parseInt(chip.dataset.size) === baseSize);
  });

  playSound('tap');
}

if (penToolBtns) {
  penToolBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setPenType(btn.dataset.pen);
    });
  });
}

// Popover Toggle & Auto-Close
if (penPodBtn && penPopover) {
  penPodBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    penPopover.classList.toggle('hidden');
    penPodBtn.classList.toggle('active', !penPopover.classList.contains('hidden'));
  });

  document.addEventListener('pointerdown', (e) => {
    if (penPopover && !penPopover.classList.contains('hidden')) {
      if (!penPopover.contains(e.target) && !penPodBtn.contains(e.target)) {
        penPopover.classList.add('hidden');
        penPodBtn.classList.remove('active');
      }
    }
  });
}

// Preset Size Chips
document.querySelectorAll('.size-chip').forEach(chip => {
  chip.addEventListener('click', (e) => {
    e.stopPropagation();
    const s = parseInt(chip.dataset.size);
    baseSize = s;
    if (brushSize) brushSize.value = s;
    if (brushSizeDisplay) brushSizeDisplay.textContent = `${s}px`;
    if (activePenSizeBadge) activePenSizeBadge.textContent = `${s}px`;
    document.querySelectorAll('.size-chip').forEach(c => c.classList.toggle('active', c === chip));
    playSound('tap');
  });
});

// Preset Angle Chips
document.querySelectorAll('.angle-chip').forEach(chip => {
  chip.addEventListener('click', (e) => {
    e.stopPropagation();
    const a = parseInt(chip.dataset.angle);
    defaultNibAngle = a * (Math.PI / 180);
    if (nibAngleSlider) nibAngleSlider.value = a;
    updateAngleDisplay(defaultNibAngle);
    document.querySelectorAll('.angle-chip').forEach(c => c.classList.toggle('active', c === chip));
    playSound('tap');
  });
});

// Ink Palette Swatches
document.querySelectorAll('.ink-swatch').forEach(swatch => {
  swatch.addEventListener('click', (e) => {
    e.stopPropagation();
    const color = swatch.dataset.color;
    if (colorPicker) colorPicker.value = color;
    document.querySelectorAll('.ink-swatch').forEach(s => s.classList.toggle('active', s === swatch));
    playSound('tap');
  });
});

if (brushSize) {
  brushSize.addEventListener('input', () => {
    baseSize = parseInt(brushSize.value);
    if (brushSizeDisplay) brushSizeDisplay.textContent = `${baseSize}px`;
    if (activePenSizeBadge) activePenSizeBadge.textContent = `${baseSize}px`;
    document.querySelectorAll('.size-chip').forEach(c => c.classList.toggle('active', parseInt(c.dataset.size) === baseSize));
  });
}

// ==========================================
// 5. Classical Calligraphy Pedagogy Knowledge Base
// ==========================================
const CALLIGRAPHY_KNOWLEDGE_BASE = {
  scripts: {
    'Aref Ruqaa': {
      title: 'خط الرقعة (سريع وعملي ورشيق)',
      school: 'المدرسة العثمانية - ممتاز بك وأبو الفضل الرقعي',
      voice: 'يا بني، خط الرقعة هو خط السرعة والإيجاز والوضوح؛ تمتاز حروفه بالاستقامة وتخلو تماماً من الترويس والتشكيل. ثبّت سن القلم على زاوية -45° ولا تتردد عند سحب الحرف أبداً.',
      dotRule: 'الألف: 3 نقاط عمودية بميل طفيف. الباء: 3 نقاط اتساعاً بنزول نقطة. النون: نقطتان ونصف وتستقر فوق السطر ولا تنزل عنه!',
      dotsCount: 3,
      angleRule: 'زاوية السن: -45°. حركة الخط تنبع حصراً من أنامل الأصابع ومفصل المعصم دون تحريك الذراع، ما يمنح الحروف سرعتها وصلابتها.',
      penRule: 'القلم الموصى به: قصبة الخط العربي التقليدية (أو قلم جاف 0.8 مم للكتابة السريعة اليومية) | حجم السن 18-22px | شبكة تسطير مائلة.',
      mistakes: 'أكبر خطأ للمبتدئين في الرقعة هو إنزال حرف النون أو الصاد تحت السطر؛ تذكر دائماً أن حروف الرقعة كلها تستقر فوق السطر إلا حروف كلمة (جمعه: الجيم، الميم، العين، الهاء الوسطية).',
      recommendedPen: 'qalam',
      recommendedAngle: -45,
      recommendedSize: 20
    },
    'Amiri': {
      title: 'خط النسخ الكلاسيكي (ميزان المصاحف والكتب)',
      school: 'المدرسة العباسية - الوزير ابن مقلة وابن البواب وياقوت المستعصمي',
      voice: 'النسخ هو ميزان الخط العربي ومرآة هندسته؛ قال ابن مقلة: "أحسن الخط ما استوى قطاعه وحسنت أضلاعه وتشابهت كؤوسه". اكتب بتؤدة ووقار، فإن حروف النسخ كالعقد المنظوم.',
      dotRule: 'الألف: 5 نقاط بميل نصف نقطة لليسار في قمته. كؤوس الحروف (ن، س، ص، ق): تتسع لـ 3 نقاط وتهبط نقطتين تحت السطر في قوس توازني كامل.',
      dotsCount: 5,
      angleRule: 'زاوية السن: -70° (زاوية شديدة الميل نحو الرأس). حركة اليد رصينة ومحكومة بارتكاز المعصم وحركة مشط اليد لضبط الاستدارات.',
      penRule: 'القلم الموصى به: قصبة الخط العربي بسن مشطوف دقيق | حجم السن 18-22px | شبكة تسطير أفقية.',
      mistakes: 'تسطيح كؤوس النون والسين أو جعل الألف منحنية بشدة. احرص على بقاء الحروف النازلة محصورة في عبارة (نصلي شروق مميت).',
      recommendedPen: 'qalam',
      recommendedAngle: -70,
      recommendedSize: 20
    },
    'Scheherazade New': {
      title: 'خط النسخ القرآني (الهيبة والجلال)',
      school: 'مدرسة الحافظ عثمان ومصاحف المدينة المنورة',
      voice: 'هذا خط كتاب الله العزيز، فيه كمال التناسب والوضوح؛ اجعل مسافات الحروف متساوية والمدات متزنة كأنها أنفاس مرتّل متأمل.',
      dotRule: 'الألف: 5 نقاط قائمة، واللامات متساوية الطول مع الألف، والهاء في لفظ الجلالة ترتفع بمقدار نقطتين.',
      dotsCount: 5,
      angleRule: 'زاوية السن: -65° إلى -70°. ثبات زاوية السن يضمن تناغم الخطوط الرأسية السميكة مع الامتدادات الأفقية الرفيعة.',
      penRule: 'القلم: قصبة عربي أو حبر سائل | حجم السن 22px | شبكة أفقية.',
      mistakes: 'عدم ترك مسافة كافية بين الكلمات، أو المبالغة في تفريغ الفراغات الداخلية (العيون) لحروف الصاد والطاء والميم.',
      recommendedPen: 'qalam',
      recommendedAngle: -65,
      recommendedSize: 22
    },
    'Gulzar': {
      title: 'خط النستعليق (الخط الفارسي الشعري المعلق)',
      school: 'المدرسة الإيرانية - مير علي التبريزي ومير عماد الحسني',
      voice: 'النستعليق كأنه رقصة على السطر؛ تبدأ الكلمة من الأعلى يميناً وتنحدر بنعومة رشيقة لتستقر نهايتها على السطر، مع تباين ساحر بين الحركات الرقيقة والسميكة.',
      dotRule: 'الألف: 3 نقاط دقيقة بانحدار مقداره نقطة ونصف. مدة السين (الكشيدة): تمتد من 9 إلى 11 نقطة بانحناء قوسي دقيق يشبه السيف.',
      dotsCount: 3,
      angleRule: 'زاوية السن: -55°. السحب يعتمد على حركة الساعد كاملة أثناء مد الكلمات ورسم الاستدارات البيضاوية.',
      penRule: 'القلم: قصبة عربي مائلة أو فرشاة حرة | حجم السن 22-26px.',
      mistakes: 'كتابة الكلمات على سطر أفقي ميت؛ جمال النستعليق ينبع من الانحدار الزاوي المتناسق للكلمات المعلقة.',
      recommendedPen: 'qalam',
      recommendedAngle: -55,
      recommendedSize: 24
    },
    'Rakkas': {
      title: 'الخط الديواني الملكي (الانحناءات والالتفاف والرشاقة)',
      school: 'ديوان السلطان العثماني - إبراهيم منيف وشهلا باشا',
      voice: 'الديواني خط السر والمراسيم الملوكية؛ حروفه كلها تقويس والتفاف وتداخل كأنها أمواج بحر متلاطمة. لا توجد فيه زاوية حادة واحدة!',
      dotRule: 'الألف: 5 إلى 6 نقاط بقوس هلالي مقلوب. الواو والراء: تلتف بنعومة مع نزول قوسي تحت السطر.',
      dotsCount: 5,
      angleRule: 'زاوية السن: -60°. تتطلب كتابة الديواني مرونة كاملة في المعصم والذراع للتحليق بالحركات الدائرية الصاعدة والهابطة.',
      penRule: 'القلم: قصبة عربي أو فرشاة حرة | حجم السن 20px.',
      mistakes: 'كسر الانحناءات أو جعل الحروف مستقيمة؛ الديواني يكره الاستقامة والجمود ويعشق الليونة والدوران.',
      recommendedPen: 'brush',
      recommendedAngle: -60,
      recommendedSize: 20
    },
    'Reem Kufi': {
      title: 'الخط الكوفي التراثي (أم الخطوط والهندسة الصارمة)',
      school: 'الكوفة في صدر الإسلام - أقدم الخطوط العربية تقعيداً',
      voice: 'الخط الكوفي هو صرح العمارة الإسلامية؛ يقوم على التماثل والتناظر والنسب الهندسية القائمة المستوحاة من المربع والدائرة.',
      dotRule: 'النسبة الهندسية: قائم على الوحدات المربعة 1:1 و1:2؛ ارتفاع الألف يعادل 6 إلى 8 مربعات هندسية.',
      dotsCount: 6,
      angleRule: 'زاوية السن: 0° (أفقي ومستقيم تماماً). استخدام قلم المسطرة والتحبير لضبط الخطوط المتوازية والزوايا القائمة.',
      penRule: 'القلم: قلم المسطرة والتحبير الهندسي (Ruling Pen) | حجم السن 14-18px | بدون تسطير مائل.',
      mistakes: 'الرسم العفوي أو الميلان؛ الكوفي يتطلب دقة معمارية في استقامة الخطوط والزوايا القائمة.',
      recommendedPen: 'ruling',
      recommendedAngle: 0,
      recommendedSize: 16
    },
    'Cairo': {
      title: 'الخط الكوفي الهندسي المعاصر',
      school: 'العمارة والتصميم التيبوغرافي الحديث',
      voice: 'هندسة بصرية صافية تمزج بين روح الكوفي المصحفي والوضوح المعاصر للشاشات والمطبوعات الحديثة.',
      dotRule: 'سماكة متجانسة في كل الحركات الرأسية والأفقية مع زوايا دوران محسوبة بنصف القطر.',
      dotsCount: 4,
      angleRule: 'زاوية السن: 0° أو استخدام قلم التحبير الهندسي.',
      penRule: 'القلم: قلم المسطرة والتحبير الهندسي | حجم السن 16px.',
      mistakes: 'عدم توحيد سماكة القوائم والأفقيات.',
      recommendedPen: 'ruling',
      recommendedAngle: 0,
      recommendedSize: 16
    },
    'Marhey': {
      title: 'الخط الحر المعاصر (Freeform Expressive)',
      school: 'الفن المعاصر والخط التعبيري',
      voice: 'أطلق العنان لطاقتك وإحساسك؛ هذا الخط يحتفي بالعفوية والكتلة والشغف البصري دون قيود هندسية صارمة.',
      dotRule: 'ميزان بصري حر يعتمد على تناسق الكتل والفراغات بدلاً من عدد النقاط التقليدية.',
      dotsCount: 4,
      angleRule: 'زوايا متغيرة بحرية حسب مسار الريشة والضغط الممارس بالقلم.',
      penRule: 'القلم: فرشاة الخط الحر والتحبير المائي (Calligraphy Brush) | حجم السن 24px.',
      mistakes: 'التردد في سحب الضربة؛ الحركات الحرة تحتاج ثقة وسرعة انسيابية.',
      recommendedPen: 'brush',
      recommendedAngle: -45,
      recommendedSize: 24
    },
    'MedievalSharp': {
      title: 'Gothic Blackletter (Textura Quadrata)',
      school: 'European Medieval Manuscripts (12th-15th Century)',
      voice: 'Master the rhythmic "minim" strokes: hold the chisel nib rigidly at 45°. Each vertical stroke should have identical thickness and spacing equal to the nib width.',
      dotRule: 'The vertical minim is measured by diamond-shaped nib serifs at top and bottom (4 to 5 nib widths in height).',
      dotsCount: 5,
      angleRule: 'Nib angle: strictly 45°. Move the whole forearm downward steadily; never twist the nib angle!',
      penRule: 'Recommended Pen: Chisel Reed Qalam or Calligraphy Nib | Size 20px.',
      mistakes: 'Irregular spacing between vertical bars; Blackletter depends entirely on uniform cadence (resembling a picket fence).',
      recommendedPen: 'qalam',
      recommendedAngle: 45,
      recommendedSize: 20
    },
    'Great Vibes': {
      title: 'Copperplate & Engrosser’s Script Flourish',
      school: 'English Roundhand & Master Penmanship (18th Century)',
      voice: 'The secret of Copperplate lies in dynamic tine expansion: upward strokes are zero-pressure hairlines, while downward strokes swell under controlled finger pressure.',
      dotRule: 'Slope line angle: 55°. X-height is 3 to 4 scale units, ascenders and descenders reach 6 to 7 units.',
      dotsCount: 4,
      angleRule: 'Pointed flexible pen. Pressure applied strictly on the downward slant path.',
      penRule: 'Recommended Pen: Flexible Fountain Pen (حبر سائل) | Size 14-16px | English Slant Grid.',
      mistakes: 'Applying pressure on upstrokes (which snags the paper and splatters ink) or inconsistent slant angle.',
      recommendedPen: 'fountain',
      recommendedAngle: 0,
      recommendedSize: 15
    },
    'Alex Brush': {
      title: 'Brush Script Calligraphy',
      school: 'Modern Sign Painting & Brush Lettering',
      voice: 'Flow with the rhythm of the bristles: light pressure for rising loops, assertive pressure for descending stems, producing expressive organic swells.',
      dotRule: 'Dynamic proportion: fluid contrast ratio 1:4 between hairline connectors and stem swells.',
      dotsCount: 4,
      angleRule: 'Held at 45° angle with flexible wrist pivoting.',
      penRule: 'Recommended Pen: Calligraphy Brush (فرشاة حرة) | Size 22px.',
      mistakes: 'Jerky movements or lifting the brush abruptly during transitions.',
      recommendedPen: 'brush',
      recommendedAngle: 0,
      recommendedSize: 22
    },
    'Cinzel Decorative': {
      title: 'Roman Monumental & Imperial Capitals',
      school: 'Trajan Column Architecture (Ancient Rome)',
      voice: 'Geometry of the gods: every Roman capital is built upon perfect squares, circles, and equilateral triangles. Serifs are carved with deliberate lapidary chisel angle.',
      dotRule: 'Height-to-stroke width ratio of 1:10 (the classical Golden Ratio).',
      dotsCount: 6,
      angleRule: 'Chisel nib held at 30° for lapidary bracketed serifs.',
      penRule: 'Recommended Pen: Chisel Qalam or Ruling Pen | Size 18px.',
      mistakes: 'Asymmetric curves or weak corner serifs.',
      recommendedPen: 'qalam',
      recommendedAngle: 30,
      recommendedSize: 18
    }
  },

  letters: {
    'ا': {
      title: 'حرف الألف (أم الحروف وميزان الخط العربي)',
      voice: 'الألف هو أصل الحروف وقوامها ومنه اشتقت سائر الأشكال؛ ابدأ من الأعلى بوضع السن كاملاً، وانزل مستقيماً بنعومة مع ميل يسير لا يكاد يُرى نحو اليسار في القمة.',
      dots: 3,
      dotsDesc: '3 نقاط في الرقعة، 5 نقاط في النسخ، 7 نقاط في الثلث.',
      angle: -45,
      pen: 'qalam'
    },
    'ب': {
      title: 'حرف الباء والتاء والثاء',
      voice: 'بداية الباء هي نصف نقطة مائلة، ثم سحب مستدير يستقر على السطر كأنه زورق هادئ يرسو على الماء، ثم صعود رشيق في الطرف الأخير.',
      dots: 3,
      dotsDesc: 'اتساع الباء 3 نقاط في الرقعة و4 إلى 5 نقاط في النسخ.',
      angle: -45,
      pen: 'qalam'
    },
    'ج': {
      title: 'حرف الجيم والحاء والخاء',
      voice: 'رأس الجيم كأنه موجة ترتفع بمقدار نقطتين، ونصف قطر البطن يدور في نصف دائرة متوازنة تتسع لـ 5 نقاط كاملة وتنزل تحت السطر.',
      dots: 5,
      dotsDesc: 'عمق واستدارة البطن 5 نقاط مع ارتكاز توازني تحت الرأس.',
      angle: -70,
      pen: 'qalam'
    },
    'ن': {
      title: 'حرف النون (ميزان الكؤوس)',
      voice: 'كاسة النون في النسخ هي الاختبار الحقيقي لثقة يد الخطاط؛ تبدأ بحركة عمودية ثم استدارة ناعمة أسفل السطر والارتقاء بطرف السن، مع نقطة تتوسط الفراغ كبؤرة الميزان.',
      dots: 3,
      dotsDesc: 'اتساع الكاسة 3 نقاط وعمقها نقطتان في النسخ؛ وتستقر فوق السطر في الرقعة.',
      angle: -70,
      pen: 'qalam'
    },
    'و': {
      title: 'حرف الواو (انسيابية العنق والذيل)',
      voice: 'استدر برأس الواو مقفلاً كالمثلث الدائري مع تفريغ نقطة بيضاء في قلبه، ثم اسحب العنق بانحدار مائل يشبه ذيل الراء الهابط برقة.',
      dots: 3,
      dotsDesc: 'الرأس نقطة ونصف، والذيل يمتد نقطتين ونصف تحت السطر.',
      angle: -60,
      pen: 'qalam'
    },
    'الله': {
      title: 'لفظ الجلالة "الله"',
      voice: 'أعظم ما خطته أيدي البلغاء؛ الألف شامخة ومستقيمة، واللام الأولى ترتفع بمقدار 4 نقاط، واللام الثانية تنزل عنها قليلاً، والهاء تلف بنعومة مقدسة.',
      dots: 5,
      dotsDesc: 'الألف 5 نقاط، اللام الأولى 4 نقاط، اللام الثانية 3.5 نقاط، والهاء نقطتان.',
      angle: -65,
      pen: 'qalam'
    },
    'بسم الله الرحمن الرحيم': {
      title: 'البسملة الكبرى (تاج الخطاطين)',
      voice: 'ميزان البسملة يجمع أسرار الخط: أسنان السين في "بسم" متدرجة ومحذوفة في الرقعة، وامتداد "الرحمن" يمنح السطر وقاراً وهيبة، وتختم "الرحيم" بميم نازلة متزنة.',
      dots: 5,
      dotsDesc: 'تناغم كلي قائم على ميزان النقط الخماسي للنسخ والثلث.',
      angle: -65,
      pen: 'qalam'
    }
  }
};

function showTeacherHint() {
  const text = (practiceTextInput ? practiceTextInput.value : '').trim();
  const scriptKey = currentFont || 'Aref Ruqaa';
  const scriptInfo = CALLIGRAPHY_KNOWLEDGE_BASE.scripts[scriptKey] || CALLIGRAPHY_KNOWLEDGE_BASE.scripts['Aref Ruqaa'];
  
  let letterInfo = null;
  if (CALLIGRAPHY_KNOWLEDGE_BASE.letters[text]) {
    letterInfo = CALLIGRAPHY_KNOWLEDGE_BASE.letters[text];
  }

  if (teacherScriptSubtitle) {
    teacherScriptSubtitle.textContent = `${scriptInfo.title} | ${scriptInfo.school}`;
  }
  if (teacherVoiceText) {
    teacherVoiceText.textContent = letterInfo ? letterInfo.voice : scriptInfo.voice;
  }
  if (teacherDotRule) {
    teacherDotRule.textContent = letterInfo ? `${letterInfo.title}: ${letterInfo.dotsDesc}` : scriptInfo.dotRule;
  }
  if (teacherAngleRule) {
    teacherAngleRule.textContent = scriptInfo.angleRule;
  }
  if (teacherPenRule) {
    teacherPenRule.textContent = scriptInfo.penRule;
  }
  if (teacherMistakesRule) {
    teacherMistakesRule.textContent = scriptInfo.mistakes;
  }

  if (dotScaleContainer) {
    dotScaleContainer.innerHTML = '';
    const dotsCount = letterInfo ? letterInfo.dots : (scriptInfo.dotsCount || 4);
    for (let i = 1; i <= dotsCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'rhombic-dot';
      dot.setAttribute('data-num', i);
      dotScaleContainer.appendChild(dot);
    }
    const label = document.createElement('span');
    label.style.fontSize = '12px';
    label.style.color = '#78350f';
    label.style.fontWeight = 'bold';
    label.style.marginRight = '8px';
    label.textContent = `← ميزان قياس الحرف (${dotsCount} نقاط معينة)`;
    dotScaleContainer.appendChild(label);
  }

  if (teacherHintModal) {
    teacherHintModal.classList.remove('hidden');
    playSound('tap');
  }
}

if (teacherHintBtn) {
  teacherHintBtn.addEventListener('click', showTeacherHint);
}

if (closeTeacherHintBtn) {
  closeTeacherHintBtn.addEventListener('click', () => {
    if (teacherHintModal) teacherHintModal.classList.add('hidden');
    playSound('tap');
  });
}

if (closeTeacherModalBottomBtn) {
  closeTeacherModalBottomBtn.addEventListener('click', () => {
    if (teacherHintModal) teacherHintModal.classList.add('hidden');
    playSound('tap');
  });
}

if (applyTeacherSettingsBtn) {
  applyTeacherSettingsBtn.addEventListener('click', () => {
    const scriptKey = currentFont || 'Aref Ruqaa';
    const scriptInfo = CALLIGRAPHY_KNOWLEDGE_BASE.scripts[scriptKey] || CALLIGRAPHY_KNOWLEDGE_BASE.scripts['Aref Ruqaa'];
    
    if (scriptInfo.recommendedPen) {
      setPenType(scriptInfo.recommendedPen);
    }
    if (scriptInfo.recommendedAngle !== undefined) {
      nibAngleSlider.value = scriptInfo.recommendedAngle;
      defaultNibAngle = scriptInfo.recommendedAngle * (Math.PI / 180);
      updateAngleDisplay(defaultNibAngle);
    }
    if (scriptInfo.recommendedSize) {
      brushSize.value = scriptInfo.recommendedSize;
      baseSize = scriptInfo.recommendedSize;
    }
    
    if (teacherHintModal) teacherHintModal.classList.add('hidden');
    playSound('star');
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
    setStatusMessage('✨ تم تطبيق ميزان وزاوية وقلم الأستاذ بنجاح!', false);
  });
}

// ==========================================
// 6. Interactive Calligraphy Demonstration Engine
// ==========================================
const DEMO_LETTERS = {
  'ا': {
    letter: 'ا',
    title: 'حرف الألف (خط الرقعة)',
    script: 'خط الرقعة',
    font: 'Aref Ruqaa',
    angle: -45,
    dots: 3,
    dotPositions: [
      { x: 330, y: 70 },
      { x: 330, y: 125 },
      { x: 330, y: 180 }
    ],
    path: [
      { x: 290, y: 60, thickness: 24 },
      { x: 288, y: 85, thickness: 24 },
      { x: 286, y: 115, thickness: 23 },
      { x: 284, y: 145, thickness: 23 },
      { x: 281, y: 175, thickness: 22 },
      { x: 278, y: 200, thickness: 21 },
      { x: 274, y: 225, thickness: 20 }
    ],
    step1: {
      title: 'الترويس وزاوية الارتكاز (-45°)',
      desc: 'وضع سن القصبة بكامل عرضه بزاوية -45° في أعلى اليمين بثبات تام دون تردد.'
    },
    step2: {
      title: 'السحب العمودي الانسيابي',
      desc: 'سحب القلم للأسفل بانحدار يسير نحو اليسار (بمقدار نصف نقطة) مع الحفاظ التام على اتجاه القصبة.'
    },
    step3: {
      title: 'ميزان النقط التناغمي (3 نقاط)',
      desc: 'طول الألف يعادل تماماً 3 نقاط مربعة معينة، واستقرار ناعم على السطر.'
    }
  },
  'ب': {
    letter: 'ب',
    title: 'حرف الباء (خط الرقعة)',
    script: 'خط الرقعة',
    font: 'Aref Ruqaa',
    angle: -45,
    dots: 3,
    dotPositions: [
      { x: 335, y: 230 },
      { x: 295, y: 230 },
      { x: 255, y: 230 }
    ],
    path: [
      { x: 380, y: 145, thickness: 18 },
      { x: 375, y: 165, thickness: 20 },
      { x: 370, y: 185, thickness: 22 },
      { x: 350, y: 195, thickness: 24 },
      { x: 310, y: 197, thickness: 24 },
      { x: 270, y: 195, thickness: 23 },
      { x: 235, y: 188, thickness: 21 },
      { x: 225, y: 170, thickness: 19 },
      { x: 222, y: 152, thickness: 16 }
    ],
    step1: {
      title: 'سنة البداية المائلة',
      desc: 'نزول قصير يشبه النقطة بالسن المشطوف بزاوية -45° بارتفاع نقطة واحدة.'
    },
    step2: {
      title: 'جسم الباء المستقيم',
      desc: 'سحب مستقيم باتجاه اليسار يرتكز على السطر ويصل اتساعه إلى 3 نقاط كاملة.'
    },
    step3: {
      title: 'سنة النهاية والارتفاع',
      desc: 'صعود يسير برأس القلم للأعلى لإنهاء الحرف برشاقة واستقرار.'
    }
  },
  'ج': {
    letter: 'ج',
    title: 'حرف الجيم والحاء (خط النسخ)',
    script: 'خط النسخ التراثي',
    font: 'Amiri',
    angle: -70,
    dots: 5,
    dotPositions: [
      { x: 300, y: 140 },
      { x: 300, y: 175 },
      { x: 300, y: 210 },
      { x: 270, y: 175 },
      { x: 330, y: 175 }
    ],
    path: [
      { x: 310, y: 95, thickness: 14 },
      { x: 335, y: 90, thickness: 20 },
      { x: 365, y: 92, thickness: 22 },
      { x: 385, y: 98, thickness: 18 },
      { x: 360, y: 115, thickness: 22 },
      { x: 330, y: 135, thickness: 25 },
      { x: 335, y: 165, thickness: 26 },
      { x: 350, y: 200, thickness: 25 },
      { x: 330, y: 230, thickness: 23 },
      { x: 290, y: 242, thickness: 21 },
      { x: 250, y: 230, thickness: 18 },
      { x: 225, y: 205, thickness: 14 }
    ],
    step1: {
      title: 'حاجب الجيم التموجي',
      desc: 'حركة أفقية متموجة تبدأ بنحافة وتتسع بالنزول ثم ترتفع قليلاً باتساع نقطتين.'
    },
    step2: {
      title: 'الرجوع والانعطاف المحكم',
      desc: 'الرجوع على الثلث الأخير من الحاجب بضغط متزن وميلان نحو اليسار.'
    },
    step3: {
      title: 'بطن الجيم ونصف الدائرة',
      desc: 'استدارة نصف دائرية واسعة تتسع لـ 5 نقاط في تجويفها وتستقر تحت السطر.'
    }
  },
  'د': {
    letter: 'د',
    title: 'حرف الدال (خط الرقعة)',
    script: 'خط الرقعة',
    font: 'Aref Ruqaa',
    angle: -45,
    dots: 2,
    dotPositions: [
      { x: 320, y: 155 },
      { x: 280, y: 195 }
    ],
    path: [
      { x: 320, y: 130, thickness: 20 },
      { x: 310, y: 150, thickness: 22 },
      { x: 300, y: 170, thickness: 23 },
      { x: 280, y: 178, thickness: 24 },
      { x: 255, y: 180, thickness: 22 },
      { x: 235, y: 178, thickness: 18 }
    ],
    step1: {
      title: 'نزول الضلع الأول',
      desc: 'نزول مائل بزاوية -45° بطول نقطتين ونصف مع ميلان خفيف نحو اليسار.'
    },
    step2: {
      title: 'مفصل الانعطاف',
      desc: 'ارتكاز ثابت لسن القلم عند ملامسة السطر للتحضير لحركة القاعدة.'
    },
    step3: {
      title: 'قاعدة الدال الأفقية',
      desc: 'امتداد أفقي على السطر بطول نقطتين ينتهي بنحافة يسيرة كسن القلم.'
    }
  },
  'ر': {
    letter: 'ر',
    title: 'حرف الراء (خط الرقعة)',
    script: 'خط الرقعة',
    font: 'Aref Ruqaa',
    angle: -45,
    dots: 2,
    dotPositions: [
      { x: 310, y: 165 },
      { x: 285, y: 190 }
    ],
    path: [
      { x: 320, y: 145, thickness: 22 },
      { x: 305, y: 162, thickness: 22 },
      { x: 288, y: 180, thickness: 20 },
      { x: 270, y: 195, thickness: 16 },
      { x: 252, y: 204, thickness: 10 }
    ],
    step1: {
      title: 'وضع السن المشطوف',
      desc: 'البداية بوضع السن بكامل عرضه بزاوية -45° فوق السطر بنقطتين.'
    },
    step2: {
      title: 'السحب الخاطف (الشظية)',
      desc: 'سحب مائل متسارع نحو الأسفل واليسار مع تخفيف الضغط تدريجياً.'
    },
    step3: {
      title: 'الذيل المستدق',
      desc: 'إنهاء الراء برأس دقيق حاد كالإبرة يرتكز بنعومة على السطر.'
    }
  },
  'س': {
    letter: 'س',
    title: 'حرف السين (خط النسخ)',
    script: 'خط النسخ التراثي',
    font: 'Amiri',
    angle: -70,
    dots: 3,
    dotPositions: [
      { x: 360, y: 135 },
      { x: 335, y: 135 },
      { x: 265, y: 195 }
    ],
    path: [
      { x: 380, y: 130, thickness: 16 },
      { x: 375, y: 148, thickness: 18 },
      { x: 365, y: 152, thickness: 19 },
      { x: 355, y: 135, thickness: 17 },
      { x: 348, y: 150, thickness: 19 },
      { x: 332, y: 153, thickness: 20 },
      { x: 325, y: 135, thickness: 18 },
      { x: 320, y: 160, thickness: 22 },
      { x: 305, y: 200, thickness: 24 },
      { x: 275, y: 220, thickness: 23 },
      { x: 245, y: 205, thickness: 20 },
      { x: 230, y: 175, thickness: 15 }
    ],
    step1: {
      title: 'أسنان السين المتدرجة',
      desc: 'السن الأول نقطة، الثاني نقطة ونصف، والمسافة بينهما متدرجة باتزان.'
    },
    step2: {
      title: 'نزول كاسة النون',
      desc: 'السن الثالثة تهبط تحت السطر لتشكل حوض الكاسة الدائري بعمق نقطتين.'
    },
    step3: {
      title: 'صعود الكاسة المستدق',
      desc: 'الصعود باتجاه اليمين بنحافة رشيقة تقابل مستوى السن الأولى.'
    }
  },
  'ن': {
    letter: 'ن',
    title: 'حرف النون وكاستها (خط النسخ)',
    script: 'خط النسخ التراثي',
    font: 'Amiri',
    angle: -70,
    dots: 3,
    dotPositions: [
      { x: 295, y: 165 },
      { x: 335, y: 175 },
      { x: 255, y: 175 }
    ],
    path: [
      { x: 350, y: 135, thickness: 18 },
      { x: 345, y: 160, thickness: 22 },
      { x: 335, y: 190, thickness: 24 },
      { x: 310, y: 220, thickness: 25 },
      { x: 275, y: 225, thickness: 24 },
      { x: 248, y: 200, thickness: 20 },
      { x: 235, y: 165, thickness: 15 }
    ],
    step1: {
      title: 'سنة البداية الترويسية',
      desc: 'نزول مائل قصير بنصف نقطة بزاوية -70° يمثل مدخل الكاسة.'
    },
    step2: {
      title: 'دوران قاع الكاسة',
      desc: 'استدارة نصف دائرية كاملة متزنة تهبط تحت السطر بمقدار نقطتين.'
    },
    step3: {
      title: 'نقطة الميزان المركزية',
      desc: 'استقرار النقطة المعيّنة في منتصف اتساع الكاسة تماماً لتحقيق التوازن.'
    }
  },
  'و': {
    letter: 'و',
    title: 'حرف الواو (الخط الديواني)',
    script: 'الخط الديواني',
    font: 'Rakkas',
    angle: -60,
    dots: 3,
    dotPositions: [
      { x: 325, y: 130 },
      { x: 290, y: 180 },
      { x: 260, y: 210 }
    ],
    path: [
      { x: 320, y: 135, thickness: 16 },
      { x: 345, y: 120, thickness: 20 },
      { x: 360, y: 135, thickness: 22 },
      { x: 348, y: 155, thickness: 22 },
      { x: 325, y: 162, thickness: 21 },
      { x: 300, y: 180, thickness: 22 },
      { x: 275, y: 205, thickness: 20 },
      { x: 245, y: 225, thickness: 16 },
      { x: 220, y: 235, thickness: 10 }
    ],
    step1: {
      title: 'استدارة رأس الواو',
      desc: 'دوران مغلق ممتلئ يشبه رأس الفاء بارتفاع نقطة ونصف.'
    },
    step2: {
      title: 'انحدار العنق الانسيابي',
      desc: 'انزلاق متصل وسريع من العنق بزاوية -60° ديوانية فخمة.'
    },
    step3: {
      title: 'ذيل الواو الطائر',
      desc: 'امتداد مقوس ينتهي برأس كحد السيف على السطر بانسيابية ملكية.'
    }
  },
  'الله': {
    letter: 'الله',
    title: 'لفظ الجلالة "الله" (النسخ القرآني)',
    script: 'خط النسخ القرآني',
    font: 'Scheherazade New',
    angle: -65,
    dots: 5,
    dotPositions: [
      { x: 420, y: 90 },
      { x: 420, y: 140 },
      { x: 420, y: 190 },
      { x: 360, y: 130 },
      { x: 290, y: 150 }
    ],
    path: [
      { x: 400, y: 70, thickness: 22 },
      { x: 396, y: 120, thickness: 22 },
      { x: 392, y: 170, thickness: 21 },
      { x: 388, y: 210, thickness: 20 },
      { x: 355, y: 95, thickness: 21 },
      { x: 352, y: 150, thickness: 21 },
      { x: 345, y: 210, thickness: 22 },
      { x: 325, y: 212, thickness: 23 },
      { x: 318, y: 120, thickness: 20 },
      { x: 314, y: 170, thickness: 20 },
      { x: 308, y: 212, thickness: 22 },
      { x: 285, y: 212, thickness: 22 },
      { x: 280, y: 165, thickness: 19 },
      { x: 265, y: 155, thickness: 20 },
      { x: 250, y: 180, thickness: 19 },
      { x: 260, y: 210, thickness: 18 }
    ],
    step1: {
      title: 'الميزان الذهبي لألف الجلالة',
      desc: 'ألف مستقيمة بطول 5 نقاط مع ترويس نسخ قرآني كلاسيكي مهيب.'
    },
    step2: {
      title: 'تدرج اللامات المترادفة',
      desc: 'اللام الأولى أطول من الثانية بنصف نقطة، والاتصال بينهما بقاعدة مستوية.'
    },
    step3: {
      title: 'هاء الختام التوازنية',
      desc: 'صعود الهاء بارتفاع نقطتين واستدارة فوهتها بإحكام روحي متناهٍ.'
    }
  },
  'سلام': {
    letter: 'سلام',
    title: 'تركيب كلمة "سلام" (خط الرقعة)',
    script: 'خط الرقعة',
    font: 'Aref Ruqaa',
    angle: -45,
    dots: 5,
    dotPositions: [
      { x: 380, y: 130 },
      { x: 320, y: 80 },
      { x: 320, y: 130 },
      { x: 260, y: 210 }
    ],
    path: [
      { x: 420, y: 140, thickness: 18 },
      { x: 405, y: 148, thickness: 19 },
      { x: 385, y: 148, thickness: 20 },
      { x: 360, y: 150, thickness: 22 },
      { x: 345, y: 80, thickness: 22 },
      { x: 342, y: 130, thickness: 22 },
      { x: 338, y: 175, thickness: 22 },
      { x: 310, y: 175, thickness: 21 },
      { x: 290, y: 170, thickness: 20 },
      { x: 275, y: 185, thickness: 21 },
      { x: 270, y: 215, thickness: 20 },
      { x: 268, y: 245, thickness: 16 }
    ],
    step1: {
      title: 'أسنان السين بدون نبرات',
      desc: 'في الرقعة تأتي السين مستقيمة مائلة كالشريط الصغير بدون أسنان بارزة.'
    },
    step2: {
      title: 'صعود اللام ألف المترابط',
      desc: 'صعود مستقيم بزاوية قائمة مع ارتكاز على السطر.'
    },
    step3: {
      title: 'ميم الرقعة المطموسة والنزول',
      desc: 'رأس ميم نقطي مطموس ثم نزول رأسي مستقيم تحت السطر بطول 3 نقاط.'
    }
  }
};

let currentDemo = DEMO_LETTERS['ا'];
let demoAnimId = null;
let demoProgress = 0;
let demoIsPlaying = true;
let demoSpeed = 1.0;

function drawDemoRhombicDot(ctx, cx, cy, size = 16, num = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 4);
  const half = size / 2;
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(-half, -half, size, size);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Number badge
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num, cx, cy);
  ctx.restore();
}

function renderDemoGuidelines(ctx, w, h) {
  ctx.save();
  // Clear background
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, w, h);

  // Background subtle grid
  ctx.strokeStyle = '#f1eee7';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Classical Calligraphy Guidelines
  // 1. Ascender Line
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(40, 70); ctx.lineTo(w - 40, 70); ctx.stroke();

  // 2. Baseline (سطر الأساس)
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(40, 190); ctx.lineTo(w - 40, 190); ctx.stroke();

  // 3. Descender Line
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(40, 245); ctx.lineTo(w - 40, 245); ctx.stroke();

  // Text labels on guidelines
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px system-ui';
  ctx.textAlign = 'right';
  ctx.fillText('خط الرأس (الألف)', w - 45, 65);
  ctx.fillStyle = '#3b82f6';
  ctx.fillText('سطر الأساس ──', w - 45, 185);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('خط القاع والكاسات', w - 45, 240);

  ctx.restore();
}

function updateDemoStepCards(t) {
  if (!demoStep1 || !demoStep2 || !demoStep3) return;
  demoStep1.classList.toggle('active', t < 0.35);
  demoStep2.classList.toggle('active', t >= 0.35 && t < 0.75);
  demoStep3.classList.toggle('active', t >= 0.75);
}

function renderDemoFrame() {
  if (!demoCtx || !demoCanvas) return;
  const w = demoCanvas.width;
  const h = demoCanvas.height;

  renderDemoGuidelines(demoCtx, w, h);

  const pts = currentDemo.path;
  const totalSegments = pts.length - 1;
  const clampedProgress = Math.min(1.0, demoProgress);
  const activeCount = Math.max(1, Math.floor(clampedProgress * totalSegments) + 1);

  // Draw current path progress using Chisel Ribbon geometry
  const angleRad = currentDemo.angle * (Math.PI / 180);
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  demoCtx.save();
  demoCtx.fillStyle = '#0f172a';

  // Starting nib cap
  if (pts.length > 0) {
    drawNibCap(demoCtx, pts[0].x, pts[0].y, angleRad, pts[0].thickness, 0.05, '#0f172a');
  }

  for (let i = 1; i < activeCount && i < pts.length; i++) {
    const pPrev = pts[i - 1];
    const pCurr = pts[i];

    const hPrev = pPrev.thickness / 2;
    const hCurr = pCurr.thickness / 2;
    const uxP = hPrev * cosA;
    const uyP = hPrev * sinA;
    const uxC = hCurr * cosA;
    const uyC = hCurr * sinA;

    demoCtx.beginPath();
    demoCtx.moveTo(pPrev.x - uxP, pPrev.y - uyP);
    demoCtx.lineTo(pPrev.x + uxP, pPrev.y + uyP);
    demoCtx.lineTo(pCurr.x + uxC, pCurr.y + uyC);
    demoCtx.lineTo(pCurr.x - uxC, pCurr.y - uyC);
    demoCtx.closePath();
    demoCtx.fill();
  }

  // Ending nib cap if completed
  if (clampedProgress >= 1.0 && pts.length > 1) {
    const last = pts[pts.length - 1];
    drawNibCap(demoCtx, last.x, last.y, angleRad, last.thickness, 0.05, '#0f172a');
  }
  demoCtx.restore();

  // Position animated virtual chisel nib cursor
  const currIdx = Math.min(pts.length - 1, activeCount - 1);
  const currentPt = pts[currIdx];
  if (demoNibCursor && currentPt) {
    const pctX = (currentPt.x / w) * 100;
    const pctY = (currentPt.y / h) * 100;
    demoNibCursor.style.left = `${pctX}%`;
    demoNibCursor.style.top = `${pctY}%`;
    if (demoNibBlade) demoNibBlade.style.transform = `rotate(${currentDemo.angle}deg)`;
    if (demoNibAngleTag) demoNibAngleTag.textContent = `${currentDemo.angle}°`;
    demoNibCursor.style.display = clampedProgress < 1.0 ? 'flex' : 'none';
  }

  // Draw dropped Ibn Muqlah Rhombic Dots when t >= 0.75
  if (demoProgress >= 0.70 && currentDemo.dotPositions) {
    const dotsToShow = Math.min(
      currentDemo.dotPositions.length,
      Math.floor(((demoProgress - 0.70) / 0.30) * currentDemo.dotPositions.length) + 1
    );
    for (let d = 0; d < dotsToShow && d < currentDemo.dotPositions.length; d++) {
      const pos = currentDemo.dotPositions[d];
      drawDemoRhombicDot(demoCtx, pos.x, pos.y, 16, d + 1);
    }
  }

  updateDemoStepCards(clampedProgress);

  // Advance animation
  if (demoIsPlaying) {
    demoProgress += 0.007 * demoSpeed;
    if (demoProgress > 1.4) {
      demoProgress = 0; // seamless replay loop
    }
  }

  demoAnimId = requestAnimationFrame(renderDemoFrame);
}

function startInteractiveDemo(letterKey) {
  if (demoAnimId) cancelAnimationFrame(demoAnimId);
  currentDemo = DEMO_LETTERS[letterKey] || DEMO_LETTERS['ا'];

  if (demoLetterTitle) demoLetterTitle.textContent = currentDemo.title;
  if (demoScriptDesc) demoScriptDesc.textContent = `قواعد ${currentDemo.script} بزاوية سن ${currentDemo.angle}° وميزان ${currentDemo.dots} نقاط`;

  if (demoStep1Title) demoStep1Title.textContent = currentDemo.step1.title;
  if (demoStep1Desc) demoStep1Desc.textContent = currentDemo.step1.desc;
  if (demoStep2Title) demoStep2Title.textContent = currentDemo.step2.title;
  if (demoStep2Desc) demoStep2Desc.textContent = currentDemo.step2.desc;
  if (demoStep3Title) demoStep3Title.textContent = currentDemo.step3.title;
  if (demoStep3Desc) demoStep3Desc.textContent = currentDemo.step3.desc;

  // Populate demo letter chips
  if (demoChipsRow) {
    demoChipsRow.innerHTML = '';
    Object.keys(DEMO_LETTERS).forEach(key => {
      const btn = document.createElement('button');
      btn.className = `demo-chip ${key === currentDemo.letter ? 'active' : ''}`;
      btn.textContent = DEMO_LETTERS[key].title.split(' ')[1] || key;
      btn.addEventListener('click', () => {
        startInteractiveDemo(key);
        playSound('tap');
      });
      demoChipsRow.appendChild(btn);
    });
  }

  demoProgress = 0;
  demoIsPlaying = true;
  if (demoPlayPauseBtn) demoPlayPauseBtn.textContent = '⏸️ إيقاف مؤقت';

  if (interactiveDemoModal) {
    interactiveDemoModal.classList.remove('hidden');
  }

  demoAnimId = requestAnimationFrame(renderDemoFrame);
  playSound('tap');
}

function openInteractiveDemo() {
  const text = (practiceTextInput ? practiceTextInput.value : '').trim();
  const matchedKey = Object.keys(DEMO_LETTERS).find(k => k === text) || 'ا';
  startInteractiveDemo(matchedKey);
}

if (interactiveDemoBtn) {
  interactiveDemoBtn.addEventListener('click', openInteractiveDemo);
}

if (closeInteractiveDemoBtn) {
  closeInteractiveDemoBtn.addEventListener('click', () => {
    if (demoAnimId) cancelAnimationFrame(demoAnimId);
    if (interactiveDemoModal) interactiveDemoModal.classList.add('hidden');
    playSound('tap');
  });
}

if (demoPlayPauseBtn) {
  demoPlayPauseBtn.addEventListener('click', () => {
    demoIsPlaying = !demoIsPlaying;
    demoPlayPauseBtn.textContent = demoIsPlaying ? '⏸️ إيقاف مؤقت' : '▶️ تشغيل';
    playSound('tap');
  });
}

if (demoReplayBtn) {
  demoReplayBtn.addEventListener('click', () => {
    demoProgress = 0;
    demoIsPlaying = true;
    if (demoPlayPauseBtn) demoPlayPauseBtn.textContent = '⏸️ إيقاف مؤقت';
    playSound('tap');
  });
}

document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    demoSpeed = parseFloat(btn.dataset.speed) || 1.0;
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.toggle('active', b === btn));
    playSound('tap');
  });
});

if (demoPracticeNowBtn) {
  demoPracticeNowBtn.addEventListener('click', () => {
    if (demoAnimId) cancelAnimationFrame(demoAnimId);
    if (interactiveDemoModal) interactiveDemoModal.classList.add('hidden');

    practiceTextInput.value = currentDemo.letter;
    currentFont = currentDemo.font;
    defaultNibAngle = currentDemo.angle * (Math.PI / 180);
    if (nibAngleSlider) nibAngleSlider.value = currentDemo.angle;
    updateAngleDisplay(defaultNibAngle);

    if (activeScriptLabel) activeScriptLabel.textContent = currentDemo.script;
    setPenType('qalam');

    // Update ghost template layout
    strokes = [];
    undoneStrokes = [];
    currentStroke = null;
    redrawAllStrokes();
    invalidateScore();
    updateTemplateLayout();
    drawGrid();

    fitView();
    playSound('star');
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
    setStatusMessage(`✍️ تم تحميل نموذج "${currentDemo.title}" للتدريب التفاعلي!`, false);
  });
}

function interruptGestures() {
  if (activePointerId !== null) {
    try { workspace.releasePointerCapture(activePointerId); } catch(e){}
  }
  if (isDrawing && currentStroke && currentStroke.points.length > 0) {
    renderStrokeToContext(dCtx, currentStroke);
  }
  aCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  isDrawing = false;
  activePointerId = null;
  activePointerType = null;
  activeIsStylus = false;
  pointerCache = [];
  initialPinchDist = null;
  pinchLogicalMidpoint = null;
  currentStroke = null;
  lastPt = null;
}

function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;
  const currentDprW = WORLD_WIDTH * dpr;
  
  if (drawingCanvas.width !== currentDprW) {
    [drawingCanvas, activeCanvas, templateCanvas, gridCanvas, heatmapCanvas].forEach(canvas => {
      canvas.width = WORLD_WIDTH * dpr;
      canvas.height = WORLD_HEIGHT * dpr;
    });
    dCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    aCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawGrid();
    renderTemplate();
    redrawAllStrokes();
  }
  fitView();
}

let resizeTimeout;
function handleGeometryChange() {
  interruptGestures();
  
  if (window.visualViewport) {
    document.getElementById('layout-root').style.height = window.visualViewport.height + 'px';
  }

  if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
  resizeTimeout = requestAnimationFrame(() => {
    resizeCanvases();
    invalidateScore();
    resizeTimeout = null;
  });
}

const resizeObserver = new ResizeObserver(handleGeometryChange);
resizeObserver.observe(workspace);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', handleGeometryChange);
}

function updateAngleDisplay(angle) {
  const deg = Math.round(angle * 180 / Math.PI);
  const newAngleStr = `${deg}°`;
  if (angleDisplay && angleDisplay.innerText !== newAngleStr) {
    angleDisplay.innerText = newAngleStr;
  }
  if (nibAngleSlider && parseInt(nibAngleSlider.value) !== deg) {
    nibAngleSlider.value = deg;
  }
}

function drawGrid() {
  gCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  const type = gridSelect.value;
  if (type === 'none') return;
  gCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  gCtx.lineWidth = 1;
  const cy = WORLD_HEIGHT / 2;
  const w = WORLD_WIDTH;
  const h = WORLD_HEIGHT;
  gCtx.beginPath();
  gCtx.moveTo(0, cy + 50);
  gCtx.lineTo(w, cy + 50);
  if (type === 'ruqaa') {
    for(let x = 0; x < w; x+= 100) {
      gCtx.moveTo(x, cy + 50);
      gCtx.lineTo(x - 50, cy - 100);
    }
  } else if (type === 'naskh') {
    gCtx.moveTo(0, cy - 80); gCtx.lineTo(w, cy - 80);
    gCtx.moveTo(0, cy + 120); gCtx.lineTo(w, cy + 120);
  } else if (type === 'english') {
    gCtx.moveTo(0, cy - 50); gCtx.lineTo(w, cy - 50);
    gCtx.moveTo(0, cy - 150); gCtx.lineTo(w, cy - 150);
    for(let x = -h; x < w * 2; x+= 60) {
      gCtx.moveTo(x, h);
      gCtx.lineTo(x + h * Math.tan(35 * Math.PI/180), 0);
    }
  }
  gCtx.stroke();
}

async function measureAndLayoutText(text, fontName, maxFont, width, height, direction) {
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');
  offCtx.direction = direction;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'alphabetic';
  
  const maxHalfW = (width / 2) - MARGIN;
  const maxH = height - MARGIN * 2;
  
  let fontSize = maxFont;
  let layout = null;
  
  while(fontSize >= 10) {
    offCtx.font = `${fontSize}px "${fontName}"`;
    const paragraphs = text.split('\n');
    let lines = [];
    let willFit = true;
    
    for (let p of paragraphs) {
      if (p.trim() === '') {
        lines.push('');
        continue;
      }
      const words = p.split(' ');
      let currentLine = words[0];
      let lineMetrics = offCtx.measureText(currentLine);
      
      if (lineMetrics.actualBoundingBoxLeft > maxHalfW || lineMetrics.actualBoundingBoxRight > maxHalfW) {
        willFit = false;
        break;
      }
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;
        const metrics = offCtx.measureText(testLine);
        
        if (metrics.actualBoundingBoxLeft > maxHalfW || metrics.actualBoundingBoxRight > maxHalfW) {
          lines.push(currentLine);
          currentLine = word;
          const wordMetrics = offCtx.measureText(word);
          if (wordMetrics.actualBoundingBoxLeft > maxHalfW || wordMetrics.actualBoundingBoxRight > maxHalfW) {
            willFit = false;
            break;
          }
        } else {
          currentLine = testLine;
        }
      }
      
      if (!willFit) break;
      lines.push(currentLine);
    }
    
    if (!willFit) {
      fontSize -= 5;
      continue;
    }
    
    let blockMetrics = [];
    let totalBlockHeight = 0;
    
    for (let line of lines) {
      if (line === '') {
        blockMetrics.push({ text: line, metrics: null, height: fontSize });
        totalBlockHeight += fontSize + fontSize * 0.2;
      } else {
        const m = offCtx.measureText(line);
        const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        blockMetrics.push({ text: line, metrics: m, height: h });
        totalBlockHeight += h + fontSize * 0.2;
      }
    }
    
    if (totalBlockHeight > maxH) {
      fontSize -= 5;
      continue;
    }
    
    let startY = (height - totalBlockHeight) / 2;
    layout = {
      ready: true,
      version: ++layoutVersion,
      font: fontName,
      fontSize: fontSize,
      direction: direction,
      textAlign: 'center',
      textBaseline: 'alphabetic',
      lines: [],
      worldWidth: width,
      worldHeight: height,
      contentBounds: { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity }
    };
    
    let y = startY;
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      const metricsInfo = blockMetrics[i];
      
      if (lineText === '') {
        y += metricsInfo.height + fontSize * 0.2;
        continue;
      }
      const m = metricsInfo.metrics;
      y += m.actualBoundingBoxAscent;
      
      const lineX = width / 2;
      const lineY = y;
      const boundLeft = lineX - m.actualBoundingBoxLeft;
      const boundRight = lineX + m.actualBoundingBoxRight;
      const boundTop = lineY - m.actualBoundingBoxAscent;
      const boundBottom = lineY + m.actualBoundingBoxDescent;
      
      layout.contentBounds.left = Math.min(layout.contentBounds.left, boundLeft);
      layout.contentBounds.right = Math.max(layout.contentBounds.right, boundRight);
      layout.contentBounds.top = Math.min(layout.contentBounds.top, boundTop);
      layout.contentBounds.bottom = Math.max(layout.contentBounds.bottom, boundBottom);
      
      layout.lines.push({
        text: lineText,
        x: lineX,
        y: lineY,
        bounds: { left: boundLeft, right: boundRight, top: boundTop, bottom: boundBottom }
      });
      
      y += m.actualBoundingBoxDescent + fontSize * 0.2;
    }
    break;
  }
  
  if (!layout) {
    throw new Error("Text too long to fit");
  }
  return layout;
}

function setStatusMessage(msg, isError = false) {
  if (msg) {
    statusMessage.innerText = msg;
    statusMessage.style.display = 'block';
    statusMessage.style.color = isError ? '#d32f2f' : '#1976d2';
  } else {
    statusMessage.style.display = 'none';
  }
}

function restoreLastValidState() {
  if (lastValidState) {
    practiceTextInput.value = lastValidState.text;
    practiceTextInput.dir = lastValidState.direction;
    currentFont = lastValidState.font;
    
    isEnglishFlex = lastValidState.isEnglishFlex;
    defaultNibAngle = lastValidState.defaultNibAngle;
    gridSelect.value = lastValidState.gridValue;
    currentActiveButtonIndex = lastValidState.activeButtonIndex;
    
    templateBtns.forEach((b, i) => {
      if (i === currentActiveButtonIndex) b.classList.add('active');
      else b.classList.remove('active');
    });
    
    updateAngleDisplay(isEnglishFlex ? 45 * (Math.PI / 180) : defaultNibAngle);
    drawGrid();

    if (lastValidState.layout) {
      templateLayout = JSON.parse(JSON.stringify(lastValidState.layout));
      templateCanvas.setAttribute('data-layout-ready', 'true');
      templateCanvas.setAttribute('data-layout-version', templateLayout.version.toString());
      renderTemplate();
      scoreBtn.disabled = false;
      scoreBtn.title = "التطابق الحراري";
    } else {
      // Intentional blank state
      templateLayout = {
        ready: false,
        version: ++layoutVersion,
        font: currentFont,
        fontSize: 0,
        direction: practiceTextInput.dir,
        textAlign: 'center',
        textBaseline: 'alphabetic',
        lines: [],
        worldWidth: WORLD_WIDTH,
        worldHeight: WORLD_HEIGHT,
        contentBounds: { left: 0, right: 0, top: 0, bottom: 0 }
      };
      templateCanvas.setAttribute('data-layout-ready', 'false');
      tCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      scoringImageData = null;
      scoreBtn.disabled = true;
      scoreBtn.title = "التقييم معطل (النص فارغ)";
    }
  } else {
    templateLayout = {
      ready: false,
      version: ++layoutVersion,
      font: currentFont,
      fontSize: 0,
      direction: practiceTextInput.dir || (isEnglishFlex ? 'ltr' : 'rtl'),
      textAlign: 'center',
      textBaseline: 'alphabetic',
      lines: [],
      worldWidth: WORLD_WIDTH,
      worldHeight: WORLD_HEIGHT,
      contentBounds: { left: 0, right: 0, top: 0, bottom: 0 }
    };
    templateCanvas.setAttribute('data-layout-ready', 'false');
    tCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    scoringImageData = null;
    setStatusMessage('لا يوجد مرجع متاح. (التقييم معطل)', true);
    scoreBtn.disabled = true;
    scoreBtn.title = "التقييم معطل (لا يوجد مرجع)";
  }
}

async function updateTemplateLayout() {
  const currentId = ++templateDrawId;
  const reqDir = practiceTextInput.dir || (isEnglishFlex ? 'ltr' : 'rtl');
  const reqText = practiceTextInput.value;
  const reqFont = currentFont;
  
  templateLayout.ready = false;
  templateCanvas.setAttribute('data-layout-ready', 'false');
  invalidateScore();
  setStatusMessage('جاري التحميل...');
  scoreBtn.disabled = true;
  scoreBtn.title = "جاري التحميل...";

  if (reqText.trim() === '') {
    tCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    // Explicit blank non-exercise state. Keep valid UI baseline but no readiness/raster.
    scoringImageData = null;
    setStatusMessage('النص فارغ. (التقييم معطل)');
    scoreBtn.title = "التقييم معطل (النص فارغ)";
    
    templateLayout = {
      ready: false,
      version: ++layoutVersion,
      font: reqFont,
      fontSize: 0,
      direction: reqDir,
      textAlign: 'center',
      textBaseline: 'alphabetic',
      lines: [],
      worldWidth: WORLD_WIDTH,
      worldHeight: WORLD_HEIGHT,
      contentBounds: { left: 0, right: 0, top: 0, bottom: 0 }
    };
    
    lastValidState = { 
      text: reqText, 
      font: reqFont, 
      direction: reqDir, 
      layout: null,
      activeButtonIndex: currentActiveButtonIndex,
      isEnglishFlex: isEnglishFlex,
      defaultNibAngle: defaultNibAngle,
      gridValue: gridSelect.value
    };
    return;
  }

  if (reqText.length > TEXT_LIMIT) {
    if (currentId !== templateDrawId) return;
    setStatusMessage('النص طويل جداً.', true);
    restoreLastValidState();
    return;
  }
  
  const fontStrMax = `${MAX_FONT}px "${reqFont}"`;
  
  try {
    if (document.fonts) {
      await document.fonts.load(fontStrMax);
      if (currentId !== templateDrawId) return;
      if (!document.fonts.check(fontStrMax)) {
        throw new Error("Font not loaded");
      }
    }
  } catch(e) {
    if (currentId !== templateDrawId) return;
    setStatusMessage('تعذر تحميل الخط المطلوب.', true);
    restoreLastValidState();
    return;
  }
  
  if (currentId !== templateDrawId) return;

  try {
    const layout = await measureAndLayoutText(reqText, reqFont, MAX_FONT, WORLD_WIDTH, WORLD_HEIGHT, reqDir);
    if (currentId !== templateDrawId) return;
    
    templateLayout = layout;
    lastValidState = { 
      text: reqText, 
      font: reqFont, 
      direction: reqDir, 
      layout: JSON.parse(JSON.stringify(layout)),
      activeButtonIndex: currentActiveButtonIndex,
      isEnglishFlex: isEnglishFlex,
      defaultNibAngle: defaultNibAngle,
      gridValue: gridSelect.value
    };
    
    templateCanvas.setAttribute('data-layout-ready', 'true');
    templateCanvas.setAttribute('data-layout-version', layout.version.toString());
    
    renderTemplate();
    setStatusMessage(null); // Clear loading status
    scoreBtn.disabled = false;
    scoreBtn.title = "التطابق الحراري";
  } catch (e) {
    if (currentId !== templateDrawId) return;
    console.error(e);
    setStatusMessage('لا يمكن عرض النص بالكامل في المساحة المتاحة.', true);
    restoreLastValidState();
  }
}

function renderTemplate() {
  tCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  scoringImageData = null;

  if (!templateLayout.ready) return;

  const dpr = window.devicePixelRatio || 1;
  const w = WORLD_WIDTH * dpr;
  const h = WORLD_HEIGHT * dpr;

  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const oCtx = off.getContext('2d', { willReadFrequently: true });
  oCtx.scale(dpr, dpr);

  oCtx.fillStyle = 'black';
  oCtx.textAlign = templateLayout.textAlign;
  oCtx.textBaseline = templateLayout.textBaseline;
  oCtx.direction = templateLayout.direction;
  oCtx.font = `${templateLayout.fontSize}px "${templateLayout.font}"`;
  
  for (let line of templateLayout.lines) {
    oCtx.fillText(line.text, line.x, line.y);
  }

  scoringImageData = oCtx.getImageData(0, 0, w, h);

  const op = ghostOpacityInput.value / 100;
  if (op > 0) {
    tCtx.save();
    tCtx.setTransform(1, 0, 0, 1, 0, 0);
    tCtx.globalAlpha = op;
    tCtx.drawImage(off, 0, 0);
    tCtx.restore();
  }
}

let workspaceRect = workspace.getBoundingClientRect();
function updateWorkspaceRect() {
  workspaceRect = workspace.getBoundingClientRect();
}
window.addEventListener('resize', updateWorkspaceRect);
window.addEventListener('scroll', updateWorkspaceRect, { passive: true });

function getPointerPos(e) {
  const ex = e.clientX - workspaceRect.left;
  const ey = e.clientY - workspaceRect.top;
  return {
    x: (ex - translateX) / scale,
    y: (ey - translateY) / scale
  };
}

function drawEllipse(ctx, x, y, angle, thickness, color, ratio) {
  ctx.fillStyle = color;
  ctx.beginPath();
  const rx = Math.max(thickness / 2, 0.5);
  const ry = Math.max(thickness * ratio, 0.5);
  ctx.ellipse(x, y, rx, ry, angle, 0, 2 * Math.PI);
  ctx.fill();
}

function lerp(a, b, t) { return a + (b - a) * t; }

function lerpAngle(a, b, t) {
  let delta = b - a;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  return a + delta * t;
}

// Stylus & Performance Metrics Tracker
const metrics = {
  totalPoints: 0,
  coalescedPoints: 0,
  minPressure: 1.0,
  maxPressure: 0.0,
  handlerDurations: [],
  pointerTypesSeen: new Set(),
  detectedHardware: {
    penObserved: false,
    pressureVaries: false,
    tiltObserved: false,
    coalescedObserved: false,
    palmRejectionsCount: 0
  },
  startTime: Date.now()
};

function drawNibCap(ctx, x, y, angle, thickness, ratio, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.rotate(angle);
  const rx = Math.max(thickness / 2, 0.5);
  const ry = Math.max(thickness * ratio, 0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

function renderStrokeSegment(ctx, pPrev, pCurr, stroke) {
  const color = stroke.color || '#000000';
  const tool = stroke.tool || 'qalam';
  const ratio = stroke.ratio !== undefined ? stroke.ratio : 0.05;

  if (tool === 'ruling') {
    // 1. Ruling / Technical Drafting Pen: perfectly uniform mechanical line
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke.baseSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pPrev.x, pPrev.y);
    ctx.lineTo(pCurr.x, pCurr.y);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (tool === 'ballpoint') {
    // 2. Ballpoint 0.8mm Biro: pressure modulates line width smoothly without alpha multiplication knots
    const p = pCurr.pressure !== undefined ? pCurr.pressure : 0.5;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.2, (stroke.baseSize * 0.12) + (p * stroke.baseSize * 0.28));
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pPrev.x, pPrev.y);
    ctx.lineTo(pCurr.x, pCurr.y);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (tool === 'pencil') {
    // 3. Graphite Sketching Pencil with M-Pencil Tilt Shading
    const tiltMag = Math.hypot(pCurr.tiltX || 0, pCurr.tiltY || 0);
    const p = pCurr.pressure !== undefined ? pCurr.pressure : 0.5;
    ctx.save();
    if (tiltMag > 22) {
      // Broad side-lead shading: uses butt caps to prevent overlapping dark nodes
      const tiltSpread = Math.min(3.2, 1.0 + (tiltMag - 22) * 0.08);
      ctx.globalAlpha = Math.min(0.65, 0.22 + p * 0.38);
      ctx.strokeStyle = color;
      ctx.lineWidth = stroke.baseSize * tiltSpread;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.moveTo(pPrev.x, pPrev.y);
      ctx.lineTo(pCurr.x, pCurr.y);
      ctx.stroke();
    } else {
      // Fine upright graphite tip: solid sharp contact
      ctx.globalAlpha = 0.92;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.2, (stroke.baseSize * 0.12) + (p * stroke.baseSize * 0.25));
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pPrev.x, pPrev.y);
      ctx.lineTo(pCurr.x, pCurr.y);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  if (tool === 'fountain' || stroke.isEnglishFlex || tool === 'brush') {
    // 4 & 5. Flexible Fountain Pen & Dynamic Calligraphy Brush
    ctx.fillStyle = color;
    const rPrev = Math.max(pPrev.thickness / 2, 0.5);
    const rCurr = Math.max(pCurr.thickness / 2, 0.5);
    const dx = pCurr.x - pPrev.x;
    const dy = pCurr.y - pPrev.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0.01) {
      const nx = -dy / dist;
      const ny = dx / dist;

      ctx.beginPath();
      ctx.moveTo(pPrev.x + nx * rPrev, pPrev.y + ny * rPrev);
      ctx.lineTo(pPrev.x - nx * rPrev, pPrev.y - ny * rPrev);
      ctx.lineTo(pCurr.x - nx * rCurr, pCurr.y - ny * rCurr);
      ctx.lineTo(pCurr.x + nx * rCurr, pCurr.y + ny * rCurr);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  // 6. Classical Chisel Qalam (Arabic Reed Ribbon Geometry)
  // Lightning-fast ribbon polygon rendering without intermediate ellipse churn
  ctx.fillStyle = color;
  const cosPrev = Math.cos(pPrev.angle);
  const sinPrev = Math.sin(pPrev.angle);
  const cosCurr = Math.cos(pCurr.angle);
  const sinCurr = Math.sin(pCurr.angle);

  const halfWPrev = pPrev.thickness / 2;
  const halfWCurr = pCurr.thickness / 2;

  const uxPrev = halfWPrev * cosPrev;
  const uyPrev = halfWPrev * sinPrev;
  const uxCurr = halfWCurr * cosCurr;
  const uyCurr = halfWCurr * sinCurr;

  const dx = pCurr.x - pPrev.x;
  const dy = pCurr.y - pPrev.y;
  if (dx * dx + dy * dy > 0.04) {
    ctx.beginPath();
    ctx.moveTo(pPrev.x - uxPrev, pPrev.y - uyPrev);
    ctx.lineTo(pPrev.x + uxPrev, pPrev.y + uyPrev);
    ctx.lineTo(pCurr.x + uxCurr, pCurr.y + uyCurr);
    ctx.lineTo(pCurr.x - uxCurr, pCurr.y - uyCurr);
    ctx.closePath();
    ctx.fill();
  }
}

function renderStrokeToContext(ctx, stroke) {
  if (!stroke || !stroke.points || stroke.points.length === 0) return;
  const pts = stroke.points;
  const ratio = stroke.ratio !== undefined ? stroke.ratio : 0.05;
  const color = stroke.color || '#000000';
  const tool = stroke.tool || 'qalam';

  if (tool === 'fountain' || tool === 'brush' || stroke.isEnglishFlex) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, Math.max(pts[0].thickness / 2, 0.5), 0, 2 * Math.PI);
    ctx.fill();
  } else if (tool === 'ruling' || tool === 'ballpoint' || tool === 'pencil') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, Math.max(pts[0].thickness / 2, 0.5), 0, 2 * Math.PI);
    ctx.fill();
  } else {
    drawNibCap(ctx, pts[0].x, pts[0].y, pts[0].angle, pts[0].thickness, ratio, color);
  }

  for (let i = 1; i < pts.length; i++) {
    renderStrokeSegment(ctx, pts[i - 1], pts[i], stroke);
  }

  // End cap for chisel qalam
  if (tool === 'qalam' && pts.length > 1) {
    const last = pts[pts.length - 1];
    drawNibCap(ctx, last.x, last.y, last.angle, last.thickness, ratio, color);
  }
}

function redrawAllStrokes() {
  dCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  aCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  for (const stroke of strokes) {
    renderStrokeToContext(dCtx, stroke);
  }
}

function checkIsStylus(e) {
  if (e.pointerType === 'pen' || e.pointerType === 'mouse') return true;
  if (e.pointerType === 'touch') {
    if (e.pressure > 0 && e.pressure !== 0.5) return true;
    if (e.tiltX !== undefined && e.tiltY !== undefined && (e.tiltX !== 0 || e.tiltY !== 0)) return true;
  }
  return false;
}

function checkIsPalm(e) {
  const isPalm = e.pointerType === 'touch' && (
    (e.width !== undefined && e.width >= 40) ||
    (e.height !== undefined && e.height >= 40)
  );
  if (isPalm) {
    metrics.detectedHardware.palmRejectionsCount++;
    if (hudPalmStatus) {
      hudPalmStatus.textContent = 'تم استبعاد كف 🛑 (' + metrics.detectedHardware.palmRejectionsCount + ')';
      hudPalmStatus.className = 'hud-val warn';
      setTimeout(() => {
        if (hudPalmStatus) {
          hudPalmStatus.textContent = 'محمية ✅';
          hudPalmStatus.className = 'hud-val ok';
        }
      }, 1500);
    }
  }
  return isPalm;
}

let lastHudPoint = null;
let instantHz = 120;
let instantSpeed = 0;
let penVelocityX = 0;
let penVelocityY = 0;
let currentPressure = 0;
let currentTiltX = 0;
let currentTiltY = 0;
let currentPointerType = 'pen';
let hudRafScheduled = false;

function renderHudDOM() {
  hudRafScheduled = false;
  if (!stylusHud || stylusHud.classList.contains('hidden')) return;

  if (hudToolType) {
    let typeLabel = currentPointerType || 'unknown';
    if (currentPointerType === 'pen') typeLabel = '✍️ M-Pencil';
    else if (currentPointerType === 'touch') typeLabel = '👆 Touch';
    else if (currentPointerType === 'mouse') typeLabel = '🖱️ Mouse';
    hudToolType.textContent = typeLabel;
  }
  if (hudSpeedVal) hudSpeedVal.textContent = `${instantSpeed} px/s`;
  if (hudRateVal) hudRateVal.textContent = `${instantHz} Hz`;
  if (hudLatencyVal) {
    const lastDur = metrics.handlerDurations.length > 0 ? metrics.handlerDurations[metrics.handlerDurations.length - 1] : 0.02;
    hudLatencyVal.textContent = `${lastDur.toFixed(2)} ms`;
  }
  if (hudPressureBar) {
    hudPressureBar.style.width = Math.round(currentPressure * 100) + '%';
  }
  if (hudPressureVal) {
    hudPressureVal.textContent = currentPressure.toFixed(3);
  }
  if (hudTiltVal) {
    hudTiltVal.textContent = `${Math.round(currentTiltX)}° / ${Math.round(currentTiltY)}°`;
  }
  if (hudPointsCount) {
    hudPointsCount.textContent = metrics.totalPoints;
  }
  if (hudCoalescedCount) {
    hudCoalescedCount.textContent = metrics.coalescedPoints;
  }
}

function updateHudLive(e, pt) {
  metrics.totalPoints++;
  metrics.pointerTypesSeen.add(e.pointerType);
  if (e.pointerType === 'pen') metrics.detectedHardware.penObserved = true;

  const now = performance.now();
  if (lastHudPoint && pt.timestamp) {
    const dt = (pt.timestamp - lastHudPoint.timestamp);
    if (dt > 0) {
      instantHz = Math.min(240, Math.round(1000 / dt));
      const dist = Math.hypot(pt.x - lastHudPoint.x, pt.y - lastHudPoint.y);
      instantSpeed = Math.round((dist / dt) * 1000);
      penVelocityX = ((pt.x - lastHudPoint.x) / dt) * 1000;
      penVelocityY = ((pt.y - lastHudPoint.y) / dt) * 1000;
    }
  }
  lastHudPoint = { x: pt.x, y: pt.y, timestamp: pt.timestamp || now };

  const p = (e.pressure !== undefined && e.pressure !== null) ? e.pressure : 0;
  if (p > 0) {
    metrics.minPressure = Math.min(metrics.minPressure, p);
    metrics.maxPressure = Math.max(metrics.maxPressure, p);
    if (metrics.maxPressure - metrics.minPressure > 0.05) {
      metrics.detectedHardware.pressureVaries = true;
    }
  }
  if (e.tiltX || e.tiltY) {
    metrics.detectedHardware.tiltObserved = true;
  }

  currentPressure = p;
  currentTiltX = e.tiltX || 0;
  currentTiltY = e.tiltY || 0;
  currentPointerType = e.pointerType;

  // Render HUD DOM only when visible and throttled to display frames
  if (!hudRafScheduled && stylusHud && !stylusHud.classList.contains('hidden')) {
    hudRafScheduled = true;
    requestAnimationFrame(renderHudDOM);
  }
}

function renderPredictedSegment(ctx, pPrev, pCurr, stroke) {
  if (!pPrev || !pCurr || !stroke) return pCurr;
  const angle = stroke.defaultNibAngle;
  const thickness = pCurr.thickness || stroke.baseSize;

  const ptCurr = {
    x: pCurr.x,
    y: pCurr.y,
    angle: angle,
    thickness: thickness
  };
  const ptPrev = {
    x: pPrev.x,
    y: pPrev.y,
    angle: angle,
    thickness: pPrev.thickness || thickness
  };

  renderStrokeSegment(ctx, ptPrev, ptCurr, stroke);
  return ptCurr;
}

function addPointToStroke(e, pt, prevPt = null, targetCtx = dCtx) {
  const tool = currentStroke ? currentStroke.tool : currentPenType;
  const angle = currentStroke ? currentStroke.defaultNibAngle : defaultNibAngle;
  updateAngleDisplay(angle);

  let bSize = currentStroke ? currentStroke.baseSize : baseSize;
  let pressure = e.pressure;
  if (pressure === 0 && lastPressure !== null) {
    pressure = lastPressure;
  } else if (pressure === undefined || pressure === 0) {
    if (e.pointerType === 'pen' || activeIsStylus) pressure = 0.001;
    else pressure = 0.5;
  }
  if (pressure > 0) lastPressure = pressure;
  pressure = Math.max(0.001, Math.min(1, pressure));

  let thickness = bSize;
  if (tool === 'fountain' || (currentStroke && currentStroke.isEnglishFlex)) {
    thickness = bSize * (0.35 + Math.pow(pressure, 1.2) * 2.2);
    if (instantSpeed > 600) thickness *= 0.85; // capillary thinning
  } else if (tool === 'brush') {
    thickness = bSize * (0.15 + Math.pow(pressure, 0.85) * 3.5);
  } else if (tool === 'ballpoint') {
    thickness = Math.max(1.5, bSize * 0.25 + pressure * 1.8);
  } else if (tool === 'pencil') {
    const tiltMag = Math.hypot(e.tiltX || 0, e.tiltY || 0);
    if (tiltMag > 22) {
      thickness = bSize * Math.min(3.5, 1.0 + (tiltMag - 22) * 0.08);
    } else {
      thickness = Math.max(1.2, bSize * 0.2 + pressure * 2.0);
    }
  } else if (tool === 'ruling') {
    thickness = bSize;
  } else {
    // qalam: fixed chisel reed width
    thickness = bSize;
  }

  const rawPt = {
    x: pt.x,
    y: pt.y,
    angle,
    thickness,
    pressure: e.pressure !== undefined ? e.pressure : 0.5,
    tiltX: e.tiltX || 0,
    tiltY: e.tiltY || 0,
    timestamp: e.timeStamp || performance.now()
  };
  if (currentStroke) {
    currentStroke.points.push(rawPt);
  }

  updateHudLive(e, rawPt);

  if (!prevPt) {
    if (tool === 'fountain' || tool === 'brush' || (currentStroke && currentStroke.isEnglishFlex)) {
      targetCtx.fillStyle = currentStroke ? currentStroke.color : colorPicker.value;
      targetCtx.beginPath();
      targetCtx.arc(pt.x, pt.y, Math.max(thickness / 2, 0.5), 0, 2 * Math.PI);
      targetCtx.fill();
    } else if (tool === 'ruling' || tool === 'ballpoint' || tool === 'pencil') {
      targetCtx.fillStyle = currentStroke ? currentStroke.color : colorPicker.value;
      targetCtx.beginPath();
      targetCtx.arc(pt.x, pt.y, Math.max(thickness / 2, 0.5), 0, 2 * Math.PI);
      targetCtx.fill();
    } else {
      drawNibCap(targetCtx, pt.x, pt.y, angle, thickness, currentStroke ? currentStroke.ratio : 0.05, currentStroke ? currentStroke.color : '#000000');
    }
  } else {
    renderStrokeSegment(targetCtx, prevPt, rawPt, currentStroke);
  }
  return rawPt;
}

function getMinScale() {
  const rect = workspace.getBoundingClientRect();
  if (rect.width === 0) return 0.1;
  const scaleX = rect.width / WORLD_WIDTH;
  const scaleY = rect.height / WORLD_HEIGHT;
  return Math.min(0.2, scaleX * 0.5, scaleY * 0.5);
}

function initPinch(p1, p2) {
  const dx = p1.clientX - p2.clientX;
  const dy = p1.clientY - p2.clientY;
  initialPinchDist = Math.hypot(dx, dy);
  const cx = (p1.clientX + p2.clientX) / 2;
  const cy = (p1.clientY + p2.clientY) / 2;
  const rect = workspace.getBoundingClientRect();
  pinchLogicalMidpoint = {
    x: (cx - rect.left - translateX) / scale,
    y: (cy - rect.top - translateY) / scale
  };
}

function handlePinch(p1, p2) {
  const dx = p1.clientX - p2.clientX;
  const dy = p1.clientY - p2.clientY;
  const dist = Math.hypot(dx, dy);
  const cx = (p1.clientX + p2.clientX) / 2;
  const cy = (p1.clientY + p2.clientY) / 2;
  const rect = workspace.getBoundingClientRect();

  if (initialPinchDist && pinchLogicalMidpoint) {
    const scaleChange = dist / initialPinchDist;
    const minS = getMinScale();
    const newScale = Math.min(Math.max(minS, scale * scaleChange), 5);
    translateX = (cx - rect.left) - pinchLogicalMidpoint.x * newScale;
    translateY = (cy - rect.top) - pinchLogicalMidpoint.y * newScale;
    scale = newScale;
    initialPinchDist = dist;
    updateCamera();
  } else {
    initPinch(p1, p2);
  }
}

workspace.addEventListener('pointerdown', (e) => {
  const t0 = performance.now();
  if (e.target.closest('#drawer') || e.target.closest('#topBar') || e.target.closest('#scorePopup') || e.target.closest('#stylusHud') || e.target.closest('#challengePopup')) return;
  
  if (checkIsPalm(e)) return;

  e.preventDefault();
  initAudio();
  updateWorkspaceRect();

  pointerCache.push(e);
  const isCurrentStylus = checkIsStylus(e);

  if (pointerCache.length > 1) {
    if (activePointerId !== null) {
      if (activeIsStylus) {
        return;
      } else {
        isDrawing = false;
        activePointerId = null;
        if (strokes.length > 0 && strokes[strokes.length - 1] === currentStroke) {
          strokes.pop();
        }
        currentStroke = null;
        redrawAllStrokes();
      }
    }
    if (activePointerId === null && pointerCache.length === 2) {
      initPinch(pointerCache[0], pointerCache[1]);
    }
    return;
  }

  try { workspace.setPointerCapture(e.pointerId); } catch(err){}
  activePointerId = e.pointerId;
  activePointerType = e.pointerType;
  activeIsStylus = isCurrentStylus;
  isDrawing = true;

  const pt = getPointerPos(e);
  currentStroke = {
    id: 'stroke_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    rendererVersion: 1,
    tool: currentPenType,
    color: colorPicker.value,
    baseSize: baseSize,
    ratio: currentPenType === 'qalam' ? 0.05 : 0.2,
    defaultNibAngle: defaultNibAngle,
    isEnglishFlex: isEnglishFlex || currentPenType === 'fountain',
    startTime: Date.now(),
    points: []
  };
  strokes.push(currentStroke);
  undoneStrokes = [];
  lastPt = null;
  lastPressure = null;

  // Direct zero-latency drawing onto dCtx
  lastPt = addPointToStroke(e, pt, null, dCtx);
  invalidateScore();

  metrics.handlerDurations.push(performance.now() - t0);
}, { passive: false });

workspace.addEventListener('pointermove', (e) => {
  const t0 = performance.now();
  const index = pointerCache.findIndex(p => p.pointerId === e.pointerId);
  if (index !== -1) pointerCache[index] = e;

  if (activePointerId === e.pointerId && !activeIsStylus) {
    if (checkIsStylus(e)) activeIsStylus = true;
  }

  if (pointerCache.length >= 2 && activePointerId === null) {
    e.preventDefault();
    handlePinch(pointerCache[0], pointerCache[1]);
    return;
  }

  if (!isDrawing || e.pointerId !== activePointerId) return;
  e.preventDefault();

  // Support for high-frequency coalesced events from Huawei M-Pencil digitizer (120Hz)
  const coalescedEvents = (e.getCoalescedEvents && typeof e.getCoalescedEvents === 'function')
    ? e.getCoalescedEvents()
    : [e];

  if (coalescedEvents.length > 1) {
    metrics.coalescedPoints += (coalescedEvents.length - 1);
    metrics.detectedHardware.coalescedObserved = true;
  }

  // 1. Commit all confirmed digitizer points directly to dCtx
  for (const cEvent of coalescedEvents) {
    const pt = getPointerPos(cEvent);
    lastPt = addPointToStroke(cEvent, pt, lastPt, dCtx);
  }

  // 2. Ultra-low latency forward stylus tip prediction on desynchronized aCtx
  aCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  const predictedEvents = (e.getPredictedEvents && typeof e.getPredictedEvents === 'function')
    ? e.getPredictedEvents()
    : [];

  if (predictedEvents.length > 0 && lastPt) {
    let predPrev = lastPt;
    for (const pEvent of predictedEvents) {
      const predPt = getPointerPos(pEvent);
      predPrev = renderPredictedSegment(aCtx, predPrev, predPt, currentStroke);
    }
  } else if (lastPt && instantSpeed > 60) {
    // Dynamic 8ms forward lead tip (matches 1 frame at 120Hz)
    const dt = 0.008;
    const leadPt = {
      x: lastPt.x + penVelocityX * dt,
      y: lastPt.y + penVelocityY * dt,
      thickness: lastPt.thickness
    };
    renderPredictedSegment(aCtx, lastPt, leadPt, currentStroke);
  }

  metrics.handlerDurations.push(performance.now() - t0);
}, { passive: false });

function removePointer(e) {
  const index = pointerCache.findIndex(p => p.pointerId === e.pointerId);
  if (index !== -1) pointerCache.splice(index, 1);

  if (e.pointerId === activePointerId) {
    if (isDrawing) {
      if (e.type === 'pointerup') {
        const pt = getPointerPos(e);
        lastPt = addPointToStroke(e, pt, lastPt, dCtx);
        if (currentStroke && currentStroke.tool === 'qalam' && lastPt) {
          drawNibCap(dCtx, lastPt.x, lastPt.y, lastPt.angle, lastPt.thickness, currentStroke.ratio || 0.05, currentStroke.color || '#000000');
        }
      }
      aCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      if (currentStroke && currentStroke.points.length > 0) {
        // Gamified reward for deliberate calligraphy stroke
        gameState.streak++;
        gameState.totalStrokesDrawn++;
        localStorage.setItem('calligraphy_total_strokes', gameState.totalStrokesDrawn);
        playSound('stroke');
        addXp(5, e.clientX, e.clientY);
      }
    }
    isDrawing = false;
    activePointerId = null;
    activePointerType = null;
    activeIsStylus = false;
    currentStroke = null;
    lastPt = null;
  }

  if (pointerCache.length < 2) {
    initialPinchDist = null;
    pinchLogicalMidpoint = null;
  }
}

workspace.addEventListener('pointerup', removePointer);
workspace.addEventListener('pointercancel', removePointer);
workspace.addEventListener('lostpointercapture', removePointer);

window.addEventListener('blur', () => {
  interruptGestures();
  invalidateScore();
});

scoreBtn.addEventListener('click', () => {
  const currentJob = ++scoreJobId;
  
  if (templateCanvas.getAttribute('data-layout-ready') !== 'true' || !templateLayout.ready || !scoringImageData) {
    setStatusMessage('التقييم غير متاح للنموذج الحالي.', true);
    return;
  }

  const w = drawingCanvas.width;
  const h = drawingCanvas.height;
  
  if (scoringImageData.width !== w || scoringImageData.height !== h) return;

  const drawData = dCtx.getImageData(0, 0, w, h).data;
  const tempData = scoringImageData.data;

  hCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  const heatImg = hCtx.createImageData(w, h);
  const hData = heatImg.data;

  let templatePixels = 0;
  let correctPixels = 0;
  let incorrectPixels = 0;

  for (let i = 0; i < drawData.length; i += 4) {
    const dAlpha = drawData[i+3];
    const tAlpha = tempData[i+3];
    if (tAlpha > 50) templatePixels++;
    if (dAlpha > 50) {
      if (tAlpha > 50) {
        correctPixels++;
        hData[i] = 0; hData[i+1] = 200; hData[i+2] = 0; hData[i+3] = 255;
      } else {
        incorrectPixels++;
        hData[i] = 255; hData[i+1] = 0; hData[i+2] = 0; hData[i+3] = 255;
      }
    }
  }
  hCtx.putImageData(heatImg, 0, 0);

  let score = 0;
  if (templatePixels > 0) {
    const accuracy = correctPixels / templatePixels;
    const penalty = incorrectPixels / templatePixels;
    score = Math.max(0, Math.min(100, Math.round((accuracy - penalty * 0.4) * 100)));
  }

  document.getElementById('scoreValue').innerText = score;
  let msg = "حاول مرة أخرى.";
  let stars = "⭐";
  let xpBonus = 20;

  if (score >= 85) {
    msg = "تطابق استثنائي ومتقن كأنك خطاط محترف! 🏆";
    stars = "⭐⭐⭐";
    xpBonus = 150;
    playSound('levelup');
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 75);
  } else if (score >= 60) {
    msg = "مستوى ممتاز، زاوية السن وسحب الحبر متناسقان جداً. 🌟";
    stars = "⭐⭐";
    xpBonus = 75;
    playSound('star');
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 35);
  } else if (score >= 40) {
    msg = "محاولة جيدة، راقب المناطق الحمراء لتعديل مسارك. ✨";
    stars = "⭐";
    xpBonus = 35;
    playSound('xp');
  } else {
    msg = "حاول مجدداً، حافظ على زاوية السن المناسبة والهدوء أثناء السحب.";
    stars = "❌";
    xpBonus = 10;
  }

  document.getElementById('scoreMessage').innerText = msg;
  if (scoreStarContainer) scoreStarContainer.textContent = stars;
  if (scoreXpTag) scoreXpTag.textContent = `+${xpBonus} XP مكافأة تقييم`;
  addXp(xpBonus);

  if (activePlayer) {
    if (!activePlayer.history) activePlayer.history = [];
    activePlayer.history.push({
      text: practiceTextInput ? practiceTextInput.value : '',
      font: currentFont,
      score: score,
      stars: stars,
      xp: xpBonus,
      date: new Date().toLocaleDateString('ar-EG')
    });
    savePlayersList();
  }

  scorePopup.classList.remove('hidden');
});

closeScoreBtn.addEventListener('click', invalidateScore);

clearBtn.addEventListener('click', () => {
  interruptGestures();
  strokes = [];
  undoneStrokes = [];
  currentStroke = null;
  redrawAllStrokes();
  invalidateScore();
});

if (undoBtn) {
  undoBtn.addEventListener('click', () => {
    interruptGestures();
    if (strokes.length > 0) {
      const s = strokes.pop();
      undoneStrokes.push(s);
      redrawAllStrokes();
      invalidateScore();
    }
  });
}

if (nibAngleSlider) {
  nibAngleSlider.addEventListener('input', (e) => {
    const deg = parseInt(e.target.value);
    defaultNibAngle = deg * (Math.PI / 180);
    if (angleDisplay) angleDisplay.innerText = `${deg}°`;
  });
}

brushSize.addEventListener('input', (e) => baseSize = parseInt(e.target.value));
ghostOpacityInput.addEventListener('input', renderTemplate);
gridSelect.addEventListener('change', () => { drawGrid(); updateTemplateLayout(); });
menuBtn.addEventListener('click', () => { interruptGestures(); drawer.classList.add('open'); });
closeDrawerBtn.addEventListener('click', () => { interruptGestures(); drawer.classList.remove('open'); });
practiceTextInput.addEventListener('input', (e) => { 
  invalidateScore();
  updateTemplateLayout(); 
});

const allTemplateBtns = document.querySelectorAll('.template-btn');
allTemplateBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    interruptGestures();
    allTemplateBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentActiveButtonIndex = index;
    currentFont = btn.getAttribute('data-font');
    const angleDeg = parseInt(btn.getAttribute('data-angle'));
    defaultNibAngle = angleDeg * (Math.PI / 180);
    isEnglishFlex = btn.getAttribute('data-flex') === 'true';
    const isEn = btn.getAttribute('data-lang') === 'en';

    updateAngleDisplay(isEnglishFlex ? 45 * (Math.PI / 180) : defaultNibAngle);
    if (nibAngleSlider) nibAngleSlider.value = angleDeg;

    if (isEn) {
      if (practiceTextInput.dir !== 'ltr') {
        practiceTextInput.value = "Calligraphy Practice";
        practiceTextInput.dir = "ltr";
      }
      gridSelect.value = "english";
    } else {
      if (practiceTextInput.dir !== 'rtl') {
        practiceTextInput.value = "بسم الله الرحمن الرحيم";
        practiceTextInput.dir = "rtl";
      }
      if (currentFont === 'Aref Ruqaa') gridSelect.value = "ruqaa";
      else gridSelect.value = "naskh";
    }
    const fontTitleEl = btn.querySelector('.font-title');
    if (activeScriptLabel && fontTitleEl) {
      activeScriptLabel.textContent = fontTitleEl.textContent;
    }
    invalidateScore();
    updateTemplateLayout();
    drawGrid();
    drawer.classList.remove('open');
    playSound('star');
  });
});

// Practice Sample Chips (1-Click Instant Loading)
const sampleChips = document.querySelectorAll('.sample-chip');
sampleChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    interruptGestures();
    const sText = chip.getAttribute('data-text');
    const sFont = chip.getAttribute('data-font');
    const sAngle = parseInt(chip.getAttribute('data-angle'));
    const isFlex = chip.getAttribute('data-flex') === 'true';
    const isEn = chip.getAttribute('data-lang') === 'en';

    practiceTextInput.value = sText;
    practiceTextInput.dir = isEn ? 'ltr' : 'rtl';
    currentFont = sFont;
    defaultNibAngle = sAngle * (Math.PI / 180);
    isEnglishFlex = isFlex;

    if (activeScriptLabel) {
      activeScriptLabel.textContent = sFont;
    }

    if (isEn) {
      gridSelect.value = 'english';
    } else if (sFont === 'Aref Ruqaa') {
      gridSelect.value = 'ruqaa';
    } else {
      gridSelect.value = 'naskh';
    }

    updateAngleDisplay(isEnglishFlex ? 45 * (Math.PI / 180) : defaultNibAngle);
    if (nibAngleSlider) nibAngleSlider.value = sAngle;

    allTemplateBtns.forEach(b => {
      if (b.getAttribute('data-font') === sFont) b.classList.add('active');
      else b.classList.remove('active');
    });

    strokes = [];
    undoneStrokes = [];
    currentStroke = null;
    redrawAllStrokes();
    invalidateScore();
    updateTemplateLayout();
    drawGrid();

    drawer.classList.remove('open');
    setStatusMessage(`✨ تم تحميل تمرين: "${sText}"`, false);
    playSound('star');
  });
});

// HUD Controls & Performance Diagnostics
if (hudToggleBtn) {
  hudToggleBtn.addEventListener('click', () => {
    stylusHud.classList.toggle('hidden');
  });
}

if (closeHudBtn) {
  closeHudBtn.addEventListener('click', () => {
    stylusHud.classList.add('hidden');
  });
}

if (hudResetMetricsBtn) {
  hudResetMetricsBtn.addEventListener('click', () => {
    metrics.totalPoints = 0;
    metrics.coalescedPoints = 0;
    metrics.minPressure = 1.0;
    metrics.maxPressure = 0.0;
    metrics.handlerDurations = [];
    metrics.detectedHardware.palmRejectionsCount = 0;
    if (hudPointsCount) hudPointsCount.textContent = '0';
    if (hudCoalescedCount) hudCoalescedCount.textContent = '0';
    if (hudPressureVal) hudPressureVal.textContent = '0.000';
    if (hudPressureBar) hudPressureBar.style.width = '0%';
    if (hudTiltVal) hudTiltVal.textContent = '0° / 0°';
    if (hudReportBox) hudReportBox.classList.add('hidden');
  });
}

function calculatePercentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.floor((p / 100) * sorted.length);
  return sorted[Math.min(index, sorted.length - 1)];
}

if (hudGenReportBtn) {
  hudGenReportBtn.addEventListener('click', () => {
    const p50 = calculatePercentile(metrics.handlerDurations, 50).toFixed(2);
    const p95 = calculatePercentile(metrics.handlerDurations, 95).toFixed(2);
    const p99 = calculatePercentile(metrics.handlerDurations, 99).toFixed(2);
    const avgDuration = metrics.handlerDurations.length > 0
      ? (metrics.handlerDurations.reduce((a, b) => a + b, 0) / metrics.handlerDurations.length).toFixed(2)
      : '0.00';

    const report = {
      device: {
        model: "HUAWEI TXZ-W09 (MatePad 11.5)",
        screenDpr: window.devicePixelRatio || 1,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent
      },
      stylusHardwareDiagnostic: {
        penObserved: metrics.detectedHardware.penObserved,
        pressureSupported: metrics.detectedHardware.pressureVaries,
        observedPressureRange: `[${metrics.minPressure === 1 ? 0 : metrics.minPressure.toFixed(3)}, ${metrics.maxPressure.toFixed(3)}]`,
        tiltSupported: metrics.detectedHardware.tiltObserved,
        coalescedEventsSupported: metrics.detectedHardware.coalescedObserved,
        palmRejectionEvents: metrics.detectedHardware.palmRejectionsCount
      },
      drawingEngineMetrics: {
        canvasArchitecture: "Dual-Layer (activeCanvas + drawingCanvas)",
        immutableStrokeProfiles: true,
        totalStrokesRecorded: strokes.length,
        totalPointsRecorded: metrics.totalPoints,
        coalescedPointsExtracted: metrics.coalescedPoints,
        eventHandlerLatencyMs: {
          avg: avgDuration,
          p50: p50,
          p95: p95,
          p99: p99
        }
      },
      timestamp: new Date().toISOString()
    };

    if (hudReportText) {
      hudReportText.value = JSON.stringify(report, null, 2);
    }
    if (hudReportBox) {
      hudReportBox.classList.remove('hidden');
    }
  });
}

if (hudCopyReportBtn) {
  hudCopyReportBtn.addEventListener('click', () => {
    if (hudReportText && hudReportText.value) {
      navigator.clipboard.writeText(hudReportText.value).then(() => {
        const orig = hudCopyReportBtn.textContent;
        hudCopyReportBtn.textContent = 'تم النسخ بنجاح! ✅';
        setTimeout(() => { hudCopyReportBtn.textContent = orig; }, 2000);
      }).catch(err => {
        alert('يرجى نسخ التقرير يدوياً من المربع.');
      });
    }
  });
}

// Draggable HUD Logic
let isDraggingHud = false;
let hudDragStartX = 0;
let hudDragStartY = 0;
let hudInitialLeft = 0;
let hudInitialTop = 0;

if (hudDragHandle && stylusHud) {
  hudDragHandle.addEventListener('pointerdown', (e) => {
    isDraggingHud = true;
    try { hudDragHandle.setPointerCapture(e.pointerId); } catch(err){}
    e.stopPropagation();
    e.preventDefault();

    const rect = stylusHud.getBoundingClientRect();
    hudDragStartX = e.clientX;
    hudDragStartY = e.clientY;
    hudInitialLeft = rect.left;
    hudInitialTop = rect.top;

    stylusHud.style.right = 'auto';
    stylusHud.style.bottom = 'auto';
    stylusHud.style.left = `${hudInitialLeft}px`;
    stylusHud.style.top = `${hudInitialTop}px`;
  });

  hudDragHandle.addEventListener('pointermove', (e) => {
    if (!isDraggingHud) return;
    e.stopPropagation();
    e.preventDefault();

    const dx = e.clientX - hudDragStartX;
    const dy = e.clientY - hudDragStartY;

    const hudWidth = stylusHud.offsetWidth || 320;
    const hudHeight = stylusHud.offsetHeight || 300;

    let newLeft = hudInitialLeft + dx;
    let newTop = hudInitialTop + dy;

    newLeft = Math.max(10, Math.min(window.innerWidth - hudWidth - 10, newLeft));
    newTop = Math.max(10, Math.min(window.innerHeight - hudHeight - 10, newTop));

    stylusHud.style.left = `${newLeft}px`;
    stylusHud.style.top = `${newTop}px`;
  });

  const stopHudDrag = (e) => {
    if (isDraggingHud) {
      isDraggingHud = false;
      try { hudDragHandle.releasePointerCapture(e.pointerId); } catch(err){}
      e.stopPropagation();
    }
  };

  hudDragHandle.addEventListener('pointerup', stopHudDrag);
  hudDragHandle.addEventListener('pointercancel', stopHudDrag);
}

// Challenge Mode Popup & Cards Wiring
if (gameModeBtn) {
  gameModeBtn.addEventListener('click', () => {
    interruptGestures();
    if (challengePopup) challengePopup.classList.toggle('hidden');
  });
}

if (closeChallengeBtn) {
  closeChallengeBtn.addEventListener('click', () => {
    if (challengePopup) challengePopup.classList.add('hidden');
  });
}

const chStartBtns = document.querySelectorAll('.challenge-item .ch-start-btn');
chStartBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.challenge-item');
    if (!item) return;

    const chText = item.getAttribute('data-text');
    const chFont = item.getAttribute('data-font');
    const chAngle = parseInt(item.getAttribute('data-angle'));
    const chXp = parseInt(item.getAttribute('data-xp')) || 50;
    const isEn = item.getAttribute('data-lang') === 'en';
    const isFlex = item.getAttribute('data-flex') === 'true';

    practiceTextInput.value = chText;
    practiceTextInput.dir = isEn ? 'ltr' : 'rtl';
    currentFont = chFont;
    defaultNibAngle = chAngle * (Math.PI / 180);
    isEnglishFlex = isFlex;

    if (isEn) {
      gridSelect.value = 'english';
    } else if (chFont === 'Aref Ruqaa') {
      gridSelect.value = 'ruqaa';
    } else {
      gridSelect.value = 'naskh';
    }

    updateAngleDisplay(isEnglishFlex ? 45 * (Math.PI / 180) : defaultNibAngle);
    if (nibAngleSlider) nibAngleSlider.value = chAngle;

    const allBtns = document.querySelectorAll('.template-btn');
    allBtns.forEach(b => {
      if (b.getAttribute('data-font') === chFont) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    strokes = [];
    undoneStrokes = [];
    currentStroke = null;
    redrawAllStrokes();
    invalidateScore();
    updateTemplateLayout();
    drawGrid();

    if (challengePopup) challengePopup.classList.add('hidden');
    setStatusMessage(`🎯 بدأت التحدي: "${chText}" (+${chXp} XP محتملة)`, false);
    playSound('star');
  });
});

// Initialization
resizeCanvases();
updateAngleDisplay(defaultNibAngle);
if (nibAngleSlider) {
  nibAngleSlider.value = Math.round(defaultNibAngle * (180 / Math.PI));
}
syncGameStateWithPlayer();
setPenType('qalam');
updateTemplateLayout();

requestAnimationFrame(fitView);
setTimeout(fitView, 120);
setTimeout(fitView, 350);
window.addEventListener('resize', () => {
  fitView();
  resizeFxCanvas();
});
window.addEventListener('orientationchange', () => {
  setTimeout(fitView, 150);
});

// Expose globals for inspection, testing, and automated journeys
window.showTeacherHint = showTeacherHint;
window.openInteractiveDemo = openInteractiveDemo;
window.startInteractiveDemo = startInteractiveDemo;
window.setPenType = setPenType;
window.fitView = fitView;
window.redrawAllStrokes = redrawAllStrokes;
window.currentDemo = () => currentDemo;

