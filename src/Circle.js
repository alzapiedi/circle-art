import { angleToSteps, makeColorGradient, stepsToAngle } from 'utils';

export default class Circle {
  static keys = ['a', 'fb', 'fg', 'fr', 'p', 'pb', 'pg', 'pr', 'r', 'v', 'x', 'y'];

  constructor(options) {
    Circle.keys.forEach(key => this[key] = options[key]);

    this.colors = this.getColorGradient();
  }

  get steps() {
    return angleToSteps(this.v);
  }

  getColor(run) {
    return this.colors[run % this.steps];
  }
  
  getColorGradient() {
    const steps = this.steps;
    return makeColorGradient(this.fr*2*Math.PI/steps, this.fg*2*Math.PI/steps, this.fb*2*Math.PI/steps, this.pr, this.pg, this.pb, undefined, undefined, steps);
  }

  reset() {
    this.x = this.r * Math.cos(-Math.PI / 2 + this.p) + canvas.width / 2;
    this.y = this.r * Math.sin(-Math.PI / 2 + this.p) + canvas.height / 2;
    this.a = 0;
    return this;
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
    if (Number.isFinite(options.steps)) this.v = stepsToAngle(options.steps);
    this.colors = this.getColorGradient();
  }
}
