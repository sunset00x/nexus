import { Component } from '../core/Component.js';

/**
 * Pure JavaScript VS Code-like Code Editor with Live Execution Preview
 */
export class CodeEditor extends Component {
  constructor(props) {
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
      height: '500px',
      backgroundColor: 'var(--nexus-bg-secondary)',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid var(--nexus-border)'
    };

    const textareaStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--nexus-bg-primary)',
      color: 'var(--nexus-accent)',
      fontFamily: 'var(--nexus-font-mono)',
      fontSize: '14px',
      padding: '12px',
      border: '1px solid var(--nexus-border)',
      borderRadius: '6px',
      outline: 'none',
      resize: 'none'
    };

    const consoleStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      color: '#00ff00',
      fontFamily: 'var(--nexus-font-mono)',
      fontSize: '13px',
      padding: '12px',
      borderRadius: '6px',
      overflowY: 'auto'
    };

    return this.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' } },
      this.createElement('button', {
        style: {
          alignSelf: 'flex-start',
          padding: '8px 16px',
          backgroundColor: 'var(--nexus-success)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '600'
        },
        onClick: () => this.runCode()
      }, '▶ Run Code'),
      this.createElement(
        'div',
        { style: editorStyle },
        this.createElement('textarea', {
          style: textareaStyle,
          value: this.state.code,
          onInput: (e) => this.setState({ code: e.target.value })
        }),
        this.createElement('div', { style: consoleStyle },
          this.createElement('div', { style: { color: 'var(--nexus-text-secondary)', marginBottom: '8px' } }, '[Console Output]'),
          this.createElement('pre', {}, this.state.output)
        )
      )
    );
  }
}