const CANVAS_SIZE = 1000;
const canvas = document.getElementById('canvas');
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
const ctx = canvas.getContext('2d');

let isRunning = false;
let circles = [
  { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - (CANVAS_SIZE / 2.5), r: CANVAS_SIZE / 2.5, a: 0, v: Math.PI / 100 },
  { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - (CANVAS_SIZE / 4), r: CANVAS_SIZE / 4, a: 0, v: Math.PI / 75 }
];

document.addEventListener('DOMContentLoaded', () => {
  setupForms();
});

function setupForms() {
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const pixels = document.getElementById('pixels');
  r1.value = circles[0].r;
  r2.value = circles[1].r;
  v1.value = 2*Math.round(Math.PI / circles[0].v);
  v2.value = 2*Math.round(Math.PI / circles[1].v);
  pixels.value = CANVAS_SIZE;
  r1.onchange = event => {
    stop();
    clear();
    circles[0].r = Number(event.target.value);
  }
  r2.onchange = event => {
    stop();
    clear();
    circles[1].r = Number(event.target.value);
  }
  v1.onchange = event => {
    stop();
    clear();
    circles[0].v = (Math.PI / (Number(event.target.value))) * 2;
  }
  v2.onchange = event => {
    stop();
    clear();
    circles[1].v = (Math.PI / (Number(event.target.value))) * 2;
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
  ctx.clearRect(0,0,CANVAS_SIZE,CANVAS_SIZE)
  resetCircles();
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

function draw() {
  if (!isRunning) return;
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
