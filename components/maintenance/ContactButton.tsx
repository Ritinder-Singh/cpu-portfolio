'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus('sent');
        setName(''); setEmail(''); setMessage('');
        setTimeout(() => { setStatus('idle'); setOpen(false); }, 2500);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const input: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: '#383a59', border: '1px solid #44475a',
    color: '#f8f8f2', padding: '8px 12px', borderRadius: 5,
    fontFamily: 'inherit', fontSize: 13, outline: 'none',
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          marginTop: 24, padding: '9px 20px',
          background: 'transparent', border: '1px solid #bd93f9',
          color: '#bd93f9', borderRadius: 5, fontFamily: 'inherit',
          fontSize: 13, cursor: 'pointer', letterSpacing: '0.02em',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = '#bd93f9';
          (e.currentTarget as HTMLButtonElement).style.color = '#282a36';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = '#bd93f9';
        }}
      >
        ✉ get in touch
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', zIndex: 100, backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#282a36', border: '1px solid #44475a',
              borderRadius: 8, width: '100%', maxWidth: 420,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              overflow: 'hidden',
            }}
          >
            {/* title bar */}
            <div style={{
              background: '#383a59', borderBottom: '1px solid #44475a',
              padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ color: '#6272a4', fontSize: 12 }}>contact — new message</span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: '#6272a4', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}
              >×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ color: '#6272a4', fontSize: 12, display: 'block', marginBottom: 4 }}>name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={input} required />
              </div>
              <div>
                <label style={{ color: '#6272a4', fontSize: 12, display: 'block', marginBottom: 4 }}>email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={input} required />
              </div>
              <div>
                <label style={{ color: '#6272a4', fontSize: 12, display: 'block', marginBottom: 4 }}>message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="What's on your mind?" rows={4} style={{ ...input, resize: 'vertical' }} required />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'sent'}
                  style={{
                    padding: '9px 20px', background: '#6272a4', border: 'none',
                    color: '#f8f8f2', borderRadius: 5, fontFamily: 'inherit',
                    fontSize: 13, cursor: status === 'sending' ? 'wait' : 'pointer',
                    opacity: status === 'sending' ? 0.7 : 1,
                  }}
                >
                  {status === 'sending' ? 'sending...' : status === 'sent' ? '✓ sent!' : '✉ send message'}
                </button>
                {status === 'error' && (
                  <span style={{ color: '#ff5555', fontSize: 12 }}>failed to send. try again.</span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
