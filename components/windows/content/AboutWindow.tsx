'use client';

import React, { useEffect, useState } from 'react';
import { Theme } from '@/lib/themes';
import { Skeleton } from '@/components/ui/Skeleton';

interface AboutWindowProps {
  theme: Theme;
}

interface SiteConfig {
  name?: string;
  tagline?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  aboutStats?: string; // JSON: { projects, experience, stars }
}

export default function AboutWindow({ theme }: AboutWindowProps) {
  const [cfg, setCfg] = useState<SiteConfig>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/content/config')
      .then(r => r.json())
      .then((data: SiteConfig) => { setCfg(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const stats = (() => {
    try { return JSON.parse(cfg.aboutStats ?? '{}'); } catch { return {}; }
  })();

  const name = cfg.name ?? '';
  const tagline = cfg.tagline ?? '';
  const bio = cfg.bio ?? '';
  const avatar = cfg.avatar ?? '';
  const location = cfg.location ?? '';
  const github = cfg.github ?? '';
  const linkedin = cfg.linkedin ?? '';
  const email = cfg.email ?? '';

  const socialLinks = [
    ...(github ? [{ label: 'GitHub', href: github, icon: '⌥' }] : []),
    ...(linkedin ? [{ label: 'LinkedIn', href: linkedin, icon: '🔗' }] : []),
    ...(email ? [{ label: 'Email', href: `mailto:${email}`, icon: '✉' }] : []),
  ];

  const statItems = [
    { label: 'Projects', value: stats.projects ?? '' },
    { label: 'Experience', value: stats.experience ?? '' },
    { label: 'GitHub Stars', value: stats.stars ?? '' },
  ].filter(s => s.value);

  const isUrl = avatar.startsWith('http');

  return (
    <>
    {!loaded && (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, backgroundColor: theme.bg, height: '100%' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Skeleton width={80} height={80} radius={40} color={theme.primary} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton width="55%" height={22} color={theme.primary} />
            <Skeleton width="35%" height={14} color={theme.secondary} />
          </div>
        </div>
        <Skeleton width="30%" height={13} color={theme.secondary} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={13} color={theme.primary} />
          <Skeleton height={13} color={theme.primary} />
          <Skeleton width="70%" height={13} color={theme.primary} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Skeleton width={90} height={36} radius={6} color={theme.primary} />
          <Skeleton width={90} height={36} radius={6} color={theme.primary} />
          <Skeleton width={90} height={36} radius={6} color={theme.primary} />
        </div>
      </div>
    )}
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        backgroundColor: theme.bg,
        color: theme.primary,
        fontFamily: 'Courier New, monospace',
        padding: '24px',
        display: loaded ? undefined : 'none',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
        <div
          style={{
            width: 80, height: 80, borderRadius: '50%',
            backgroundColor: isUrl ? 'transparent' : theme.accent,
            border: `2px solid ${theme.primary}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isUrl ? undefined : '28px', fontWeight: 700, color: '#fff',
            flexShrink: 0, overflow: 'hidden',
          }}
        >
          {isUrl
            ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : avatar}
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: theme.primary, margin: 0 }}>{name}</h1>
          <div style={{ color: theme.secondary, fontSize: '14px', marginTop: 4 }}>{tagline}</div>
          {location && <div style={{ color: theme.dim, fontSize: '13px', marginTop: 4 }}>📍 {location}</div>}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.secondary, borderBottom: `1px solid ${theme.border}`, paddingBottom: 8, marginBottom: 16 }}>
            About
          </h2>
          <p style={{ color: theme.primary, lineHeight: 1.7, fontSize: '14px', margin: 0 }}>{bio}</p>
        </section>
      )}

      {/* Quick Stats */}
      {statItems.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.secondary, borderBottom: `1px solid ${theme.border}`, paddingBottom: 8, marginBottom: 16 }}>
            Quick Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statItems.length}, 1fr)`, gap: 12 }}>
            {statItems.map(stat => (
              <div key={stat.label} style={{ backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: theme.primary }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: theme.dim, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <section>
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.secondary, borderBottom: `1px solid ${theme.border}`, paddingBottom: 8, marginBottom: 16 }}>
            Connect
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {socialLinks.map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`, color: theme.primary, padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontSize: '13px', cursor: 'pointer' }}>
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}
