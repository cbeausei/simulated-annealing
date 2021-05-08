import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';
import './single-demo.js';
import {TravellingSalesman} from './travelling-salesman.js';

class AppMain extends LitElement {
  static get properties() {
    return {
      demos: {type: Array},
      height: {type: String},
      width: {type: String},
      problem: {type: String},
      data: {type: Object},
      dataError: {type: String},
    }
  }

  constructor() {
    super();
    this.height = '100%';
    this.width = '100%';
    this.problem = null;
    this.data = null;
    this.demos = [];
    this.dataError = null;
    this.problems = [
      {name: 'travelling-salesman', instance: new TravellingSalesman()},
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
          margin-top: 10px;
          overflow: hidden;
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
          <option selected>Select a problem</option>
          ${this.problems.map((problem, i) => html`
            <option value=${i}>${problem.name}</option>
          `)}
        </select>
        <div ?hide=${!this.problem}>
          <div>
            <span>Number of cities:</span>
            <input id="nb-cities-select" value=20>
          </div>
          <div>
            <span>Number of clusters:</span>
            <input id="nb-clusters-select" value=3>
          </div>
          <div>
            <span>Cluster ray:</span>
            <input id="cluster-ray-select" value=0.1>
          </div>
          <div>
            <button @click="${this.generateData}">Generate data</button>
          </div>
          ${this.dataError ? html`
            <div error>
              <span>${this.dataError}</span>
            </div>
          ` : html``}
          <div ?hide=${!this.data}>
            <button @click="${this.addDemo}">Add demo</button>
          </div>
        </div>
      </div>
      <div demos ?hide=${!this.problem || !this.data}>
        ${this.demos.map(demo => html`
          ${demo.active ? html`
            <single-demo data=${JSON.stringify(this.data)}>
            </single-demo>
          ` : html``}
        `)}
      </div>
    `
  }

  onProblemSelection() {
    const problemId = Number(this.shadowRoot.getElementById('problem-select').value);
    if (isNaN(problemId)) {
      this.problem = null;
    } else {
      this.problem = this.problems[problemId];
    }
  }

  generateData() {
    try {
      this.dataError = null;
      let params = {};
      switch (this.problem.name) {
        case 'travelling-salesman':
          params.nbCities = Number(this.shadowRoot.getElementById('nb-cities-select').value);
          params.nbClusters = Number(this.shadowRoot.getElementById('nb-clusters-select').value);
          params.clusterRay = Number(this.shadowRoot.getElementById('cluster-ray-select').value);
          break;
        default:
          throw new Error(`Unsupported problem: ${this.problem.name}`);
      }
      this.data = this.problem.instance.generateData(params);
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
