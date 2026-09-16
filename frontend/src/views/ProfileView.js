import { Component } from '../core/Component.js';
import { Card, Button } from '../components/UI.js';
import { globalStore } from '../core/State.js';

export class ProfileView extends Component {
  logout() {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    globalStore.setState({ user: null, token: null });
    this.props.router.navigate('/login');
  }

  render() {
    const user = globalStore.data.user;
    return this.createElement(
      'div',
      { style: { padding: '32px', maxWidth: '600px', margin: '0 auto' } },
      new Card({
        title: 'User Profile',
        children: [
          this.createElement('p', { style: { marginBottom: '8px' } }, `Name: ${user?.name}`),
          this.createElement('p', { style: { marginBottom: '16px' } }, `Email: ${user?.email}`),
          new Button({ text: 'Logout', variant: 'secondary', onClick: () => this.logout() })
        ]
      })
    );
  }
}