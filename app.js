const COLOR_COUNT = 255 * 255 * 255;
const CANVAS_SIZE = 1000;
const STEPS_1 = 200;
const STEPS_2 = 150;

class Circle {
  constructor(options) {
    const keys = ['a', 'p', 'r', 'v', 'x', 'y'];
    keys.forEach(key => this[key] = options[key]);
  }

  get steps() {
    return angleToSteps(this.v);
  }

  reset() {
    this.x = Math.cos(Math.PI / 2 + this.p) + canvas.width / 2;
    this.y = Math.sin(Math.PI / 2 + this.p) + canvas.height / 2;
    this.a = 0;
  }

  step() {
    this.a = this.a + this.v;
    this.x = this.r * Math.cos(this.a - Math.PI / 2 + this.p) + canvas.width / 2;
    this.y = this.r * Math.sin(this.a - Math.PI / 2 + this.p) + canvas.height / 2;
  }
}

// --------------------------------------------------

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let circles = [
  new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - (CANVAS_SIZE / 2.5), r: CANVAS_SIZE / 2.5, a: 0, v: (2 * Math.PI / STEPS_1), p: 0 }),
  new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - (CANVAS_SIZE / 4), r: CANVAS_SIZE / 4, a: 0, v: (2 * Math.PI / STEPS_2), p: 0 })
];
let color;
let colors = [];
let cycles = 1;
let isRunning = false;
let lcm = getLcm(STEPS_1, STEPS_2);
let lineColor = '#000';
let lines = [];
let runs = 0;
let useColors = false;

// ----------------------------------------------------

function setupForms() {
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const p1 = document.getElementById('p1');
  const p2 = document.getElementById('p2');
  const pixels = document.getElementById('pixels');
  const color = document.getElementById('color');
  const colorCycles = document.getElementById('cycles');
  r1.value = circles[0].r;
  r2.value = circles[1].r;
  v1.value = angleToSteps(circles[0].v);
  v2.value = angleToSteps(circles[1].v);
  p1.value = 0;
  p2.value = 0;
  pixels.value = CANVAS_SIZE;
  colorCycles.value = cycles;
  ['f',1,2,3,4,5,6].forEach(n => {
    const color = `#${n}${n}${n}`;
    document.getElementById(`bg_color_${n}`).onclick = event => setBackground(color);
    document.getElementById(`line_color_${n}`).onclick = event => setLineColor(color);
  });
  r1.onchange = event => {
    circles[0].r = Number(event.target.value);
    reset();
  }
  r2.onchange = event => {
    circles[1].r = Number(event.target.value);
    reset();
  }
  p1.onchange = event => {
    circles[0].p = degToRad(Number(event.target.value));
    reset();
  }
  p2.onchange = event => {
    circles[1].p = degToRad(Number(event.target.value));
    reset();
  }
  v1.onchange = event => {
    circles[0].v = stepsToAngle(event.target.value);
    updateLcm();
    reset();
  }
  v2.onchange = event => {
    circles[1].v = stepsToAngle(event.target.value);
    updateLcm();
    reset();
  }
  pixels.onchange = event => {
    reset();
    const size = Number(event.target.value) > 10000 ? 10000 : Math.abs(Math.round(Number(event.target.value)));
    canvas.height = Number(size);
    canvas.width = Number(size);
    pixels.value = size;
  }
  color.onchange = event => {
    useColors = event.target.checked;
    colorCycles.disabled = !useColors;
    document.getElementById('color_options').style.display = useColors ? 'flex' : 'none';
    reset();
  }
  colorCycles.onchange = event => {
    cycles = Math.round(Number(event.target.value)) || 1;
    reset();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupForms();
});

// --------Helper functions---------

function degToRad(deg) {
  return deg * Math.PI / 180;
}

function angleToSteps(angle) {
  return Math.round(2*Math.PI / angle);
}

function stepsToAngle(steps) {
  return (Math.PI / (Number(steps))) * 2;
}

function getLcm(x, y) {
   if ((typeof x !== 'number') || (typeof y !== 'number'))
    return false;
  return (!x || !y) ? 0 : Math.abs((x * y) / getGcd(x, y));
}

function getGcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}
// ----------------------------------

function resetCircles() {
  circles.forEach(circle => circle.reset());
}

function clear() {
  runs = 0;
  wipeCanvas();
  resetCircles();
  updateColors();
  updateProgress();
}

function stop() {
  isRunning = false;
}

function reset() {
  stop();
  clear();
}

function wipeCanvas() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
}

function disableColors() {
  useColors = false;
  document.getElementById('color').checked = false;
  document.getElementById('color_options').style.display = 'none';
}

function makeColorGradient(frequency1, frequency2, frequency3, phase1,phase2,phase3,center,width,len) {
  const colors = [];
  if (len == undefined)
    len = 50;
  if (center == undefined)
    center = 128;
  if (width == undefined)
    width = 127;
  for (var i = 0; i < len; ++i)
  {
     var red = Math.sin(frequency1*i + phase1) * width + center;
     var grn = Math.sin(frequency2*i + phase2) * width + center;
     var blu = Math.sin(frequency3*i + phase3) * width + center;
     colors.push(RGB2Color(red, grn, blu));
  }
  return colors;
} //XXX

function setBackground(color) {
  canvas.style.background = color;
}

function setLineColor(color) {
  lineColor = color;
  disableColors();
  wipeCanvas();
  restore(lineColor);
}

function updateColors() { //XXX
  const numColors = Math.max(circles[0].steps, circles[1].steps);
  colors = makeColorGradient(cycles * (2*Math.PI / numColors), cycles * (2*Math.PI / numColors), cycles * (2*Math.PI / numColors), 0, 2, 4, undefined, undefined, numColors);
}

function updateLcm() {
  lcm = getLcm(circles[0].steps, circles[1].steps);
}

function updateProgress() {
  const progress = Math.round(runs * 100 / lcm);
  document.getElementById('progress_inner').style.width = `${progress}%`;
  document.getElementById('progress_text').innerHTML = `${runs} / ${lcm}`;
}

function restore(color) {
  lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = color ? color : line.color;
    ctx.stroke();
  });
}

function draw() {
  if (!isRunning) return;
  if (runs === lcm) return isRunning = false;
  color = colors[runs % Math.max(circles[0].steps, circles[1].steps)];
  runs++;
  updateProgress();
  ctx.beginPath();
  lines.push({ x1: circles[0].x, y1: circles[0].y, x2: circles[1].x, y2: circles[1].y, color });
  ctx.moveTo(circles[0].x, circles[0].y);
  ctx.lineTo(circles[1].x, circles[1].y);
  ctx.strokeStyle = useColors ? color : lineColor;
  ctx.stroke();
  circles.forEach(circle => circle.step());
  requestAnimationFrame(draw);
}

function start() {
  if (isRunning) return;
  isRunning = true;
  updateColors();
  requestAnimationFrame(draw);
}

start();
