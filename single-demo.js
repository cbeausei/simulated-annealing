import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';

const POINT_RAY = 4;
const DELTA_BORDER = 10;
const DRAW_DELAY_MS = 50;
const SOLVE_DELAY_MS = 10;
const SOLVE_IT = 200;

class SingleDemo extends LitElement {
  static get properties() {
    return {
      data: {type: Object},
      score: {type: Number},
      solver: {type: Object},
    }
  }

  constructor() {
    super();
    this.data = null;
    this.road = null;
    this.score = 0;
    this.started = false;
    this.solver = {type: 0};
    setTimeout(() => this.drawData(), DRAW_DELAY_MS);
    setTimeout(() => this.solve(), 2 * SOLVE_DELAY_MS);
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('data')) {
      this.initSolver();
    }
  }

  initSolver() {
    this.started = false;
    this.road = new Array();
    let score = 0;
    for (let i = 0; i < this.data.cities.length; ++i) {
      this.road.push((i + 1) % this.data.cities.length);
      score += this.dist(i, this.road[i]);
    }
    this.score = score;
  }

  startSolver() {
    this.started = true;
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
        [header] {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        [selection] {
          align-items: center;
          display: flex;
          margin-bottom: 4px;
        }
        [selection] > select {
          margin-left: 5px;
        }
      </style>

      <div container>
        <div header>
          <span>Score: ${this.score.toFixed(3)}</span>
          ${this.started ? html`
            <button @click="${this.initSolver}">Reset</button>
          ` : html`
            <button @click="${this.startSolver}">Start</button>
          `}
        </div>
        <div selection>
          <span>Neighbour function:</span>
          <select id="solver-type-select" @change="${this.solverChange}">
            <option value=0>adjacent cities swap</option>
            <option value=1>city move</option>
            <option value=2>random road swap</option>
            <option value=3>all</option>
          </select>
        </div>
        <canvas id="canvas"></canvas>
      </div>
    `
  }

  solverChange() {
    this.solver = {
      type: Number(this.shadowRoot.getElementById('solver-type-select').value),
    };
  }

  dist(a, b) {
    const cityA = this.data.cities[a];
    const cityB = this.data.cities[b];
    return Math.sqrt(Math.pow(cityA.x - cityB.x, 2) + Math.pow(cityA.y - cityB.y, 2));    
  }

  solve() {
    if (this.started) {
      for (let i = 0; i < SOLVE_IT; ++i) {
        let type = this.solver.type;
        if (type === 3) {
          type = Math.floor(Math.random() * 3);
        }
        switch (type) {
          case 0:
            this.solveNbrSwap();
            break;
          case 1:
            this.solveRndMove();
            break;
          case 2:
            this.solveRoadSwap();
            break;
          default:
            break;
        }
      }
    }
    setTimeout(() => this.solve(), SOLVE_DELAY_MS);
  }

  solveNbrSwap() {
    const z = Math.floor(Math.random() * this.road.length);
    const a = this.road[z];
    const b = this.road[a];
    const c = this.road[b];
    const eBefore = this.dist(z, a) + this.dist(b, c);
    const eAfter = this.dist(z, b) + this.dist(a, c);
    const energyReleased = eBefore - eAfter;
    if (energyReleased > 0) {
      this.road[z] = b;
      this.road[b] = a;
      this.road[a] = c;
      this.score -= energyReleased;
    }
  }

  solveRndMove() {
    const a = Math.floor(Math.random() * this.road.length);
    const b = this.road[a];
    const c = this.road[b];
    const x = Math.floor(Math.random() * this.road.length);
    const y = this.road[x];
    if (b === x || b === y) {
      return;
    }
    const eBefore = this.dist(a, b) + this.dist(b, c) + this.dist(x, y);
    const eAfter = this.dist(x, b) + this.dist(b, y) + this.dist(a, c);
    const energyReleased = eBefore - eAfter;
    if (energyReleased > 0) {
      this.road[a] = c;
      this.road[x] = b;
      this.road[b] = y;
      this.score -= energyReleased;
    }
  }

  solveRoadSwap() {
    const a = Math.floor(Math.random() * this.road.length);
    const b = this.road[a];
    const x = Math.floor(Math.random() * this.road.length);
    const y = this.road[x];
    if (a === x || a === y || b === x) {
      return;
    }
    const eBefore = this.dist(a, b) + this.dist(x, y);
    const eAfter = this.dist(a, x) + this.dist(b, y);
    const energyReleased = eBefore - eAfter;
    if (energyReleased > 0) {
      this.road[a] = x;
      let cur = b;
      let pred = y;
      while (cur != y) {
        const next = this.road[cur];
        this.road[cur] = pred;
        pred = cur;
        cur = next;
      }
      this.score -= energyReleased;
    }
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
      this.printRoad(i, this.road[i]);
    }
    setTimeout(() => this.drawData(), DRAW_DELAY_MS);
  }
}

customElements.define('single-demo', SingleDemo);
