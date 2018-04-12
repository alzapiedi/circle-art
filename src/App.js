import React, { Component } from 'react';

import { CANVAS_SIZE, R_1, R_2, STEPS_1, STEPS_2 } from 'defaults';
import { getLcm, makeColorGradient } from 'utils';
import Circle from 'Circle';

window.app = {
  colors: [],
  circles: [
    new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - R_1, r: R_1, a: 0, v: 2 * Math.PI / STEPS_1, p: 0, fr: 1, fg: 1, fb: 1, pr: 0, pg: 2, pb: 4 }),
    new Circle({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 - R_2, r: R_2, a: 0, v: 2 * Math.PI / STEPS_2, p: 0, fr: 1, fg: 1, fb: 1, pr: 0, pg: 2, pb: 4 })
  ],
  fb: 1,
  fg: 1,
  fr: 1,
  pb: 4,
  pg: 2,
  pr: 0,
  isRunning: false,
  lcm: getLcm([STEPS_1, STEPS_2]),
  lineColor: '#000',
  lines: [],
  runs: 0,
  speed: 1,
  useColors: false,
  useGradient: false
}

export default class App extends Component {
  render() {
    return (
      <section className="controls">
        <div className="row">
          <h2>Canvas Size</h2>
          <div className="input_group">
            <div className="input"><label>Pixels</label><input value={this.props.ctx.canvas.width} onChange={this.handleChangeCanvasSize} type="text" /></div>
          </div>
        </div>
        <div className="row">
          <h2>Speed</h2>
          <div className="input_group">
            <div className="input"><label>Speed</label><input value={app.speed} onChange={this.handleChangeSpeed} type="text" /></div>
          </div>
        </div>
        {app.circles.map(this.renderOrbitProperties)}
        <div id="extra_orbits"></div>
        <button id="add_orbit">Add Orbit</button>
        <div className="row">
          <h2>Colors <input id="color" onChange={this.handleToggleColors} type="checkbox" /></h2>
          <div id="color_options" className="subrow" style={{ display: 'none' }}>
            <h2>Red</h2>
            <div className="input_group">
              <div className="input"><label>F</label><input onChange={this.handleChangeColorProperty.bind(this, 'fr')} value={app.fr} type="text" /></div>
              <div className="input"><label>Phase</label><input onChange={this.handleChangeColorProperty.bind(this, 'pr')} value={app.pr} type="text" /></div>
            </div>
            <h2>Green</h2>
            <div className="input_group">
              <div className="input"><label>F</label><input onChange={this.handleChangeColorProperty.bind(this, 'fg')} value={app.fg} type="text" /></div>
              <div className="input"><label>Phase</label><input onChange={this.handleChangeColorProperty.bind(this, 'pg')} value={app.pg} type="text" /></div>
            </div>
            <h2>Blue</h2>
            <div className="input_group">
              <div className="input"><label>F</label><input onChange={this.handleChangeColorProperty.bind(this, 'fb')} value={app.fb} type="text" /></div>
              <div className="input"><label>Phase</label><input onChange={this.handleChangeColorProperty.bind(this, 'pb')} value={app.pb} type="text" /></div>
            </div>
          </div>
        </div>
        <div className="row">
          <h2>Gradient <input id="gradient" onChange={this.handleToggleGradient} type="checkbox" /></h2>
          <div id="gradient_options" className="subrow" style={{ display: 'none' }}>
            <h2>Orbit 1</h2>
            <div className="subrow">
              <h2>Red</h2>
              <div className="input_group">
                <div className="input"><label>F</label><input id="o1fr" type="text" /></div>
                <div className="input"><label>Phase</label><input id="o1pr" type="text" /></div>
              </div>
              <h2>Green</h2>
              <div className="input_group">
                <div className="input"><label>F</label><input id="o1fg" type="text" /></div>
                <div className="input"><label>Phase</label><input id="o1pg" type="text" /></div>
              </div>
              <h2>Blue</h2>
              <div className="input_group">
                <div className="input"><label>F</label><input id="o1fb" type="text" /></div>
                <div className="input"><label>Phase</label><input id="o1pb" type="text" /></div>
              </div>
            </div>
            <h2>Orbit 2</h2>
            <div className="subrow">
              <h2>Red</h2>
              <div className="input_group">
                <div className="input"><label>F</label><input id="o2fr" type="text" /></div>
                <div className="input"><label>Phase</label><input id="o2pr" type="text" /></div>
              </div>
              <h2>Green</h2>
              <div className="input_group">
                <div className="input"><label>F</label><input id="o2fg" type="text" /></div>
                <div className="input"><label>Phase</label><input id="o2pg" type="text" /></div>
              </div>
              <h2>Blue</h2>
              <div className="input_group">
                <div className="input"><label>F</label><input id="o2fb" type="text" /></div>
                <div className="input"><label>Phase</label><input id="o2pb" type="text" /></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <h2>Background</h2>
          <div className="colors">
            <font style={{ color: '#111' }} id="bg_color_1">█</font>
            <font style={{ color: '#222' }} id="bg_color_2">█</font>
            <font style={{ color: '#333' }} id="bg_color_3">█</font>
            <font style={{ color: '#444' }} id="bg_color_4">█</font>
            <font style={{ color: '#555' }} id="bg_color_5">█</font>
            <font style={{ color: '#666' }} id="bg_color_6">█</font>
            <font style={{ color: '#bbb' }} id="bg_color_b">█</font>
            <font style={{ color: '#ddd' }} id="bg_color_d">█</font>
            <font style={{ color: '#fff' }} id="bg_color_f">█</font>
          </div>
        </div>
        <div className="row">
          <h2>Line Color</h2>
          <div className="colors">
            <font style={{ color: '#111' }} id="line_color_1">█</font>
            <font style={{ color: '#222' }} id="line_color_2">█</font>
            <font style={{ color: '#333' }} id="line_color_3">█</font>
            <font style={{ color: '#444' }} id="line_color_4">█</font>
            <font style={{ color: '#555' }} id="line_color_5">█</font>
            <font style={{ color: '#666' }} id="line_color_6">█</font>
            <font style={{ color: '#bbb' }} id="line_color_b">█</font>
            <font style={{ color: '#ddd' }} id="line_color_d">█</font>
            <font style={{ color: '#fff' }} id="line_color_f">█</font>
          </div>
        </div>
        <div className="buttons">
          <button className="start" onClick={this.start}>Start</button>
          <button className="stop" onClick={this.stop}>Stop</button>
        </div>
        <div className="buttons">
          <button className="clear" onClick={this.reset}>Reset</button>
        </div>
        <div className="help">
          <p>Radius: Length of orbit in pixels</p>
          <p>Steps: Number of points along orbit to visit</p>
        </div>
        <div className="progress">
          <h3>Amount of steps to reach starting point</h3>
          <div className="progress_outer">
            <p id="progress_text"></p>
            <div id="progress_inner"></div>
          </div>
        </div>
      </section>
    );
  }

