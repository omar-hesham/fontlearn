const workspace = document.getElementById('workspace');
const canvasContainer = document.getElementById('canvasContainer');
const drawingCanvas = document.getElementById('drawingCanvas');
const templateCanvas = document.getElementById('templateCanvas');
const gridCanvas = document.getElementById('gridCanvas');
const heatmapCanvas = document.getElementById('heatmapCanvas');
const dCtx = drawingCanvas.getContext('2d', { willReadFrequently: true });
const tCtx = templateCanvas.getContext('2d', { willReadFrequently: true });
const gCtx = gridCanvas.getContext('2d');
const hCtx = heatmapCanvas.getContext('2d');
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

let currentFont = 'Aref Ruqaa';
let currentText = practiceTextInput.value;
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

function invalidateScore() {
  scoreJobId++;
  if (!scorePopup.classList.contains('hidden')) {
    scorePopup.classList.add('hidden');
    hCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  [drawingCanvas, templateCanvas, gridCanvas, heatmapCanvas].forEach(canvas => {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  });
  dCtx.scale(dpr, dpr);
  tCtx.scale(dpr, dpr);
  gCtx.scale(dpr, dpr);
  hCtx.scale(dpr, dpr);

  drawGrid();
  drawTemplate();
  redrawAllStrokes();
}

let resizeTimeout;
window.addEventListener('resize', () => {
  invalidateScore();
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvases, 50);
});

resizeCanvases();

function updateAngleDisplay(angle) {
  const newAngleStr = `${Math.round(angle * 180 / Math.PI)}°`;
  if (angleDisplay.innerText !== newAngleStr) {
    angleDisplay.innerText = newAngleStr;
  }
}

function drawGrid() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  gCtx.clearRect(0, 0, w, h);
  const type = gridSelect.value;
  if (type === 'none') return;
  gCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  gCtx.lineWidth = 1;
  const cy = h / 2;
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

async function drawTemplate() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const currentId = ++templateDrawId;
  const fontSize = Math.min(w / 4, 150);
  const fontStr = `${fontSize}px "${currentFont}"`;

  try {
    if (document.fonts) await document.fonts.load(fontStr);
  } catch(e) {}

  if (currentId !== templateDrawId) return;

  tCtx.clearRect(0, 0, w, h);
  const op = ghostOpacityInput.value / 100;
  if (!currentText.trim() || op <= 0) return;

  tCtx.fillStyle = `rgba(150, 150, 150, ${op})`;
  tCtx.textAlign = 'center';
  tCtx.textBaseline = 'middle';
  tCtx.direction = practiceTextInput.dir || (isEnglishFlex ? 'ltr' : 'rtl');
  tCtx.font = fontStr;
  tCtx.fillText(currentText, w / 2, h / 2);
}

function getPointerPos(e) {
  return {
    x: (e.clientX - translateX) / scale,
    y: (e.clientY - translateY) / scale
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

function redrawAllStrokes() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  dCtx.clearRect(0, 0, w, h);
  for (const stroke of strokes) {
    let prevPt = null;
    for (const pt of stroke.points) {
      if (!prevPt) {
        drawEllipse(dCtx, pt.x, pt.y, pt.angle, pt.thickness, stroke.color, stroke.ratio);
      } else {
        const dist = Math.hypot(pt.x - prevPt.x, pt.y - prevPt.y);
        const minThickness = Math.min(prevPt.thickness, pt.thickness);
        const minRadius = Math.max(minThickness * stroke.ratio, 0.5);
        const stepSize = Math.max(minRadius * 0.5, 0.25);
        const steps = Math.max(Math.ceil(dist / stepSize), 1);
        
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const x = lerp(prevPt.x, pt.x, t);
          const y = lerp(prevPt.y, pt.y, t);
          const thick = lerp(prevPt.thickness, pt.thickness, t);
          const ang = lerpAngle(prevPt.angle, pt.angle, t);
          drawEllipse(dCtx, x, y, ang, thick, stroke.color, stroke.ratio);
        }
      }
      prevPt = pt;
    }
  }
}

function checkIsStylus(e) {
  if (e.pointerType === 'pen' || e.pointerType === 'mouse') return true;
  if (e.pointerType === 'touch') {
    if (e.pressure > 0 && e.pressure !== 0.5 && e.pressure !== 1) return true;
    if (e.tiltX !== undefined && e.tiltY !== undefined && (e.tiltX !== 0 || e.tiltY !== 0)) return true;
  }
  return false;
}

function checkIsPalm(e) {
  return e.pointerType === 'touch' && ((e.width !== undefined && e.width >= 40) || (e.height !== undefined && e.height >= 40));
}

