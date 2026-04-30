import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#282a36',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* Faint grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'linear-gradient(#bd93f9 1px, transparent 1px), linear-gradient(90deg, #bd93f9 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }} />

        {/* Prompt line */}
        <div style={{ color: '#6272a4', fontSize: 28, marginBottom: 24, fontFamily: 'monospace', display: 'flex' }}>
          {'> ~/portfolio'}
        </div>

        {/* Name */}
        <div style={{ color: '#f8f8f2', fontSize: 80, fontWeight: 700, lineHeight: 1.1, fontFamily: 'monospace', display: 'flex' }}>
          Ritinder Singh
        </div>

        {/* Tagline */}
        <div style={{ color: '#bd93f9', fontSize: 34, marginTop: 20, fontFamily: 'monospace', display: 'flex' }}>
          Backend Developer · Flutter · Python
        </div>

        {/* Decorative tags */}
        <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
          {['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'].map(tag => (
            <div key={tag} style={{
              backgroundColor: '#44475a',
              color: '#8be9fd',
              padding: '6px 16px',
              borderRadius: 6,
              fontSize: 20,
              fontFamily: 'monospace',
              display: 'flex',
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute', bottom: 56, right: 100,
          color: '#44475a', fontSize: 22, fontFamily: 'monospace', display: 'flex',
        }}>
          site.ritinder-singh.com
        </div>
      </div>
    ),
    { ...size }
  );
}
