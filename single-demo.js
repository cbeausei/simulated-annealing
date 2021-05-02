import {LitElement, html} from 'https://unpkg.com/lit-element/lit-element.js?module';

class SingleDemo extends LitElement {
  static get properties() {
    return {
    }
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <style>
        :host {
          background-color: red;
          border: solid 2px black;
          box-sizing: border-box;
        }
        *, *:before, *:after {
          box-sizing: inherit;
        }
      </style>

      <div>Demo</div>
    `
  }
}

customElements.define('single-demo', SingleDemo);
