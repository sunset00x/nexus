new Card({
  title: 'Join Workspace with Code',
  children: [
    new Input({
      placeholder: 'Enter 6-digit invite code (e.g. A1B2C3)',
      value: this.state.joinCode,
      onInput: e => this.setState({ joinCode: e.target.value })
    }),
    new Button({
      text: 'Join Project Live',
      variant: 'secondary',
      onClick: async () => {
        const res = await fetch('/api/projects/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${globalStore.data.token}`
          },
          body: JSON.stringify({ code: this.state.joinCode })
        });
        const data = await res.json();
        if (res.ok) {
          this.props.router.navigate(`/projects/${data.projectId}`);
        } else {
          alert(data.message);
        }
      }
    })
  ]
})