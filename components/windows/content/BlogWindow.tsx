'use client';

import React, { useEffect, useState } from 'react';
import { Theme } from '@/lib/themes';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt?: string;
  published: boolean;
}

interface BlogWindowProps {
  theme: Theme;
}

export default function BlogWindow({ theme }: BlogWindowProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/content/blog')
      .then(r => r.json())
      .then((data: BlogPost[]) => { setPosts(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div
      style={{
        height: '100%', overflowY: 'auto', backgroundColor: theme.bg,
        fontFamily: 'Courier New, monospace', padding: '24px', color: theme.primary,
        opacity: loaded ? 1 : 0, transition: 'opacity 0.2s',
      }}
    >
      <h2 style={{ color: theme.secondary, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', borderBottom: `1px solid ${theme.border}`, paddingBottom: 8 }}>
        Blog
      </h2>
      <p style={{ color: theme.dim, fontSize: '13px', marginBottom: 24 }}>
        Writing about backend engineering, Flutter, and things I learn along the way.
      </p>

      {posts.length === 0 && loaded && (
        <div style={{ color: theme.dim, fontSize: '13px' }}>No posts published yet. Check back soon.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {posts.map(post => (
          <div key={post.id} style={{ backgroundColor: theme.bgBar, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: theme.primary }}>{post.title}</h3>
              <span style={{ backgroundColor: theme.accent, color: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: 4, fontSize: '11px' }}>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
              </span>
            </div>
            <p style={{ color: theme.primary, fontSize: '13px', lineHeight: 1.6, margin: '0 0 12px', opacity: 0.8 }}>{post.excerpt}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ backgroundColor: theme.bgDark, border: `1px solid ${theme.border}`, color: theme.secondary, padding: '2px 8px', borderRadius: 3, fontSize: '11px' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
