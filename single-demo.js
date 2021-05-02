import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';

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
    setTimeout(() => this.drawData(), 1000);
    this.canvas = this.shadowRoot.getElementById('canvas');
    const width = this.canvas.clientWidth;
    console.log(width);
    const height = this.canvas.clientHeight;
    console.log(height);
    if (width === this.canvas.width || height === this.canvas.height) {
      return;
    }
    console.log('Re-draw');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = 'red';
    for (const city of this.data.cities) {
      this.ctx.beginPath();
      this.ctx.arc(width * city.x, height * city.y, 8, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(width * city.x, height * city.y, 7, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }
}

customElements.define('single-demo', SingleDemo);
