const CANVAS_SIZE = 1000;
const R_1 = 400;
const R_2 = 250;
const STEPS_1 = 200;
const STEPS_2 = 150;

class Circle {
  constructor(options) {
    Circle.keys.forEach(key => this[key] = options[key]);

    this.colors = this._getColorGradient();
  }

  get steps() {
    return angleToSteps(this.v);
  }

  getColor(run) {
    return this.colors[run % this.steps];
  }

  reset() {
    this.x = this.r * Math.cos(Math.PI / 2 + this.p) + canvas.width / 2;
    this.y = this.r * -Math.sin(Math.PI / 2 + this.p) + canvas.height / 2;
    this.a = 0;
  }

  step() {
    this.a = this.a + this.v;
    this.x = this.r * Math.cos(this.a - Math.PI / 2 + this.p) + canvas.width / 2;
    this.y = this.r * Math.sin(this.a - Math.PI / 2 + this.p) + canvas.height / 2;
  }

  update(options) {
    Circle.keys.forEach(key => {
      if (options[key] !== undefined) this[key] = options[key];
    });
    this.colors = this._getColorGradient();
  }

  _getColorGradient() {
    const steps = this.steps;
    return makeColorGradient(this.fr*2*Math.PI/steps, this.fg*2*Math.PI/steps, this.fb*2*Math.PI/steps, this.pr, this.pg, this.pb, undefined, undefined, steps);
  }
}

Circle.keys = ['a', 'fb', 'fg', 'fr', 'p', 'pb', 'pg', 'pr', 'r', 'v', 'x', 'y'];

// ------global variables------------------------------

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.height = `${CANVAS_SIZE}px`;

let circles = [
  new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - R_1, r: R_1, a: 0, v: 2 * Math.PI / STEPS_1, p: 0, fr: 1, fg: 1, fb: 1, pr: 0, pg: 2, pb: 4 }),
  new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - R_2, r: R_2, a: 0, v: 2 * Math.PI / STEPS_2, p: 0, fr: 1, fg: 1, fb: 1, pr: 0, pg: 2, pb: 4 })
];

const app = {
  colors: [],
  cycles: 1,
  fb: 1,
  fg: 1,
  fr: 1,
  pb: 4,
  pg: 2,
  pr: 0,
  isRunning: false,
  lcm: getLcm(STEPS_1, STEPS_2),
  lineColor: '#000',
  lines: [],
  runs: 0,
  useColors: false,
  useGradient: false
}

// ----------------------------------------------------

