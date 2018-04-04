const COLOR_COUNT = 255 * 255 * 255;
const CANVAS_SIZE = 1000;
const STEPS_1 = 200;
const STEPS_2 = 150;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let lcm = getLcm(STEPS_1, STEPS_2);
let runs = 0;
let isRunning = false;
let useColors = false;
let cycles = 1;
let color;
let colors = [];
let lines = [];
let circles = [
  { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - (CANVAS_SIZE / 2.5), r: CANVAS_SIZE / 2.5, a: 0, v: (2 * Math.PI / STEPS_1) },
  { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - (CANVAS_SIZE / 4), r: CANVAS_SIZE / 4, a: 0, v: (2 * Math.PI / STEPS_2) }
];

document.addEventListener('DOMContentLoaded', () => {
  setupForms();
});

// --------Helper functions---------
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

function setupForms() {
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const pixels = document.getElementById('pixels');
  const color = document.getElementById('color');
  const colorCycles = document.getElementById('cycles');
  r1.value = circles[0].r;
  r2.value = circles[1].r;
  v1.value = angleToSteps(circles[0].v);
  v2.value = angleToSteps(circles[1].v);
  pixels.value = CANVAS_SIZE;
  colorCycles.value = cycles;
  r1.onchange = event => {
    circles[0].r = Number(event.target.value);
    reset();
  }
  r2.onchange = event => {
    circles[1].r = Number(event.target.value);
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
    reset();
  }
  colorCycles.onchange = event => {
    cycles = Math.round(Number(event.target.value)) || 1;
    reset();
  }
}

function resetCircles() {
  circles.forEach(circle => {
    circle.x = canvas.width / 2;
    circle.y = canvas.height / 2 - circle.r;
    circle.a = 0;
  });
}

function clear() {
  runs = 0;
  ctx.clearRect(0,0, canvas.width, canvas.height);
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

function drawCircle(circle) {
  const { x, y } = circle;
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, 2 * Math.PI);
  ctx.fill();
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
}

function updateColors() {
  const numColors = Math.max(angleToSteps(circles[0].v), angleToSteps(circles[1].v));
  colors = makeColorGradient(cycles * (2*Math.PI / numColors), cycles * (2*Math.PI / numColors), cycles * (2*Math.PI / numColors), 0, 2, 4, undefined, undefined, numColors);
}

function updateLcm() {
  lcm = getLcm(angleToSteps(circles[0].v), angleToSteps(circles[1].v));
}

function updateProgress() {
  const progress = Math.round(runs * 100 / lcm);
  document.getElementById('progress_inner').style.width = `${progress}%`;
  document.getElementById('progress_text').innerHTML = `${runs} / ${lcm}`;
}

function draw() {
  if (!isRunning) return;
  if (runs === lcm) return isRunning = false;
  color = colors[runs % Math.max(angleToSteps(circles[0].v), angleToSteps(circles[1].v))];
  runs++;
  updateProgress();
  ctx.beginPath();
  lines.push({ x1: circles[0].x, y1: circles[0].y, x2: circles[1].x, y2: circles[1].y, color });
  ctx.moveTo(circles[0].x, circles[0].y);
  ctx.lineTo(circles[1].x, circles[1].y);
  ctx.strokeStyle = useColors ? color : '#000000';
  ctx.stroke();
  circles.forEach(circle => {
    circle.a = circle.a + circle.v;
    circle.x = circle.r * Math.cos(circle.a - Math.PI / 2) + canvas.width / 2;
    circle.y = circle.r * Math.sin(circle.a - Math.PI / 2) + canvas.height / 2;
  });
  requestAnimationFrame(draw);
}

function start() {
  if (isRunning) return;
  isRunning = true;
  updateColors();
  requestAnimationFrame(draw);
}

function restore() {
  lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = line.color;
    ctx.stroke();
  });
}

start();
