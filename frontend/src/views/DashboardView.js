import { Component } from '../core/Component.js';
import { Card, Button, Input } from '../components/UI.js';
import { globalStore } from '../core/State.js';

export class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = { projects: [], newProjectName: '' };
  }

  async onMount() {
    this.fetchProjects();
  }

  async fetchProjects() {
    try {
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${globalStore.data.token}` }
      });
      const data = await res.json();
      if (res.ok) this.setState({ projects: data });
    } catch (err) {
      console.error(err);
    }
  }

  async createProject() {
    if (!this.state.newProjectName) return;
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${globalStore.data.token}`
        },
        body: JSON.stringify({ name: this.state.newProjectName })
      });
      if (res.ok) {
        this.setState({ newProjectName: '' });
        this.fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const layoutStyle = { padding: '32px', maxWidth: '1100px', margin: '0 auto' };
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' };

    return this.createElement(
      'div',
      { style: layoutStyle },
      this.createElement('h1', { style: { marginBottom: '8px' } }, `Welcome back, ${globalStore.data.user?.name || 'Developer'}`),
      this.createElement('p', { style: { color: 'var(--nexus-text-secondary)', marginBottom: '24px' } }, 'Nexus Real-Time Workspace Platform'),
      new Card({
        title: 'Create New Project',
        children: [
          new Input({ placeholder: 'Project Name', value: this.state.newProjectName, onInput: e => this.setState({ newProjectName: e.target.value }) }),
          new Button({ text: 'Create Workspace', onClick: () => this.createProject() })
        ]
      }),
      this.createElement('h2', { style: { marginTop: '32px', fontSize: '18px' } }, 'Active Workspaces'),
      this.createElement(
        'div',
        { style: gridStyle },
        ...this.state.projects.map(p =>
          new Card({
            title: p.name,
            children: [
              this.createElement('p', { style: { fontSize: '12px', color: 'var(--nexus-text-secondary)', marginBottom: '16px' } }, `Role: ${p.members.find(m => m.user === globalStore.data.user?.id)?.role || 'OWNER'}`),
              new Button({
                text: 'Open Workspace',
                size: 'sm',
                onClick: () => this.props.router.navigate(`/projects/${p._id}`)
              })
            ]
          })
        )
      )
    );
  }
}