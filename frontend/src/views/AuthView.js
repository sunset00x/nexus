import { Component } from '../core/Component.js';
import { Button, Input, Card } from '../components/UI.js';
import { globalStore } from '../core/State.js';

export class AuthView extends Component {
  constructor(props) {
    super(props);
    this.state = { isRegister: false, email: '', password: '', name: '', error: '' };
  }

  async handleSubmit() {
    const endpoint = this.state.isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = this.state.isRegister
      ? { email: this.state.email, password: this.state.password, name: this.state.name }
      : { email: this.state.email, password: this.state.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      localStorage.setItem('nexus_token', data.token);
      localStorage.setItem('nexus_user', JSON.stringify(data.user));
      globalStore.setState({ token: data.token, user: data.user });
      this.props.router.navigate('/dashboard');
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  render() {
    const wrapperStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'var(--nexus-bg-primary)'
    };

    return this.createElement(
      'div',
      { style: wrapperStyle },
      this.createElement(
        'div',
        { style: { width: '380px' } },
        new Card({
          title: this.state.isRegister ? 'Create Nexus Account' : 'Login to Nexus',
          children: [
            this.state.error ? this.createElement('div', { style: { color: 'var(--nexus-danger)', fontSize: '12px', marginBottom: '12px' } }, this.state.error) : null,
            this.state.isRegister ? new Input({ label: 'Full Name', onInput: e => this.setState({ name: e.target.value }) }) : null,
            new Input({ label: 'Email', type: 'email', onInput: e => this.setState({ email: e.target.value }) }),
            new Input({ label: 'Password', type: 'password', onInput: e => this.setState({ password: e.target.value }) }),
            new Button({ text: this.state.isRegister ? 'Register' : 'Login', onClick: () => this.handleSubmit() }),
            this.createElement('div', {
              style: { marginTop: '16px', fontSize: '12px', color: 'var(--nexus-accent)', cursor: 'pointer', textAlign: 'center' },
              onClick: () => this.setState({ isRegister: !this.state.isRegister, error: '' })
            }, this.state.isRegister ? 'Already have an account? Login' : "Don't have an account? Register")
          ]
        })
      )
    );
  }
}