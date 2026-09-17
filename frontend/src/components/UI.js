import { Component } from '../core/Component.js';

export class Button extends Component {
  render() {
    const { text, variant = 'primary', onClick, size = 'md', type = 'button' } = this.props;

    const styles = {
      width: '100%',
      padding: size === 'sm' ? '8px 14px' : '12px 20px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: size === 'sm' ? '13px' : '14px',
      backgroundColor: variant === 'primary' ? 'var(--nexus-accent, #58a6ff)' : 'var(--nexus-bg-tertiary, #21262d)',
      color: 'var(--nexus-text-primary, #ffffff)',
      marginTop: '12px',
      transition: 'background-color 0.2s ease',
      display: 'inline-block',
      textAlign: 'center'
    };

    return this.createElement('button', { type, style: styles, onClick }, text);
  }
}

export class Input extends Component {
  render() {
    const { label, type = 'text', value = '', onInput, placeholder = '', id } = this.props;

    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginBottom: '16px'
    };

    const labelStyle = {
      fontSize: '13px',
      fontWeight: '500',
      color: 'var(--nexus-text-secondary, #8b949e)',
      marginBottom: '6px'
    };

    const inputStyle = {
      width: '100%',
      height: '40px',
      padding: '0 12px',
      borderRadius: '6px',
      backgroundColor: 'var(--nexus-bg-primary, #0d1117)',
      border: '1px solid var(--nexus-border, #30363d)',
      color: 'var(--nexus-text-primary, #c9d1d9)',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box'
    };

    const attr = {
      type,
      placeholder,
      onInput,
      style: inputStyle
    };

    if (id) attr.id = id;
    if (value !== undefined) attr.value = value;

    const inputEl = this.createElement('input', attr);

    if (label) {
      const labelEl = this.createElement('label', { style: labelStyle }, label);
      return this.createElement('div', { style: containerStyle }, labelEl, inputEl);
    }

    return inputEl;
  }
}

export class Card extends Component {
  render() {
    const { title, children } = this.props;
    const cardStyle = {
      backgroundColor: 'var(--nexus-bg-secondary, #161b22)',
      border: '1px solid var(--nexus-border, #30363d)',
      borderRadius: '10px',
      padding: '28px',
      width: '100%',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
    };
    return this.createElement(
      'div',
      { style: cardStyle },
      title ? this.createElement('h2', { style: { marginBottom: '20px', fontSize: '20px', fontWeight: '600' } }, title) : null,
      children
    );
  }
}