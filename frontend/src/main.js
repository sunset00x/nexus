import { styleEngine } from './core/StyleEngine.js';
import { Router } from './core/Router.js';
import { AuthView } from './views/AuthView.js';
import { DashboardView } from './views/DashboardView.js';
import { ProjectView } from './views/ProjectView.js';
import { ProfileView } from './views/ProfileView.js';
import { globalStore } from './core/State.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.createElement('div');
  root.id = 'app';
  document.body.appendChild(root);

  const routes = [
    { path: '/login', component: AuthView },
    { path: '/dashboard', component: DashboardView },
    { path: '/projects/:id', component: ProjectView },
    { path: '/profile', component: ProfileView }
  ];

  const router = new Router(routes);

  if (!globalStore.data.token && window.location.pathname !== '/login') {
    router.navigate('/login');
  } else {
    router.init(root);
  }
});