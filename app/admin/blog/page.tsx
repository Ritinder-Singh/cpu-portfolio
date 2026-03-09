'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 24 } as React.CSSProperties,
  addBtn: {
    padding: '8px 18px',
    background: '#bd93f9',
    border: 'none',
    color: '#0a0a0a',
    borderRadius: 4,
    fontFamily: 'Courier New, monospace',
    fontSize: 13,
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    marginBottom: 24,
    textDecoration: 'none',
    display: 'inline-block',
  },
  btn: (color = '#bd93f9') => ({
    padding: '5px 12px',
    background: 'transparent',
    border: `1px solid ${color}`,
    color,
    borderRadius: 4,
    fontFamily: 'Courier New, monospace',
    fontSize: 12,
    cursor: 'pointer',
    marginLeft: 8,
  }) as React.CSSProperties,
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  th: { color: '#555', fontWeight: 'normal', textAlign: 'left' as const, padding: '8px 12px', borderBottom: '1px solid #222' },
  td: { padding: '10px 12px', borderBottom: '1px solid #1a1a1a', color: '#cdd6f4', verticalAlign: 'middle' as const },
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);

  const load = () => fetch('/api/admin/blog').then(r => r.json()).then(setPosts);
  useEffect(() => { load(); }, []);

  const toggle = async (post: Post) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h1 style={S.h1}>Blog</h1>
      <Link href="/admin/blog/new" style={S.addBtn}>+ New Post</Link>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Title</th>
            <th style={S.th}>Tags</th>
            <th style={S.th}>Status</th>
            <th style={S.th}>Date</th>
            <th style={S.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <td style={S.td}>{p.title}</td>
              <td style={{ ...S.td, color: '#888', fontSize: 11 }}>{p.tags.join(', ')}</td>
              <td style={S.td}>
                <span style={{ color: p.published ? '#50fa7b' : '#888', fontSize: 12 }}>
                  {p.published ? '● Published' : '○ Draft'}
                </span>
              </td>
              <td style={{ ...S.td, color: '#666', fontSize: 11 }}>
                {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}
              </td>
              <td style={S.td}>
                <Link href={`/admin/blog/${p.id}`} style={{ ...S.btn(), textDecoration: 'none', display: 'inline-block' }}>Edit</Link>
                <button style={S.btn(p.published ? '#888' : '#50fa7b')} onClick={() => toggle(p)}>
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
                <button style={S.btn('#ff5555')} onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr><td colSpan={5} style={{ ...S.td, color: '#555', textAlign: 'center' }}>No posts yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
