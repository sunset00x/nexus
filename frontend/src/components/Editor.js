import { Component } from '../core/Component.js';

export class CodeEditor extends Component {
  constructor(props = {}) {
    super(props);
    this.state = {
      code: props.code || '// Nexus Live Editor\nconsole.log("Hello Nexus Platform!");',
      output: ''
    };
  }

  runCode() {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' '));
      originalLog.apply(console, args);
    };

    try {
      const execute = new Function(this.state.code);
      execute();
      this.setState({ output: logs.join('\n') || 'Executed successfully with no output.' });
    } catch (err) {
      this.setState({ output: `Runtime Error: ${err.message}` });
    } finally {
      console.log = originalLog;
    }
  }

  render() {
    const editorStyle = {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      height: '400px',
      backgroundColor: 'var(--nexus-bg-secondary, #161b22)',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid var(--nexus-border, #30363d)'
    };

    const textareaStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--nexus-bg-primary, #0d1117)',
      color: 'var(--nexus-accent, #58a6ff)',
      fontFamily: 'monospace',
      fontSize: '14px',
      padding: '12px',
      border: '1px solid var(--nexus-border, #30363d)',
      borderRadius: '6px',
      outline: 'none',
      resize: 'none',
      boxSizing: 'border-box'
    };

    const consoleStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontSize: '13px',
      padding: '12px',
      borderRadius: '6px',
      overflowY: 'auto',
      boxSizing: 'border-box'
    };

    const runBtnStyle = {
      alignSelf: 'flex-start',
      padding: '8px 16px',
      backgroundColor: 'var(--nexus-success, #2ea043)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      marginBottom: '12px'
    };

    return this.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', width: '100%' } },
      this.createElement('button', { style: runBtnStyle, onClick: () => this.runCode() }, '▶ Run Code'),
      this.createElement(
        'div',
        { style: editorStyle },
        this.createElement('textarea', {
          style: textareaStyle,
          value: this.state.code,
          onInput: (e) => (this.state.code = e.target.value)
        }),
        this.createElement('div', { style: consoleStyle },
          this.createElement('div', { style: { color: '#8b949e', marginBottom: '8px' } }, '[Console Output]'),
          this.createElement('pre', {}, this.state.output)
        )
      )
    );
  }
}