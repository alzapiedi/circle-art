const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;
let F = 50;

const canvas = document.getElementById('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

let circles = [];
const intervals = [];

document.addEventListener('DOMContentLoaded', () => {
  setupForms();
});

function setupForms() {
  const r1 = document.getElementById('r1');
  const r2 = document.getElementById('r2');
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const f = document.getElementById('f');
  r1.value = 400;
  r2.value = 225;
  v1.value = 260;
  v2.value = 100;
  f.value = 50;
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
    circles[0].v = Math.PI / Number(event.target.value);
  }
  v2.onchange = event => {
    stop();
    clear();
    circles[1].v = Math.PI / Number(event.target.value);
  }
  f.onchange = event => {
    stop();
    clear();
    F = Number(event.target.value);
  }
}

function clear() {
  ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
}

function drawCircle(circle) {
  const { x, y } = circle;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function addCircle(circle) {
  circle.x = CANVAS_WIDTH / 2;
  circle.y = CANVAS_HEIGHT / 2 + circle.r;
  circles.push(circle);
}

function stop() {
  intervals.forEach(clearInterval);
}

function start () {
  if (circles.length === 0) [{ r: 400, a: 0, v: Math.PI / 260 }, { r: 225, a: 0, v: Math.PI / 100 }].forEach(addCircle);
  intervals.push(setInterval(() => {
    circles.forEach(circle => {
      circle.a = circle.a + circle.v === Math.PI * 2 ? 0 : circle.a + circle.v;
      circle.x = circle.r * Math.cos(circle.a) + CANVAS_WIDTH / 2;
      circle.y = circle.r * Math.sin(circle.a) + CANVAS_HEIGHT / 2;
    });

  }, 1000/60));

  intervals.push(setInterval(() => {
    ctx.beginPath();
    ctx.moveTo(circles[0].x, circles[0].y);
    ctx.lineTo(circles[1].x, circles[1].y);
    ctx.stroke();
  }, 1000 / F));
}

start();
