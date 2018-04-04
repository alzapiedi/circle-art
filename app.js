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
let circles = [
  { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - (CANVAS_SIZE / 2.5), r: CANVAS_SIZE / 2.5, a: 0, v: (2 * Math.PI / STEPS_1) },
  { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - (CANVAS_SIZE / 4), r: CANVAS_SIZE / 4, a: 0, v: (2 * Math.PI / STEPS_2) }
];

document.addEventListener('DOMContentLoaded', () => {
  setupForms();
});

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

function updateLcm() {
  lcm = getLcm(angleToSteps(circles[0].v), angleToSteps(circles[1].v));
}

function setupForms() {
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const pixels = document.getElementById('pixels');
  r1.value = circles[0].r;
  r2.value = circles[1].r;
  v1.value = angleToSteps(circles[0].v);
  v2.value = angleToSteps(circles[1].v);
  pixels.value = CANVAS_SIZE;
  r1.onchange = event => {
    circles[0].r = Number(event.target.value);
    stop();
    clear();
  }
  r2.onchange = event => {
    circles[1].r = Number(event.target.value);
    stop();
    clear();
  }
  v1.onchange = event => {
    circles[0].v = stepsToAngle(event.target.value);
    updateLcm();
    stop();
    clear();
  }
  v2.onchange = event => {
    circles[1].v = stepsToAngle(event.target.value);
    updateLcm();
    stop();
    clear();
  }
  pixels.onchange = event => {
    stop();
    clear();
    const size = Number(event.target.value) > 10000 ? 10000 : Math.abs(Math.round(Number(event.target.value)));
    canvas.height = Number(size);
    canvas.width = Number(size);
    pixels.value = size;
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
  ctx.clearRect(0,0, canvas.width, canvas.height)
  resetCircles();
  updateProgress();
}

function stop() {
  isRunning = false;
}

function drawCircle(circle) {
  const { x, y } = circle;
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, 2 * Math.PI);
  ctx.fill();
}

function updateProgress() {
  const progress = Math.round(runs * 100 / lcm);
  document.getElementById('progress_inner').style.width = `${progress}%`;
  document.getElementById('progress_text').innerHTML = `${runs} / ${lcm}`;
}

function draw() {
  if (!isRunning) return;
  if (runs === lcm) return isRunning = false;
  runs++;
  updateProgress();
  ctx.beginPath();
  ctx.moveTo(circles[0].x, circles[0].y);
  ctx.lineTo(circles[1].x, circles[1].y);
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
  requestAnimationFrame(draw);
}

start();
