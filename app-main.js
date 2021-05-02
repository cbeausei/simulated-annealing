import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import './single-demo.js';

class AppMain extends LitElement {
  static get properties() {
    return {
      demos: {type: Array},
      height: {type: String},
      width: {type: String},
    }
  }

  constructor() {
    super();
    this.height = '100%';
    this.width = '100%';
    this.demos = [];
  }

  render() {
    return html`
      <style>
        :host {
          background-color: beige;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 10px;
          width: 100vw;
        }
        *, *:before, *:after {
          box-sizing: inherit;
        }
        button:hover {
          cursor: pointer;
        }
        [demos] {
          display: flex;
          flex: 1;
          flex-wrap: wrap;
        }
        single-demo {
          height: ${this.height};
          width: ${this.width};
        }
      </style>

      <h1>Simulated Annealing Visualization</h1>
      <div>
        <button @click="${this.addDemo}" >Add demo</button>
      </div>
      <div demos>
        ${this.demos.map(demo => html`
          ${demo.active ? html`<single-demo></single-demo>` : html``}
        `)}
      </div>
    `
  }

  addDemo() {
    if (this.demos.length >= 9) {
      return;
    }
    this.demos.push({active: true});
    if (this.demos.length > 1) {
      this.height = '50%';
      this.width = '50%';
    }
    if (this.demos.length > 4) {
      this.width = '33.3%';
    }
    if (this.demos.length > 6) {
      this.height = '33.3%';
    }
    this.requestUpdate();
  }
}

customElements.define('app-main', AppMain);
