import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/projects', label: '📁 Projects' },
  { href: '/admin/blog', label: '📝 Blog' },
  { href: '/admin/skills', label: '⚡ Skills' },
  { href: '/admin/achievements', label: '🏆 Achievements' },
  { href: '/admin/resume', label: '📄 Resume' },
  { href: '/admin/testimonials', label: '💬 Testimonials' },
  { href: '/admin/availability', label: '🟢 Availability' },
  { href: '/admin/commands', label: '💻 Commands' },
  { href: '/admin/wallpaper', label: '🖼 Wallpaper' },
  { href: '/admin/config', label: '⚙️ Config' },
];

const S = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0d0d0d',
    fontFamily: 'Courier New, monospace',
    color: '#cdd6f4',
    overflow: 'hidden',
  } as React.CSSProperties,
  sidebar: {
    width: 220,
    minWidth: 220,
    background: '#111',
    borderRight: '1px solid #222',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '24px 0',
  },
  logo: {
    padding: '0 20px 20px',
    borderBottom: '1px solid #222',
    marginBottom: 16,
  },
  logoTitle: { color: '#bd93f9', fontSize: 15, fontWeight: 'bold' },
  logoSub: { color: '#555', fontSize: 11 },
  nav: { flex: 1, padding: '0 8px' },
  navLink: {
    display: 'block',
    padding: '8px 12px',
    color: '#888',
    textDecoration: 'none',
    fontSize: 13,
    borderRadius: 4,
    marginBottom: 2,
  },
  signOutForm: { padding: '16px 20px', borderTop: '1px solid #222' },
  signOutBtn: {
    width: '100%',
    padding: '7px 0',
    background: 'transparent',
    border: '1px solid #333',
    color: '#666',
    borderRadius: 4,
    fontFamily: 'Courier New, monospace',
    fontSize: 12,
    cursor: 'pointer',
  },
  main: { flex: 1, overflowY: 'auto' as const, padding: 32, height: '100vh' },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Login page is under this layout too — render it without the sidebar
  if (!session?.user) return <>{children}</>;

  return (
    <div style={S.root}>
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoTitle}>⚙️ Admin</div>
          <div style={S.logoSub}>{session.user.email}</div>
        </div>

        <nav style={S.nav}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} style={S.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={S.signOutForm}>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button type="submit" style={S.signOutBtn}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main style={S.main}>{children}</main>
    </div>
  );
}