  renderOrbitProperties = (circle, i) => {
    return (
      <div className="row" key={i}>
        <h2>Orbit {i + 1}</h2>
        <div className="input_group">
          <div className="input"><label>Radius</label><input value={circle.r} onChange={this.updateCircle.bind(this, circle, 'r')} type="text" /></div>
          <div className="input"><label>Steps</label><input value={circle.steps} onChange={this.updateCircle.bind(this, circle, 'steps')} type="text" /></div>
        </div>
        <div className="input_group">
          <div className="input"><label>Phase Shift (deg CW)</label><input value={circle.p} onChange={this.updateCircle.bind(this, circle, 'p')} type="text" /></div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.start();
  }

  disableColors() {
    app.useColors = false;
    document.getElementById('color').checked = false;
    document.getElementById('color_options').style.display = 'none';
  }

  disableGradient() {
    app.useGradient = false;
    document.getElementById('gradient').checked = false;
    document.getElementById('gradient_options').style.display = 'none';
  }

  handleChangeCanvasSize = event => {
    this.reset();
    const size = Number(event.target.value) > 10000 ? 10000 : Math.abs(Math.round(Number(event.target.value)));
    this.props.ctx.canvas.height = Number(size);
    this.props.ctx.canvas.width = Number(size);
    this.props.ctx.canvas.style.height = `${Number(size)}px`;
    this.props.ctx.canvas.style.width = `${Number(size)}px`;
  }

  handleChangeColorProperty(property, event) {
    app[property] = Number(event.target.value);
    this.updateColors();
    this.updateLines();
    this.wipeCanvas();
    this.restore();
  }

  handleChangeSpeed = event => {
    const value = Number(event.target.value);
    app.speed = Number.isFinite(value) ? value : 1;
  }

  handleToggleColors = event => {
    const useColors = event.target.checked;
    app.useColors = useColors;
    this.disableGradient();
    document.getElementById('color_options').style.display = useColors ? 'flex' : 'none';
    this.wipeCanvas();
    this.restore(useColors ? null : app.lineColor);
  }

  handleToggleGradient = event => {
    const useGradient = event.target.checked;
    app.useGradient = useGradient;
    this.disableColors();
    document.getElementById('gradient_options').style.display = useGradient ? 'flex' : 'none';
    this.wipeCanvas();
    this.restore(useGradient ? null : app.lineColor);
  }

  reset = () => {
    this.stop();
    this.clear();
  }

  stop = () => {
    app.isRunning = false;
  }

  clear() {
    app.runs = 0;
    app.lines = [];
    this.wipeCanvas();
    this.resetCircles();
    this.updateColors();
    this.updateProgress();
  }

  draw = i => {
    const { ctx } = this.props;
    const { circles, colors, isRunning, lcm, lines, lineColor, runs, speed, useColors, useGradient } = app;
    if (!isRunning) return;
    if (runs === lcm) return app.isRunning = false;

    for (let n = 0; n < circles.length; n++) {
      for (let m = n + 1; m < circles.length; m++) {
        const color = colors[runs % Math.max(circles[n].steps, circles[m].steps)]
        const gradient = ctx.createLinearGradient(circles[n].x, circles[n].y, circles[m].x, circles[m].y);
        gradient.addColorStop(0, circles[n].getColor(runs));
        gradient.addColorStop(1, circles[m].getColor(runs));

        lines.push({ x1: circles[n].x, y1: circles[n].y, x2: circles[m].x, y2: circles[m].y, circle1: n, circle2: m, color, gradient });

        ctx.beginPath();
        ctx.moveTo(circles[n].x, circles[n].y);
        ctx.lineTo(circles[m].x, circles[m].y);
        ctx.strokeStyle = useGradient ? gradient : useColors ? color : lineColor;
        ctx.stroke();
      }
    }

    circles.forEach(circle => circle.step());

    app.runs++;
    this.updateProgress();
    if (i === speed - 1) requestAnimationFrame(this.run);
  }

  resetCircles() {
    app.circles.forEach(circle => circle.reset());
  }

  restore(color) {
    const { ctx } = this.props;
    const { lines, lineColor, useColors, useGradient } = app;
    lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.strokeStyle = color ? color : useGradient ? line.gradient : useColors ? line.color : lineColor;
      ctx.stroke();
    });
  }


  run = () => {
    for (var i = 0; i < app.speed; i++) this.draw(i);
  }

  start = () => {
    if (app.isRunning) return;
    app.isRunning = true;
    this.updateColors();
    requestAnimationFrame(this.run);
  }

  updateColors() {
    const { circles, fb, fg, fr, pb, pg, pr } = app;
    const numColors = Math.max(...app.circles.map(c => c.steps));
    app.colors = makeColorGradient(fr * (2*Math.PI / numColors), fg * (2*Math.PI / numColors), fb * (2*Math.PI / numColors), pr, pg, pb, undefined, undefined, numColors);
  }

  updateCircle(circle, key, event) {
    const value = event.target.value;
    circle.update({ [key]: value === "" ? 0 : Number(value) });
    this.updateLcm();
    if (['r', 'v'].includes(key)) this.reset();
  }

  updateLcm() {
    app.lcm = getLcm(app.circles.map(c => c.steps));
  }

  updateLines() {
    const { ctx } = this.props;
    const { circles, colors, lines } = app;
    this.resetCircles();
    lines.forEach((line, i) => {
      line.x1 = circles[line.circle1].x;
      line.y1 = circles[line.circle1].y;
      line.x2 = circles[line.circle2].x;
      line.y2 = circles[line.circle2].y;
      const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
      gradient.addColorStop(0, circles[line.circle1].getColor(i));
      gradient.addColorStop(1, circles[line.circle2].getColor(i));
      line.gradient = gradient;
      line.color = colors[i % Math.max(circles[line.circle1].steps, circles[line.circle2].steps)];
      if (circles.length >= 2 || (circles.length > 2 && lines[i+1].circle1 !== line.circle1 && lines[i+1].circle2 !== lines.circle1 && lines[i+1].circle2 !== line.circle1 && lines[i+1].circle2 !== line.circle2)) {
        circles[line.circle1].step();
        circles[line.circle2].step();
      }
    });
  }

  updateProgress() {
    const { lcm, runs } = app;
    const progress = Math.round(runs * 100 / lcm);
    document.getElementById('progress_inner').style.width = `${progress}%`;
    document.getElementById('progress_text').innerHTML = `${runs} / ${lcm}`;
  }

  wipeCanvas() {
    this.props.ctx.clearRect(0, 0, this.props.ctx.canvas.width, this.props.ctx.canvas.height);
  }
}
