/**
 * Dynamic Component Foundation with Lifecycle & Event Handling Fixes
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
      if (val === null || val === undefined) return;

      // Ensure event listeners (onClick, onInput, etc.) attach reliably
      if (key.startsWith('on') && typeof val === 'function') {
        const eventName = key.substring(2).toLowerCase();
        el.addEventListener(eventName, val);
      } else if (key === 'style' && typeof val === 'object') {
        Object.assign(el.style, val);
      } else if (key === 'className') {
        el.className = val;
      } else {
        el.setAttribute(key, val);
      }
    });

    children.flat().forEach(child => {
      if (child === null || child === undefined) return;
      if (child instanceof Component) {
        el.appendChild(child.render());
      } else if (child instanceof Node) {
        el.appendChild(child);
      } else {
        el.appendChild(document.createTextNode(String(child)));
      }
    });

    return el;
  }

  render() {
    throw new Error('render() must be implemented');
  }

  mount(parent) {
    this.element = this.render();
    parent.appendChild(this.element);
    this.onMount();
    return this.element;
  }

  update() {
    if (!this.element || !this.element.parentNode) return;
    const oldElement = this.element;
    const newElement = this.render();
    oldElement.parentNode.replaceChild(newElement, oldElement);
    this.element = newElement;
    this.onUpdate();
  }

  onMount() {}
  onUpdate() {}
}