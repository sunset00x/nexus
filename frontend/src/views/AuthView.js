import { Component } from '../core/Component.js';
import { Button, Input, Card } from '../components/UI.js';
import { globalStore } from '../core/State.js';

export class AuthView extends Component {
  constructor(props) {
    super(props);
    this.state = { isRegister: false, error: '' };
    this.formData = { email: '', password: '', name: '' };
  }

  async handleSubmit() {
    const endpoint = this.state.isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = this.state.isRegister
      ? { email: this.formData.email, password: this.formData.password, name: this.formData.name }
      : { email: this.formData.email, password: this.formData.password };

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
      minHeight: '100vh',
      backgroundColor: 'var(--nexus-bg-primary, #0d1117)'
    };

    return this.createElement(
      'div',
      { style: wrapperStyle },
      this.createElement(
        'div',
        { style: { width: '100%', maxWidth: '400px', padding: '16px' } },
        new Card({
          title: this.state.isRegister ? 'Create Nexus Account' : 'Sign in to Nexus',
          children: [
            this.state.error
              ? this.createElement(
                  'div',
                  {
                    style: {
                      color: '#f85149',
                      backgroundColor: 'rgba(248, 81, 73, 0.1)',
                      border: '1px solid #f85149',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      fontSize: '13px',
                      marginBottom: '16px'
                    }
                  },
                  this.state.error
                )
              : null,
            this.state.isRegister
              ? new Input({
                  label: 'Full Name',
                  placeholder: 'John Doe',
                  onInput: (e) => (this.formData.name = e.target.value)
                })
              : null,
            new Input({
              label: 'Email Address',
              type: 'email',
              placeholder: 'name@example.com',
              onInput: (e) => (this.formData.email = e.target.value)
            }),
            new Input({
              label: 'Password',
              type: 'password',
              placeholder: '••••••••',
              onInput: (e) => (this.formData.password = e.target.value)
            }),
            new Button({
              text: this.state.isRegister ? 'Create Account' : 'Sign In',
              onClick: () => this.handleSubmit()
            }),
            this.createElement(
              'div',
              {
                style: {
                  marginTop: '20px',
                  fontSize: '13px',
                  color: 'var(--nexus-accent, #58a6ff)',
                  cursor: 'pointer',
                  textAlign: 'center'
                },
                onClick: () => {
                  this.formData = { email: '', password: '', name: '' };
                  this.setState({ isRegister: !this.state.isRegister, error: '' });
                }
              },
              this.state.isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register"
            )
          ]
        })
      )
    );
  }
}