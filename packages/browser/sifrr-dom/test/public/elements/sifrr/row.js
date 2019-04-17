// import SifrrDom from '@sifrr/dom';
// const Sifrr = { Dom: SifrrDom };

const template = `<td class='col-md-1'>\${this.state.id}</td>
<td class='col-md-4'><a class='lbl'>\${this.state.label}</a></td>
<td class='col-md-1'><a class='remove'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td>
<td class='col-md-6'></td>`;
class SifrrRow extends Sifrr.Dom.Element.extends(HTMLTableRowElement) {
  static get useShadowRoot() {
    return false;
  }

  static get template() {
    return template;
  }

  onUpdate() {
    if (!this._state.class) {
      if (this.className) this.removeAttribute('class');
    } else if (this.className !== this._state.class) {
      this.className = this.state.class;
    }
  }
}
Sifrr.Dom.register(SifrrRow, {
  extends: 'tr'
});
