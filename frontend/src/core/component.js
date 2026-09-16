/**
 * Dynamic Component Foundation with Lifecycle Handling
 */
export class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.element = null;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update();
  }

  createElement(tag, attributes = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(attributes).forEach(([key, val]) => {
      if (key.startsWith('on') && typeof val === 'function') {
        el.addEventListener(key.substring(2).toLowerCase(), val);
      } else if (key === 'style' && typeof val === 'object') {
        Object.assign(el.style, val);
      } else if (key === 'className') {
        el.className = val;
      } else {
        el.setAttribute(key, val);
      }
    });

    children.flat().forEach(child => {
      if (child == null) return;
      if (child instanceof Component) el.appendChild(child.render());
      else if (child instanceof Node) el.appendChild(child);
      else el.appendChild(document.createTextNode(String(child)));
    });

    return el;
  }

  render() { throw new Error('render() must be implemented'); }

  mount(parent) {
    this.element = this.render();
    parent.appendChild(this.element);
    this.onMount();
    return this.element;
  }

  update() {
    if (!this.element || !this.element.parentNode) return;
    const old = this.element;
    const fresh = this.render();
    old.parentNode.replaceChild(fresh, old);
    this.element = fresh;
    this.onUpdate();
  }

  onMount() {}
  onUpdate() {}
}