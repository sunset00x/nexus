/**
 * Single-Page Application Client Router
 */
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentView = null;
    this.container = null;
    window.addEventListener('popstate', () => this.handleRoute());
  }

  init(container) {
    this.container = container;
    this.handleRoute();
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    let match = null;
    let params = {};

    for (const route of this.routes) {
      const routeParts = route.path.split('/').filter(Boolean);
      const pathParts = path.split('/').filter(Boolean);
      if (routeParts.length !== pathParts.length) continue;

      let isMatch = true;
      const currentParams = {};
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          currentParams[routeParts[i].substring(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        match = route;
        params = currentParams;
        break;
      }
    }

    if (!match) {
      const fallback = this.routes.find(r => r.path === '/dashboard') || this.routes[0];
      return this.navigate(fallback.path);
    }

    this.container.innerHTML = '';
    const view = new match.component({ router: this, params });
    view.mount(this.container);
  }
}