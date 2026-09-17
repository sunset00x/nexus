import { Component } from '../core/Component.js';
import { Card, Button, Input } from '../components/UI.js';
import { CodeEditor } from '../components/Editor.js';
import { globalStore } from '../core/State.js';

export class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      activeTab: 'kanban',
      tasks: [],
      newTaskTitle: '',
      messages: [],
      chatInput: '',
      socket: null
    };
  }

  onMount() {
    this.fetchProjectDetails();
    this.initWebSocket();
  }

  async fetchProjectDetails() {
    const id = this.props.params.id;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${globalStore.data.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        this.setState({ project: data.project, tasks: data.tasks || [] });
      }
    } catch (err) {
      console.error(err);
    }
  }

  initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'JOIN_PROJECT', projectId: this.props.params.id }));
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'CHAT_MESSAGE') {
        this.setState({ messages: [...this.state.messages, msg.payload] });
      } else if (msg.type === 'TASK_CREATED') {
        this.setState({ tasks: [...this.state.tasks, msg.payload] });
      }
    };
    this.setState({ socket: ws });
  }

  async addTask() {
    if (!this.state.newTaskTitle) return;
    const payload = { title: this.state.newTaskTitle, status: 'TODO', projectId: this.props.params.id };
    try {
      const res = await fetch(`/api/projects/${this.props.params.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${globalStore.data.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        this.state.socket?.send(JSON.stringify({ type: 'CREATE_TASK', projectId: this.props.params.id, task: data }));
        this.setState({ newTaskTitle: '' });
      }
    } catch (err) {
      console.error(err);
    }
  }

  sendMessage() {
    if (!this.state.chatInput) return;
    const msgData = {
      sender: globalStore.data.user?.name || 'Anonymous',
      text: this.state.chatInput,
      timestamp: new Date().toLocaleTimeString()
    };
    this.state.socket?.send(JSON.stringify({ type: 'SEND_CHAT', projectId: this.props.params.id, message: msgData }));
    this.setState({ chatInput: '' });
  }

  renderKanban() {
    const columns = ['TODO', 'IN_PROGRESS', 'CODE_REVIEW', 'DONE'];
    return this.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
      new Card({
        title: 'Add New Task',
        children: [
          new Input({
            placeholder: 'Task title...',
            value: this.state.newTaskTitle,
            onInput: (e) => (this.state.newTaskTitle = e.target.value)
          }),
          new Button({ text: 'Add Task', onClick: () => this.addTask() })
        ]
      }),
      this.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' } },
        ...columns.map((status) =>
          this.createElement(
            'div',
            { style: { backgroundColor: 'var(--nexus-bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--nexus-border)' } },
            this.createElement('h4', { style: { marginBottom: '12px', fontSize: '13px', color: 'var(--nexus-text-secondary)' } }, status),
            ...this.state.tasks.filter((t) => t.status === status).map((t) =>
              this.createElement('div', {
                style: { backgroundColor: 'var(--nexus-bg-primary)', padding: '10px', borderRadius: '4px', marginBottom: '8px', border: '1px solid var(--nexus-border)' }
              }, t.title)
            )
          )
        )
      )
    );
  }

  renderChat() {
    return this.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', height: '500px', backgroundColor: 'var(--nexus-bg-secondary)', borderRadius: '8px', padding: '16px' } },
      this.createElement(
        'div',
        { style: { flex: 1, overflowY: 'auto', marginBottom: '16px' } },
        ...this.state.messages.map((m) =>
          this.createElement('div', { style: { marginBottom: '8px', fontSize: '13px' } },
            this.createElement('strong', { style: { color: 'var(--nexus-accent)' } }, `${m.sender}: `),
            m.text
          )
        )
      ),
      this.createElement(
        'div',
        { style: { display: 'flex', gap: '8px' } },
        new Input({
          placeholder: 'Type real-time message...',
          value: this.state.chatInput,
          onInput: (e) => (this.state.chatInput = e.target.value)
        }),
        new Button({ text: 'Send', onClick: () => this.sendMessage() })
      )
    );
  }

  renderTabContent() {
    if (this.state.activeTab === 'kanban') return this.renderKanban();
    if (this.state.activeTab === 'editor') return new CodeEditor().render();
    if (this.state.activeTab === 'chat') return this.renderChat();
    return null;
  }

  render() {
    const layoutStyle = { padding: '24px' };
    const navStyle = { display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--nexus-border)', paddingBottom: '12px' };

    return this.createElement(
      'div',
      { style: layoutStyle },
      this.createElement('h2', { style: { marginBottom: '16px' } }, this.state.project?.name || 'Workspace'),
      this.createElement(
        'div',
        { style: navStyle },
        ['kanban', 'editor', 'chat'].map((tab) =>
          new Button({
            text: tab.toUpperCase(),
            variant: this.state.activeTab === tab ? 'primary' : 'secondary',
            size: 'sm',
            onClick: () => this.setState({ activeTab: tab })
          })
        )
      ),
      this.renderTabContent()
    );
  }
}