function setupForms() {
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const p1 = document.getElementById('p1');
  const p2 = document.getElementById('p2');
  const fr = document.getElementById('fr');
  const fg = document.getElementById('fg');
  const fb = document.getElementById('fb');
  const pr = document.getElementById('pr');
  const pg = document.getElementById('pg');
  const pb = document.getElementById('pb');
  const pixels = document.getElementById('pixels');
  const color = document.getElementById('color');
  const gradient = document.getElementById('gradient');
  r1.value = circles[0].r;
  r2.value = circles[1].r;
  v1.value = angleToSteps(circles[0].v);
  v2.value = angleToSteps(circles[1].v);
  p1.value = 0;
  p2.value = 0;
  fb.value = app.fb;
  fg.value = app.fg;
  fr.value = app.fr;
  pb.value = app.pb;
  pg.value = app.pg;
  pr.value = app.pr;
  pixels.value = CANVAS_SIZE;
  ['f',1,2,3,4,5,6].forEach(n => {
    const color = `#${n}${n}${n}`;
    document.getElementById(`bg_color_${n}`).onclick = event => setBackground(color);
    document.getElementById(`line_color_${n}`).onclick = event => setLineColor(color);
  });
  r1.onchange = event => {
    circles[0].update({r: Number(event.target.value)});
    reset();
  }
  r2.onchange = event => {
    circles[1].update({r: Number(event.target.value)});
    reset();
  }
  p1.onchange = event => {
    circles[0].update({p: degToRad(Number(event.target.value))});
    reset();
  }
  p2.onchange = event => {
    circles[1].update({p: degToRad(Number(event.target.value))});
    reset();
  }
  v1.onchange = event => {
    circles[0].update({v: stepsToAngle(event.target.value)});
    updateLcm();
    reset();
  }
  v2.onchange = event => {
    circles[1].update({v: stepsToAngle(event.target.value)});
    updateLcm();
    reset();
  }
  fb.onchange = event => {
    app.fb = Number(event.target.value);
    updateColors();
    reset();
  }
  fg.onchange = event => {
    app.fg = Number(event.target.value);
    updateColors();
    reset();
  }
  fr.onchange = event => {
    app.fr = Number(event.target.value);
    updateColors();
    reset();
  }
  pb.onchange = event => {
    app.pb = Number(event.target.value);
    updateColors();
    reset();
  }
  pg.onchange = event => {
    app.pg = Number(event.target.value);
    updateColors();
    reset();
  }
  pr.onchange = event => {
    app.pr = Number(event.target.value);
    updateColors();
    reset();
  }
  pixels.onchange = event => {
    reset();
    const size = Number(event.target.value) > 10000 ? 10000 : Math.abs(Math.round(Number(event.target.value)));
    canvas.height = Number(size);
    canvas.width = Number(size);
    canvas.style.height = `${Number(size)}px`;
    canvas.style.width = `${Number(size)}px`;
    pixels.value = size;
  }
  color.onchange = event => {
    app.useColors = event.target.checked;
    disableGradient();
    document.getElementById('color_options').style.display = app.useColors ? 'flex' : 'none';
    wipeCanvas();
    restore(app.useColors ? null : app.lineColor);
  }
  gradient.onchange = event => {
    app.useGradient = event.target.checked;
    disableColors();
    wipeCanvas();
    restore(app.useGradient ? null : app.lineColor);
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

// ----------------------------------

function resetCircles() {
  circles.forEach(circle => circle.reset());
}

function clear() {
  app.runs = 0;
  app.lines = [];
  wipeCanvas();
  resetCircles();
  updateColors();
  updateProgress();
}

function stop() {
  app.isRunning = false;
}

function reset() {
  stop();
  clear();
}

function wipeCanvas() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
}

function disableColors() {
  app.useColors = false;
  document.getElementById('color').checked = false;
  document.getElementById('color_options').style.display = 'none';
}

function disableGradient() {
  app.useGradient = false;
  document.getElementById('gradient').checked = false;
  document.getElementById('gradient_options').style.display = 'none';
}

function setBackground(color) {
  canvas.style.background = color;
}

function setLineColor(color) {
  app.lineColor = color;
  disableColors();
  wipeCanvas();
  restore(app.lineColor);
}

function updateColors() { //XXX
  const { cycles, fb, fg, fr, pb, pg, pr } = app;
  const numColors = Math.max(circles[0].steps, circles[1].steps);
  app.colors = makeColorGradient(cycles * fr * (2*Math.PI / numColors), cycles * fg * (2*Math.PI / numColors), cycles * fb * (2*Math.PI / numColors), pr, pg, pb, undefined, undefined, numColors);
}

function updateLcm() {
  app.lcm = getLcm(circles[0].steps, circles[1].steps);
}

function updateProgress() {
  const { lcm, runs } = app;
  const progress = Math.round(runs * 100 / lcm);
  document.getElementById('progress_inner').style.width = `${progress}%`;
  document.getElementById('progress_text').innerHTML = `${runs} / ${lcm}`;
}

function restore(color) {
  const { useGradient } = app;
  app.lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = color ? color : useGradient ? line.gradient : line.color;
    ctx.stroke();
  });
}

function draw() {
  const { colors, isRunning, lcm, lines, lineColor, runs, useColors, useGradient } = app;
  if (!isRunning) return;
  if (runs === lcm) return app.isRunning = false;
  const color = colors[runs % Math.max(circles[0].steps, circles[1].steps)]
  const gradient = ctx.createLinearGradient(circles[0].x, circles[0].y, circles[1].x, circles[1].y);
  gradient.addColorStop(0, circles[0].getColor(runs));
  gradient.addColorStop(1, circles[1].getColor(runs));
  lines.push({ x1: circles[0].x, y1: circles[0].y, x2: circles[1].x, y2: circles[1].y, color, gradient });
  ctx.beginPath();
  ctx.moveTo(circles[0].x, circles[0].y);
  ctx.lineTo(circles[1].x, circles[1].y);
  ctx.strokeStyle = useGradient ? gradient : useColors ? color : lineColor;
  ctx.stroke();
  circles.forEach(circle => circle.step());
  app.runs++;
  updateProgress();
  requestAnimationFrame(draw);
}

function start() {
  if (app.isRunning) return;
  app.isRunning = true;
  updateColors();
  requestAnimationFrame(draw);
}

start();
