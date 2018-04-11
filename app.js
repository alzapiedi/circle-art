// ------starting values --------------------

const CANVAS_SIZE = 1000;
const R_1 = 400;
const R_2 = 250;
const R_3 = 180;
const STEPS_1 = 200;
const STEPS_2 = 150;
const STEPS_3 = 75;

// ----------helper class---------------------------

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
    this.x = this.r * Math.cos(-Math.PI / 2 + this.p) + canvas.width / 2;
    this.y = this.r * Math.sin(-Math.PI / 2 + this.p) + canvas.height / 2;
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

// ------global variables / app config------------------------

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.height = `${CANVAS_SIZE}px`;

const app = {
  colors: [],
  circles: [
    new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - R_1, r: R_1, a: 0, v: 2 * Math.PI / STEPS_1, p: 0, fr: 1, fg: 1, fb: 1, pr: 0, pg: 2, pb: 4 }),
    new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - R_2, r: R_2, a: 0, v: 2 * Math.PI / STEPS_2, p: 0, fr: 1, fg: 1, fb: 1, pr: 0, pg: 2, pb: 4 }),
    new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - R_3, r: R_3, a: 0, v: 2 * Math.PI / STEPS_3, p: 0, fr: 1, fg: 1, fb: 1, pr: 0, pg: 2, pb: 4 })
  ],
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
  speed: 2,
  useColors: false,
  useGradient: false
}

// ----------input handlers-----------------------------

