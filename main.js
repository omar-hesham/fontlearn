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
const fitViewBtn = document.getElementById('fitViewBtn');
const resetViewBtn = document.getElementById('resetViewBtn');
const statusMessage = document.getElementById('statusMessage');

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
  const scaleX = rect.width / WORLD_WIDTH;
  const scaleY = rect.height / WORLD_HEIGHT;
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

function interruptGestures() {
  if (activePointerId !== null) {
    try { workspace.releasePointerCapture(activePointerId); } catch(e){}
  }
  isDrawing = false;
  activePointerId = null;
  activePointerType = null;
  activeIsStylus = false;
  pointerCache = [];
  initialPinchDist = null;
  pinchLogicalMidpoint = null;
}

function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;
  const currentDprW = WORLD_WIDTH * dpr;
  
  if (drawingCanvas.width !== currentDprW) {
    [drawingCanvas, templateCanvas, gridCanvas, heatmapCanvas].forEach(canvas => {
      canvas.width = WORLD_WIDTH * dpr;
      canvas.height = WORLD_HEIGHT * dpr;
    });
    dCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
  const newAngleStr = `${Math.round(angle * 180 / Math.PI)}°`;
  if (angleDisplay.innerText !== newAngleStr) {
    angleDisplay.innerText = newAngleStr;
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

function getPointerPos(e) {
  const rect = workspace.getBoundingClientRect();
  const ex = e.clientX - rect.left;
  const ey = e.clientY - rect.top;
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

function redrawAllStrokes() {
  dCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
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
    if (e.pressure > 0 && e.pressure !== 0.5) return true;
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
  if (e.target.closest('#drawer') || e.target.closest('#topBar') || e.target.closest('#scorePopup')) return;
  
  if (checkIsPalm(e)) return;

  pointerCache.push(e);
  const isCurrentStylus = checkIsStylus(e);

  if (pointerCache.length > 1) {
    if (activePointerId !== null) {
      if (activeIsStylus) {
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
  if(score > 80) msg = "تطابق رائع! التحكم بالريشة ممتاز.";
  else if(score > 50) msg = "مستوى جيد، لاحظ المناطق الحمراء لتعديل مسارك.";
  document.getElementById('scoreMessage').innerText = msg;
  scorePopup.classList.remove('hidden');
});

closeScoreBtn.addEventListener('click', invalidateScore);

clearBtn.addEventListener('click', () => {
  interruptGestures();
  strokes = [];
  currentStroke = null;
  redrawAllStrokes();
  invalidateScore();
});

brushSize.addEventListener('input', (e) => baseSize = parseInt(e.target.value));
ghostOpacityInput.addEventListener('input', renderTemplate);
gridSelect.addEventListener('change', () => { drawGrid(); updateTemplateLayout(); });
menuBtn.addEventListener('click', () => { interruptGestures(); drawer.classList.add('open'); });
closeDrawerBtn.addEventListener('click', () => { interruptGestures(); drawer.classList.remove('open'); });
practiceTextInput.addEventListener('input', (e) => { 
  invalidateScore();
  updateTemplateLayout(); 
});

templateBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    interruptGestures();
    templateBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentActiveButtonIndex = index;
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
    invalidateScore();
    updateTemplateLayout();
    drawGrid();
    drawer.classList.remove('open');
  });
});

// Initialization
resizeCanvases();
updateAngleDisplay(defaultNibAngle);
updateTemplateLayout();
