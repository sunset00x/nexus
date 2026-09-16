import { Component } from '../core/Component.js';

export class Button extends Component {
  render() {
    const { text, variant = 'primary', onClick, size = 'md' } = this.props;
    const styles = {
      padding: size === 'sm' ? '6px 12px' : '10px 18px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: size === 'sm' ? '12px' : '14px',
      backgroundColor: variant === 'primary' ? 'var(--nexus-accent)' : 'var(--nexus-bg-tertiary)',
      color: 'var(--nexus-text-primary)',
      transition: 'opacity 0.2s'
    };
    return this.createElement('button', { style: styles, onClick }, text);
  }
}

export class Input extends Component {
  render() {
    const { label, type = 'text', value = '', onInput, placeholder = '' } = this.props;
    const inputStyle = {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      backgroundColor: 'var(--nexus-bg-primary)',
      border: '1px solid var(--nexus-border)',
      color: 'var(--nexus-text-primary)',
      outline: 'none',
      marginBottom: '12px'
    };

    const container = this.createElement('div', { style: { width: '100%' } });
    if (label) {
      container.appendChild(this.createElement('label', {
        style: { display: 'block', fontSize: '12px', color: 'var(--nexus-text-secondary)', marginBottom: '4px' }
      }, label));
    }
    container.appendChild(this.createElement('input', { type, value, placeholder, onInput, style: inputStyle }));
    return container;
  }
}

export class Card extends Component {
  render() {
    const { title, children } = this.props;
    const cardStyle = {
      backgroundColor: 'var(--nexus-bg-secondary)',
      border: '1px solid var(--nexus-border)',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px'
    };
    return this.createElement(
      'div',
      { style: cardStyle },
      title ? this.createElement('h3', { style: { marginBottom: '16px', fontSize: '16px' } }, title) : null,
      children
    );
  }
}