function setupForms() {
  const { circles } = app;
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const p1 = document.getElementById('p1');
  const p2 = document.getElementById('p2');
  const fr = document.getElementById('fr');
  const fg = document.getElementById('fg');
  const fb = document.getElementById('fb');
  const o1fb = document.getElementById('o1fb');
  const o1fg = document.getElementById('o1fg');
  const o1fr = document.getElementById('o1fr');
  const o1pb = document.getElementById('o1pb');
  const o1pg = document.getElementById('o1pg');
  const o1pr = document.getElementById('o1pr');
  const o2fb = document.getElementById('o2fb');
  const o2fg = document.getElementById('o2fg');
  const o2fr = document.getElementById('o2fr');
  const o2pb = document.getElementById('o2pb');
  const o2pg = document.getElementById('o2pg');
  const o2pr = document.getElementById('o2pr');
  const pr = document.getElementById('pr');
  const pg = document.getElementById('pg');
  const pb = document.getElementById('pb');
  const pixels = document.getElementById('pixels');
  const color = document.getElementById('color');
  const gradient = document.getElementById('gradient');
  const speed = document.getElementById('speed');
  r1.value = circles[0].r;
  r2.value = circles[1].r;
  v1.value = angleToSteps(circles[0].v);
  v2.value = angleToSteps(circles[1].v);
  p1.value = 0;
  p2.value = 0;
  fb.value = app.fb;
  fg.value = app.fg;
  fr.value = app.fr;
  o1fb.value = circles[0].fb;
  o1fg.value = circles[0].fg;
  o1fr.value = circles[0].fr;
  o1pb.value = circles[0].pb;
  o1pg.value = circles[0].pg;
  o1pr.value = circles[0].pr;
  o2fb.value = circles[1].fb;
  o2fg.value = circles[1].fg;
  o2fr.value = circles[1].fr;
  o2pb.value = circles[1].pb;
  o2pg.value = circles[1].pg;
  o2pr.value = circles[1].pr;
  pb.value = app.pb;
  pg.value = app.pg;
  pr.value = app.pr;
  pixels.value = CANVAS_SIZE;
  ['b','d','f',1,2,3,4,5,6].forEach(n => {
    const color = `#${n}${n}${n}`;
    document.getElementById(`bg_color_${n}`).onclick = event => setBackground(color);
    document.getElementById(`line_color_${n}`).onclick = event => setLineColor(color);
  });
  r1.oninput = event => {
    circles[0].update({r: Number(event.target.value)});
    reset();
  }
  r2.oninput = event => {
    circles[1].update({r: Number(event.target.value)});
    reset();
  }
  p1.oninput = event => {
    circles[0].update({p: degToRad(Number(event.target.value))});
    updateLines();
    wipeCanvas();
    restore();
  }
  p2.oninput = event => {
    circles[1].update({p: degToRad(Number(event.target.value))});
    updateLines();
    wipeCanvas();
    restore();
  }
  v1.oninput = event => {
    circles[0].update({v: stepsToAngle(event.target.value)});
    updateLcm();
    reset();
  }
  v2.oninput = event => {
    circles[1].update({v: stepsToAngle(event.target.value)});
    updateLcm();
    reset();
  }
  fb.oninput = event => {
    app.fb = Number(event.target.value);
    updateColors();
    updateLines();
    wipeCanvas();
    restore();
  }
  fg.oninput = event => {
    app.fg = Number(event.target.value);
    updateColors();
    updateLines();
    wipeCanvas();
    restore();
  }
  fr.oninput = event => {
    app.fr = Number(event.target.value);
    updateColors();
    updateLines();
    wipeCanvas();
    restore();
  }
  o1fb.oninput = event => {
    circles[0].update({ fb: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o1fg.oninput = event => {
    circles[0].update({ fg: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o1fr.oninput = event => {
    circles[0].update({ fr: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o1pb.oninput = event => {
    circles[0].update({ pb: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o1pg.oninput = event => {
    circles[0].update({ pg: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o1pr.oninput = event => {
    circles[0].update({ pr: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o2fb.oninput = event => {
    circles[1].update({ fb: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o2fg.oninput = event => {
    circles[1].update({ fg: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o2fr.oninput = event => {
    circles[1].update({ fr: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o2pb.oninput = event => {
    circles[1].update({ pb: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o2pg.oninput = event => {
    circles[1].update({ pg: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  o2pr.oninput = event => {
    circles[1].update({ pr: Number((event.target.value)) });
    updateLines();
    wipeCanvas();
    restore();
  }
  pb.oninput = event => {
    app.pb = Number(event.target.value);
    updateColors();
    updateLines();
    wipeCanvas();
    restore();
  }
  pg.oninput = event => {
    app.pg = Number(event.target.value);
    updateColors();
    updateLines();
    wipeCanvas();
    restore();
  }
  pr.oninput = event => {
    app.pr = Number(event.target.value);
    updateColors();
    updateLines();
    wipeCanvas();
    restore();
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
    document.getElementById('gradient_options').style.display = app.useGradient ? 'flex' : 'none';
    wipeCanvas();
    restore(app.useGradient ? null : app.lineColor);
  }
  speed.oninput = event => {
    const value = Number(event.target.value);
    app.speed = Number.isFinite(value) ? value : 1;
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

// --------app functions----------------------------------

function clear() {
  app.runs = 0;
  app.lines = [];
  wipeCanvas();
  resetCircles();
  updateColors();
  updateProgress();
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

function reset() {
  stop();
  clear();
}

function resetCircles() {
  app.circles.forEach(circle => circle.reset());
}

function setBackground(color) {
  canvas.style.background = color;
}

function setLineColor(color) {
  app.lineColor = color;
  disableColors();
  disableGradient();
  wipeCanvas();
  restore(app.lineColor);
}

function stop() {
  app.isRunning = false;
}

function updateColors() {
  const { circles, cycles, fb, fg, fr, pb, pg, pr } = app;
  const numColors = Math.max(circles[0].steps, circles[1].steps);
  app.colors = makeColorGradient(cycles * fr * (2*Math.PI / numColors), cycles * fg * (2*Math.PI / numColors), cycles * fb * (2*Math.PI / numColors), pr, pg, pb, undefined, undefined, numColors);
}

function updateLcm() {
  const { circles } = app;
  app.lcm = getLcm(circles[0].steps, circles[1].steps);
}

function updateLines() {
  const { circles, colors, lines } = app;
  resetCircles();
  lines.forEach((line, i) => {
    line.x1 = circles[0].x;
    line.y1 = circles[0].y;
    line.x2 = circles[1].x;
    line.y2 = circles[1].y;
    const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
    gradient.addColorStop(0, circles[0].getColor(i));
    gradient.addColorStop(1, circles[1].getColor(i));
    line.gradient = gradient;
    line.color = colors[i % Math.max(circles[0].steps, circles[1].steps)];
    circles[0].step();
    circles[1].step();
  });
}

function updateProgress() {
  const { lcm, runs } = app;
  const progress = Math.round(runs * 100 / lcm);
  document.getElementById('progress_inner').style.width = `${progress}%`;
  document.getElementById('progress_text').innerHTML = `${runs} / ${lcm}`;
}

function wipeCanvas() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
}

// ----------- rendering methods ------------------------------

function restore(color) {
  const { lineColor, useColors, useGradient } = app;
  app.lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = color ? color : useGradient ? line.gradient : useColors ? line.color : lineColor;
    ctx.stroke();
  });
}

function draw(i) {
  const { circles, colors, isRunning, lcm, lines, lineColor, runs, useColors, useGradient } = app;
  if (!isRunning) return;
  if (runs === lcm) return app.isRunning = false;

  for (let n = 0; n < circles.length; n++) {
    for (let m = n + 1; m < circles.length; m++) {
      const color = colors[runs % Math.max(circles[n].steps, circles[m].steps)]
      const gradient = ctx.createLinearGradient(circles[n].x, circles[n].y, circles[m].x, circles[m].y);
      gradient.addColorStop(0, circles[n].getColor(runs));
      gradient.addColorStop(1, circles[m].getColor(runs));

      lines.push({ x1: circles[n].x, y1: circles[m].y, x2: circles[n].x, y2: circles[m].y, color, gradient });

      ctx.beginPath();
      ctx.moveTo(circles[n].x, circles[n].y);
      ctx.lineTo(circles[m].x, circles[m].y);
      ctx.strokeStyle = useGradient ? gradient : useColors ? color : lineColor;
      ctx.stroke();
    }
  }

  circles.forEach(circle => circle.step());

  app.runs++;
  updateProgress();
  if (i === app.speed - 1) requestAnimationFrame(run);
}

function start() {
  if (app.isRunning) return;
  app.isRunning = true;
  updateColors();
  requestAnimationFrame(run);
}

function run() {
  for (var i = 0; i < app.speed; i++) draw(i);
}

start();
