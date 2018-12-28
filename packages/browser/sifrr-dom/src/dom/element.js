const Parser = require('./parser');
const JsonExt = require('../utils/json');
const Loader = require('./loader');
const SimpleElement = require('./simpleelement');

function elementClassFactory(BaseClass = window.HTMLElement) {
  return class Element extends BaseClass {
    static extends(BaseClass) {
      return elementClassFactory(BaseClass);
    }

    static get observedAttributes() {
      return ['data-sifrr-state'].concat(this.observedAttrs());
    }

    static observedAttrs() {
      return [];
    }

    static get template() {
      return Loader.all[this.elementName].template;
    }

    static get stateMap() {
      this._stateMap = this._stateMap || Parser.createStateMap(this.template.content);
      return this._stateMap;
    }

    static get elementName() {
      return this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    static onStateChange() {}

    constructor() {
      super();
      // this._oldState = {};
      this._state = Object.assign({}, this.constructor.defaultState, this.state);
      const content = this.constructor.template.content.cloneNode(true);
      this._refs = Parser.collectRefs(content, this.constructor.stateMap);
      this.useShadowRoot = this.constructor.template.dataset.sr === 'false' ? false : !!window.document.head.attachShadow && this.constructor.useShadowRoot;
      if (this.useShadowRoot) {
        this.attachShadow({
          mode: 'open'
        });
        this.shadowRoot.appendChild(content);
        this.shadowRoot.addEventListener('change', Parser.twoWayBind);
      } else this.appendChild(content);
    }

    connectedCallback() {
      if(!this.hasAttribute('data-sifrr-state')) this.updateState();
      this.onConnect();
    }

    onConnect() {}

    disconnectedCallback() {
      if (this.useShadowRoot) this.shadowRoot.removeEventListener('change', Parser.twoWayBind);
      this.onDisconnect();
    }

    onDisconnect() {}

    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName === 'data-sifrr-state') {
        this.state = JsonExt.parse(newVal);
      }
      this.onAttributeChange(attrName, oldVal, newVal);
    }

    onAttributeChange() {}

    get state() {
      // return JsonExt.deepClone(this._state);
      return this._state;
    }

    set state(v) {
      // this._oldState = this.state;
      Object.assign(this._state, v);
      this.updateState();
    }

    updateState() {
      Parser.updateState(this);
      this.onStateChange();
      this.constructor.onStateChange(this);
    }

    onStateChange() {}

    isSifrr(name = null) {
      if (name) return name === this.constructor.elementName;
      else return true;
    }

    sifrrClone(deep) {
      const clone = this.cloneNode(deep);
      clone.state = this.state;
      return clone;
    }

    clearState() {
      // this._oldState = this.state;
      this._state = {};
      this.updateState();
    }

    qs(args, sr = true) {
      if (this.useShadowRoot && sr) return this.shadowRoot.querySelector(args);
      else return this.querySelector(args);
    }

    qsAll(args, sr = true) {
      if (this.useShadowRoot && sr) return this.shadowRoot.querySelectorAll(args);
      else return this.querySelectorAll(args);
    }

    static addArrayToDom(key, template) {
      this._arrayToDom = this._arrayToDom || {};
      // state of simple element is single array item, compatible with sifrr element
      this._arrayToDom[key] = SimpleElement(template);
    }

    arrayToDom(key, newState = this.state[key]) {
      this._domL = this._domL || {};
      const oldL = this._domL[key] || 0;
      const domArray = [];
      const newL = newState.length;
      for (let i = 0; i < newL; i++) {
        if (i < oldL) {
          domArray.push({ type: 'stateChange', state: newState[i] });
        } else {
          const el = this.constructor._arrayToDom[key].sifrrClone(true);
          el.state = newState[i];
          domArray.push(el);
        }
      }
      this._domL[key] = newL;
      return domArray;
    }
  };
}

module.exports = elementClassFactory();