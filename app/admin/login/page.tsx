import { signIn } from '@/lib/auth';

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      fontFamily: 'Courier New, monospace',
    }}>
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: 8,
        padding: 40,
        textAlign: 'center',
        width: 360,
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚙️</div>
        <h1 style={{ color: '#bd93f9', fontSize: 20, marginBottom: 4 }}>Admin Panel</h1>
        <p style={{ color: '#666', fontSize: 13, marginBottom: 28 }}>portfolio-cpu</p>

        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: '/admin' });
          }}
        >
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px 20px',
              background: '#bd93f9',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: 6,
              fontFamily: 'Courier New, monospace',
              fontSize: 14,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