function addPointToStroke(e, pt, prevPt = null) {
  let angle = defaultNibAngle;
  if (isEnglishFlex) {
    angle = 45 * (Math.PI / 180);
  } else if (e.tiltX !== undefined && e.tiltY !== undefined) {
    const tx = Math.tan(e.tiltX * Math.PI / 180);
    const ty = Math.tan(e.tiltY * Math.PI / 180);
    if (Math.abs(tx) > 1e-7 || Math.abs(ty) > 1e-7) {
      angle = Math.atan2(ty, tx);
    }
  }
  updateAngleDisplay(angle);

  let thickness = baseSize;
  let pressure = e.pressure;
  if (pressure === 0 && lastPressure !== null) {
    pressure = lastPressure;
  } else if (pressure === undefined || pressure === 0) {
    if (e.pointerType === 'pen' || activeIsStylus) pressure = 0.001;
    else pressure = 0.5;
  }
  if (pressure > 0) lastPressure = pressure;
  pressure = Math.max(0.001, Math.min(1, pressure));

  if (isEnglishFlex) {
    thickness = baseSize * (0.2 + pressure * 1.5);
  }

  const ratio = currentStroke.ratio;
  const rawPt = {x: pt.x, y: pt.y, angle, thickness};
  currentStroke.points.push(rawPt);

  if (!prevPt) {
    drawEllipse(dCtx, pt.x, pt.y, angle, thickness, currentStroke.color, ratio);
  } else {
    const dist = Math.hypot(pt.x - prevPt.x, pt.y - prevPt.y);
    const minThickness = Math.min(prevPt.thickness, thickness);
    const minRadius = Math.max(minThickness * ratio, 0.5);
    const stepSize = Math.max(minRadius * 0.5, 0.25);
    const steps = Math.max(Math.ceil(dist / stepSize), 1);
    
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = lerp(prevPt.x, pt.x, t);
      const y = lerp(prevPt.y, pt.y, t);
      const thick = prevPt.thickness !== undefined ? lerp(prevPt.thickness, thickness, t) : thickness;
      const ang = prevPt.angle !== undefined ? lerpAngle(prevPt.angle, angle, t) : angle;
      drawEllipse(dCtx, x, y, ang, thick, currentStroke.color, ratio);
    }
  }
  return rawPt;
}

