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
    this.newData = false;
    this.road = null;
    setTimeout(() => this.drawData(), 50);
  }

  update(changedProperties) {
    super.update(changedProperties);
    this.newData = true;
    this.road = new Array();
    for (let i = 0; i < this.data.cities.length; ++i) {
      this.road.push(i);
    }
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

  getCenter(city) {
    const centerX = (this.canvas.width - 2 * DELTA_BORDER) * city.x + DELTA_BORDER;
    const centerY = (this.canvas.height - 2 * DELTA_BORDER) * city.y + DELTA_BORDER;
    return {x: centerX, y: centerY};
  }

  printRoad(a, b) {
    const centerA = this.getCenter(this.data.cities[a]);
    const centerB = this.getCenter(this.data.cities[b]);
    this.ctx.beginPath();
    this.ctx.moveTo(centerA.x, centerA.y);
    this.ctx.lineTo(centerB.x, centerB.y);
    this.ctx.stroke();
  }

  drawData() {
    setTimeout(() => this.drawData(), 50);
    this.canvas = this.shadowRoot.getElementById('canvas');
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.newData = false;
    this.lastWidth = width;
    this.lastHeight = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = 'red';
    this.ctx.lineWidth = 2;
    for (const city of this.data.cities) {
      const {x, y} = this.getCenter(city);
      this.ctx.beginPath();
      this.ctx.arc(x, y, POINT_RAY + 1, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(x, y, POINT_RAY, 0, 2 * Math.PI);
      this.ctx.fill();
    }
    for (let i = 0; i < this.road.length; ++i) {
      this.printRoad(this.road[i], this.road[(i + 1) % this.road.length]);
    }
  }
}

customElements.define('single-demo', SingleDemo);
