'use client';

import React, { useEffect, useState } from 'react';
import { Theme } from '@/lib/themes';

interface ContactWindowProps {
  theme: Theme;
}

export default function ContactWindow({ theme }: ContactWindowProps) {
  const [cfg, setCfg] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/content/config')
      .then(r => r.json())
      .then(setCfg)
      .catch(() => {});
  }, []);

  const contactEmail = cfg.email ?? '';
  const github = cfg.github ?? '';
  const linkedin = cfg.linkedin ?? '';
  const twitter = cfg.twitter ?? '';

  const socialLinks = [
    ...(github ? [{ label: 'GitHub', value: github.replace('https://', ''), href: github, icon: '⌥', desc: 'See my code and projects' }] : []),
    ...(linkedin ? [{ label: 'LinkedIn', value: linkedin.replace('https://', ''), href: linkedin, icon: '🔗', desc: 'Professional network' }] : []),
    ...(twitter ? [{ label: 'Twitter', value: twitter.replace('https://twitter.com/', '@'), href: twitter, icon: '🐦', desc: 'Dev thoughts & updates' }] : []),
  ];

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
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 4000);
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`,
    color: theme.primary, padding: '8px 12px', borderRadius: 5,
    fontFamily: 'Courier New, monospace', fontSize: '13px',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: theme.bg, fontFamily: 'Courier New, monospace', padding: '24px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {/* Left — Social Links */}
      <div style={{ flex: '1 1 220px' }}>
        <h2 style={{ color: theme.secondary, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px', borderBottom: `1px solid ${theme.border}`, paddingBottom: 8 }}>
          Find Me Online
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {socialLinks.map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 14, backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '12px 16px', textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.primary; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.border; }}
            >
              <span style={{ fontSize: '20px' }}>{link.icon}</span>
              <div>
                <div style={{ color: theme.primary, fontSize: '14px', fontWeight: 600 }}>{link.label}</div>
                <div style={{ color: theme.dim, fontSize: '12px', marginTop: 2 }}>{link.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Right — Contact Form */}
      <div style={{ flex: '1 1 280px' }}>
        <h2 style={{ color: theme.secondary, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px', borderBottom: `1px solid ${theme.border}`, paddingBottom: 8 }}>
          Send a Message
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ color: theme.dim, fontSize: '12px', display: 'block', marginBottom: 4 }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} required />
          </div>
          <div>
            <label style={{ color: theme.dim, fontSize: '12px', display: 'block', marginBottom: 4 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} required />
          </div>
          <div>
            <label style={{ color: theme.dim, fontSize: '12px', display: 'block', marginBottom: 4 }}>Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your message..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} required />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{ backgroundColor: theme.accent, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 5, fontFamily: 'Courier New, monospace', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            {status === 'sending' ? 'Sending...' : '✉ Send Message'}
          </button>
          {status === 'sent' && <div style={{ color: '#50fa7b', fontSize: '13px' }}>✓ Message sent!</div>}
          {status === 'error' && <div style={{ color: '#ff5555', fontSize: '13px' }}>Failed to send. Try again or email directly.</div>}
        </form>
      </div>
    </div>
  );
}
