import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';

const POINT_RAY = 4;
const DELTA_BORDER = 10;

class SingleDemo extends LitElement {
  static get properties() {
    return {
      data: {type: Object},
    }
  }

  constructor() {
    super();
    this.data = null;
    setTimeout(() => this.drawData(), 50);
  }

  render() {
    return html`
      <style>
        :host {
          box-sizing: border-box;
          padding: 5px;
        }
        *, *:before, *:after {
          box-sizing: inherit;
        }
        [container] {
          background-color: antiquewhite;
          border: solid 1px black;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 5px;
        }
        canvas {
          background-color: white;
          flex: 1;
          overflow: hidden;
        }
      </style>

      <div container>
        <span>Demo</span>
        <canvas id="canvas"></canvas>
      </div>
    `
  }

  drawData() {
    setTimeout(() => this.drawData(), 50);
    this.canvas = this.shadowRoot.getElementById('canvas');
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width === this.lastWidth && height === this.lastHeight) {
      return;
    }
    this.lastWidth = width;
    this.lastHeight = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = 'red';
    for (const city of this.data.cities) {
      const centerX = (width - 2 * DELTA_BORDER) * city.x + DELTA_BORDER;
      const centerY = (height - 2 * DELTA_BORDER) * city.y + DELTA_BORDER;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, POINT_RAY + 1, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(centerX,  centerY, POINT_RAY, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }
}

customElements.define('single-demo', SingleDemo);
