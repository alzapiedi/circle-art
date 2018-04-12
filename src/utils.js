function _getLcm(x, y) {
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

export function angleToSteps(angle) {
  return Math.round(2*Math.PI / angle);
}

export function degToRad(deg) {
  return deg * Math.PI / 180;
}

export function getLcm(numbers) {
  let lcm = 1;
  for (let i = 0; i < numbers.length - 1; i++) {
    lcm = _getLcm(lcm, _getLcm(numbers[i], numbers[i+1]));
  }
  return lcm;
}

export function makeColorGradient(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len) {
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

export function stepsToAngle(steps) {
  return (Math.PI / (Number(steps))) * 2;
}

export default {
  angleToSteps,
  degToRad,
  getLcm,
  makeColorGradient,
  stepsToAngle
}
