renderInviteModal() {
  const inviteCode = this.state.project?.inviteCode || 'NEXUS1';
  const joinUrl = `${window.location.origin}/join/${inviteCode}`;
  
  // Dynamic QR Code generation using public API without external libraries
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(joinUrl)}`;

  const modalStyle = {
    backgroundColor: 'var(--nexus-bg-secondary)',
    border: '1px solid var(--nexus-border)',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const codeBoxStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    color: 'var(--nexus-accent)',
    backgroundColor: 'var(--nexus-bg-primary)',
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px dashed var(--nexus-accent)'
  };

  return this.createElement(
    'div',
    { style: modalStyle },
    this.createElement('h3', {}, 'Live Invite & QR Join'),
    this.createElement('img', { src: qrApiUrl, alt: 'Scan QR to Join', style: { borderRadius: '6px' } }),
    this.createElement('p', { style: { fontSize: '12px', color: 'var(--nexus-text-secondary)' } }, 'Scan QR code with phone camera to join workspace instantly'),
    this.createElement('div', { style: codeBoxStyle }, inviteCode),
    new Button({
      text: 'Copy Invite Link',
      size: 'sm',
      onClick: () => {
        navigator.clipboard.writeText(joinUrl);
        alert('Invite URL copied to clipboard!');
      }
    })
  );
}