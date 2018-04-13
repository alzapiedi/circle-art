import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { CANVAS_SIZE } from 'defaults';
import App from 'App';

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.canvas.height = CANVAS_SIZE;
  ctx.canvas.width = CANVAS_SIZE;
  ctx.canvas.style.height = `${CANVAS_SIZE}px`;
  ctx.canvas.style.width = `${CANVAS_SIZE}px`;
  ReactDOM.render(<App ctx={ctx} />, document.getElementById('root'));
});
