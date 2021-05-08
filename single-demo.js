import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';

const POINT_RAY = 4;
const DELTA_BORDER = 10;
const DRAW_DELAY_MS = 50;
const SOLVE_DELAY_MS = 100;

class SingleDemo extends LitElement {
  static get properties() {
    return {
      data: {type: Object},
      score: {type: Number},
    }
  }

  constructor() {
    super();
    this.data = null;
    this.newData = false;
    this.road = null;
    this.score = 0;
    setTimeout(() => this.drawData(), DRAW_DELAY_MS);
    setTimeout(() => this.solve(), 2 * SOLVE_DELAY_MS);
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (!changedProperties.has('data')) {
      return;
    }
    this.newData = true;
    this.road = new Array();
    let score = 0;
    for (let i = 0; i < this.data.cities.length; ++i) {
      this.road.push(i);
      score += this.dist(i, (i + 1) % this.data.cities.length);
    }
    this.score = score;
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
        <span>Score: ${this.score}</span>
        <canvas id="canvas"></canvas>
      </div>
    `
  }

  dist(a, b) {
    const cityA = this.data.cities[a];
    const cityB = this.data.cities[b];
    return Math.sqrt(Math.pow(cityA.x - cityB.x, 2) + Math.pow(cityA.y - cityB.y, 2));    
  }

  solve() {
    if (this.road?.length) {
      const a = Math.floor(Math.random() * this.road.length);
      const b = (a + 1) % this.road.length;
      const z = (a + this.road.length - 1) % this.road.length;
      const c = (b + 1) % this.road.length;
      const eBefore = this.dist(this.road[z], this.road[a]) + this.dist(this.road[b], this.road[c]);
      const eAfter = this.dist(this.road[z], this.road[b]) + this.dist(this.road[a], this.road[c]);
      const energyReleased = eBefore - eAfter;
      if (energyReleased > 0) {
        const tmp = this.road[a];
        this.road[a] = this.road[b];
        this.road[b] = tmp;
        this.score -= energyReleased;
      }
    }
    setTimeout(() => this.solve(), SOLVE_DELAY_MS);
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
    setTimeout(() => this.drawData(), DRAW_DELAY_MS);
  }
}

customElements.define('single-demo', SingleDemo);