function updateTransform() {
  canvasContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function initPinch(p1, p2) {
  const dx = p1.clientX - p2.clientX;
  const dy = p1.clientY - p2.clientY;
  initialPinchDist = Math.hypot(dx, dy);
  const cx = (p1.clientX + p2.clientX) / 2;
  const cy = (p1.clientY + p2.clientY) / 2;
  pinchLogicalMidpoint = {
    x: (cx - translateX) / scale,
    y: (cy - translateY) / scale
  };
}

function handlePinch(p1, p2) {
  const dx = p1.clientX - p2.clientX;
  const dy = p1.clientY - p2.clientY;
  const dist = Math.hypot(dx, dy);
  const cx = (p1.clientX + p2.clientX) / 2;
  const cy = (p1.clientY + p2.clientY) / 2;

  if (initialPinchDist && pinchLogicalMidpoint) {
    const scaleChange = dist / initialPinchDist;
    const newScale = Math.min(Math.max(0.5, scale * scaleChange), 5);
    translateX = cx - pinchLogicalMidpoint.x * newScale;
    translateY = cy - pinchLogicalMidpoint.y * newScale;
    scale = newScale;
    initialPinchDist = dist;
    updateTransform();
  } else {
    initPinch(p1, p2);
  }
}

workspace.addEventListener('pointerdown', (e) => {
  if (e.target.closest('#drawer') || e.target.closest('#topBar') || e.target.closest('#scorePopup')) return;
  
  pointerCache.push(e);
  const isCurrentStylus = checkIsStylus(e);
  const isPalm = checkIsPalm(e);

  if (pointerCache.length > 1) {
    if (activePointerId !== null) {
      if (activeIsStylus || isPalm) {
        return;
      } else {
        isDrawing = false;
        activePointerId = null;
        strokes.pop();
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
  currentStroke = { color: colorPicker.value, ratio: isEnglishFlex ? 0.3 : 0.05, points: [] };
  strokes.push(currentStroke);
  lastPt = null;
  lastPressure = null;

  lastPt = addPointToStroke(e, pt);
  invalidateScore();
});

workspace.addEventListener('pointermove', (e) => {
  const index = pointerCache.findIndex(p => p.pointerId === e.pointerId);
  if (index !== -1) pointerCache[index] = e;

  if (activePointerId === e.pointerId && !activeIsStylus) {
    if (checkIsStylus(e)) activeIsStylus = true;
  }

  if (pointerCache.length >= 2 && activePointerId === null) {
    handlePinch(pointerCache[0], pointerCache[1]);
    return;
  }

  if (!isDrawing || e.pointerId !== activePointerId) return;

  invalidateScore();
  const pt = getPointerPos(e);
  lastPt = addPointToStroke(e, pt, lastPt);
});

function removePointer(e) {
  const index = pointerCache.findIndex(p => p.pointerId === e.pointerId);
  if (index !== -1) pointerCache.splice(index, 1);

  if (e.pointerId === activePointerId) {
    if (isDrawing && e.type === 'pointerup') {
      const pt = getPointerPos(e);
      lastPt = addPointToStroke(e, pt, lastPt);
      invalidateScore();
    }
    isDrawing = false;
    activePointerId = null;
    activePointerType = null;
    activeIsStylus = false;
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
  pointerCache = [];
  isDrawing = false;
  activePointerId = null;
  activePointerType = null;
  activeIsStylus = false;
  initialPinchDist = null;
  pinchLogicalMidpoint = null;
  invalidateScore();
});

scoreBtn.addEventListener('click', async () => {
  const currentJob = ++scoreJobId;
  const dpr = window.devicePixelRatio || 1;
  const textSnapshot = currentText;
  const fontSnapshot = currentFont;
  const dirSnapshot = practiceTextInput.dir || (isEnglishFlex ? 'ltr' : 'rtl');
  
  const fontSize = Math.min(window.innerWidth / 4, 150);
  const fontStr = `${fontSize}px "${fontSnapshot}"`;

  try {
    if (document.fonts) await document.fonts.load(fontStr);
  } catch(e) {}

  if (currentJob !== scoreJobId) return;

  const w = drawingCanvas.width;
  const h = drawingCanvas.height;
  const drawData = dCtx.getImageData(0, 0, w, h).data;

  const offCanvas = document.createElement('canvas');
  offCanvas.width = w;
  offCanvas.height = h;
  const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
  offCtx.scale(dpr, dpr);

  offCtx.fillStyle = 'black';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.direction = dirSnapshot;
  offCtx.font = fontStr;
  offCtx.fillText(textSnapshot, window.innerWidth / 2, window.innerHeight / 2);

  const tempData = offCtx.getImageData(0, 0, w, h).data;
  hCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
  if(score > 80) msg = "تطابق رائع! التحكم بالريشة ممتاز.";
  else if(score > 50) msg = "مستوى جيد، لاحظ المناطق الحمراء لتعديل مسارك.";
  document.getElementById('scoreMessage').innerText = msg;
  scorePopup.classList.remove('hidden');
});

closeScoreBtn.addEventListener('click', invalidateScore);

clearBtn.addEventListener('click', () => {
  strokes = [];
  currentStroke = null;
  isDrawing = false;
  activePointerId = null;
  pointerCache = [];
  activeIsStylus = false;
  redrawAllStrokes();
  invalidateScore();
});

brushSize.addEventListener('input', (e) => baseSize = parseInt(e.target.value));
ghostOpacityInput.addEventListener('input', drawTemplate);
gridSelect.addEventListener('change', drawGrid);
menuBtn.addEventListener('click', () => drawer.classList.add('open'));
closeDrawerBtn.addEventListener('click', () => drawer.classList.remove('open'));
practiceTextInput.addEventListener('input', (e) => { 
  currentText = e.target.value; 
  invalidateScore();
  drawTemplate(); 
});

templateBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    templateBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFont = btn.getAttribute('data-font');
    defaultNibAngle = parseInt(btn.getAttribute('data-angle')) * (Math.PI / 180);
    isEnglishFlex = btn.getAttribute('data-flex') === 'true';

    updateAngleDisplay(isEnglishFlex ? 45 * (Math.PI / 180) : defaultNibAngle);

    if (btn.getAttribute('data-lang') === 'en') {
      practiceTextInput.value = "Calligraphy Practice";
      practiceTextInput.dir = "ltr";
      gridSelect.value = "english";
    } else {
      practiceTextInput.value = "بسم الله الرحمن الرحيم";
      practiceTextInput.dir = "rtl";
      if(currentFont === 'Aref Ruqaa') gridSelect.value = "ruqaa";
      else gridSelect.value = "naskh";
    }
    currentText = practiceTextInput.value;
    invalidateScore();
    drawTemplate();
    drawGrid();
    drawer.classList.remove('open');
  });
});

updateAngleDisplay(defaultNibAngle);
