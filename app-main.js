import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import './single-demo.js';

class AppMain extends LitElement {
  static get properties() {
    return {
      demos: {type: Array},
      height: {type: String},
      width: {type: String},
      problem: {type: String},
      data: {type: Object},
    }
  }

  constructor() {
    super();
    this.height = '100%';
    this.width = '100%';
    this.problem = null;
    this.data = null;
    this.demos = [];
    this.problems = [
      'travelling-salesman',
    ]
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
        [error] {
          color: red;
        }
        [hide] {
          display: none;
        }
      </style>

      <h1>Simulated Annealing Visualization</h1>
      <div problem>
        <select id="problem-select" @change="${this.onProblemSelection}">
          <option value=null selected>Select a problem</option>
          ${this.problems.map(problem => html`
            <option>${problem}</option>
          `)}
        </select>
        <div>
          <div>
            <span>Number of cities:</span>
            <input id="nb-cities-select">
          </div>
          <div>
            <span>Number of clusters:</span>
            <input id="nb-clusters-select">
          </div>
          <div>
            <span>Cluster ray:</span>
            <input id="cluster-ray-select">
          </div>
          <div>
            <button @click="${this.generateData}">Generate data</button>
          </div>
          ${this.dataError ? html`
            <div error>
              <span>${dataError}</span>
            </div>
          ` : html``}
          <div ?hide=${!this.data}>
            <button @click="${this.addDemo}">Add demo</button>
          </div>
        </div>
      </div>
      <div demos ?hide=${!this.problem || !this.data}>
        ${this.demos.map(demo => html`
          ${demo.active ? html`<single-demo></single-demo>` : html``}
        `)}
      </div>
    `
  }

  onProblemSelection() {
    const value = this.shadowRoot.getElementById('problem-select').value;
    if (value === 'null') {
      this.problem = null;
    } else {
      this.problem = value;
    }
  }

  generateData() {
    try {
      const nbCities = Number(this.shadowRoot.getElementById('nb-cities-select').value);
      const nbClusters = Number(this.shadowRoot.getElementById('nb-clusters-select').value);
      const clusterRay = Number(this.shadowRoot.getElementById('cluster-ray-select').value);
    } catch (error) {
      this.dataError = error;
    }
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
