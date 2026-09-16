/**
 * Dynamic CSS-in-JS Style Engine & Theme Controller
 */
export const Themes = {
  dark: {
    bgPrimary: '#0d1117',
    bgSecondary: '#161b22',
    bgTertiary: '#21262d',
    border: '#30363d',
    textPrimary: '#c9d1d9',
    textSecondary: '#8b949e',
    accent: '#58a6ff',
    accentHover: '#1f6feb',
    danger: '#f85149',
    success: '#2ea043',
    warning: '#d29922',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: 'Consolas, Monaco, "Courier New", monospace'
  }
};

class StyleEngine {
  constructor() {
    this.styleTag = document.createElement('style');
    this.styleTag.id = 'nexus-dynamic-styles';
    document.head.appendChild(this.styleTag);
    this.initGlobal();
  }

  initGlobal() {
    let css = ':root {\n';
    Object.entries(Themes.dark).forEach(([k, v]) => {
      css += `  --nexus-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};\n`;
    });
    css += '}\n';
    css += `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: var(--nexus-bg-primary); color: var(--nexus-text-primary); font-family: var(--nexus-font-family); }
      button, input, textarea, select { font-family: inherit; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: var(--nexus-bg-primary); }
      ::-webkit-scrollbar-thumb { background: var(--nexus-bg-tertiary); border-radius: 4px; }
    `;
    this.styleTag.textContent = css;
  }
}

export const styleEngine = new StyleEngine();