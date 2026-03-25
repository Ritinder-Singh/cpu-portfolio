'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Post {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
}

const EMPTY: Post = { title: '', excerpt: '', content: '', tags: [], published: false };

const S = {
  h1: { color: '#bd93f9', fontSize: 20, marginBottom: 24 } as React.CSSProperties,
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4, marginTop: 16 } as React.CSSProperties,
  input: {
    width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 4,
    color: '#cdd6f4', padding: '7px 10px', fontFamily: 'Courier New, monospace',
    fontSize: 13, boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 4,
    color: '#cdd6f4', padding: '10px', fontFamily: 'Courier New, monospace',
    fontSize: 13, boxSizing: 'border-box' as const, resize: 'vertical' as const, minHeight: 400,
  },
  row: { display: 'flex', gap: 12, marginTop: 24 } as React.CSSProperties,
  saveBtn: {
    padding: '9px 22px', background: '#bd93f9', border: 'none', color: '#0a0a0a',
    borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 'bold' as const, cursor: 'pointer',
  },
  pubBtn: (published: boolean) => ({
    padding: '9px 22px', background: 'transparent',
    border: `1px solid ${published ? '#888' : '#50fa7b'}`,
    color: published ? '#888' : '#50fa7b',
    borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13, cursor: 'pointer',
  }) as React.CSSProperties,
  cancelBtn: {
    padding: '9px 22px', background: 'transparent', border: '1px solid #333',
    color: '#666', borderRadius: 4, fontFamily: 'Courier New, monospace', fontSize: 13, cursor: 'pointer',
  },
  preview: {
    marginTop: 16, background: '#0d0d0d', border: '1px solid #333', borderRadius: 4,
    padding: 16, color: '#cdd6f4', fontSize: 13, lineHeight: 1.6, minHeight: 200,
    whiteSpace: 'pre-wrap' as const,
  },
};

export default function BlogEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [post, setPost] = useState<Post>(EMPTY);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/blog/${id}`).then(r => r.json()).then(data => {
        setPost({ ...data, tags: data.tags ?? [] });
      });
    }
  }, [id, isNew]);

  const save = async (publish?: boolean) => {
    setSaving(true);
    const body = {
      ...post,
      tags: typeof post.tags === 'string' ? (post.tags as unknown as string).split(',').map((t: string) => t.trim()) : post.tags,
      published: publish !== undefined ? publish : post.published,
    };
    if (isNew) {
      await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch(`/api/admin/blog/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setSaving(false);
    router.push('/admin/blog');
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={S.h1}>{isNew ? 'New Post' : 'Edit Post'}</h1>

      <label style={S.label}>Title</label>
      <input style={S.input} value={post.title} onChange={e => setPost(p => ({ ...p, title: e.target.value }))} placeholder="Post title" />

      <label style={S.label}>Excerpt (shown in post list)</label>
      <input style={S.input} value={post.excerpt} onChange={e => setPost(p => ({ ...p, excerpt: e.target.value }))} placeholder="Short description..." />

      <label style={S.label}>Tags (comma-separated)</label>
      <input style={S.input} value={Array.isArray(post.tags) ? post.tags.join(', ') : post.tags} onChange={e => setPost(p => ({ ...p, tags: e.target.value as unknown as string[] }))} placeholder="Python, FastAPI, Tutorial" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <label style={{ ...S.label, marginTop: 0 }}>Content (Markdown)</label>
        <button
          onClick={() => setPreview(v => !v)}
          style={{ ...S.cancelBtn, padding: '4px 12px', fontSize: 11 }}
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {preview ? (
        <div style={S.preview}>{post.content || '(empty)'}</div>
      ) : (
        <textarea
          style={S.textarea}
          value={post.content}
          onChange={e => setPost(p => ({ ...p, content: e.target.value }))}
          placeholder="Write your post in Markdown..."
        />
      )}

      <div style={S.row}>
        <button style={S.saveBtn} onClick={() => save()} disabled={saving}>
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button style={S.pubBtn(post.published)} onClick={() => save(!post.published)}>
          {post.published ? 'Unpublish' : 'Publish'}
        </button>
        <button style={S.cancelBtn} onClick={() => router.push('/admin/blog')}>
          Cancel
        </button>
      </div>
    </div>
  );
}
