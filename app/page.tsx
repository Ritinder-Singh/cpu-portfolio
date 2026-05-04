'use client';

import { useEffect, useState } from 'react';

const LINES = [
  '> initializing portfolio...',
  '> loading assets...',
  '> running diagnostics...',
  '> system check failed.',
  '',
  '[ MAINTENANCE MODE ]',
];

export default function Page() {
  const [visible, setVisible] = useState<number>(0);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (visible >= LINES.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), visible === 0 ? 300 : 600);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        background: '#21222c',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: 560, width: '100%' }}>
        {/* Terminal window chrome */}
        <div
          style={{
            background: '#282a36',
            border: '1px solid #44475a',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {/* Title bar */}
          <div
            style={{
              background: '#383a59',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid #44475a',
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5555', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f1fa8c', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#50fa7b', display: 'inline-block' }} />
            <span style={{ color: '#6272a4', fontSize: 12, marginLeft: 8 }}>portfolio — bash</span>
          </div>

          {/* Terminal body */}
          <div style={{ padding: '24px 20px 28px', minHeight: 220 }}>
            {LINES.slice(0, visible).map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.startsWith('[') ? '#bd93f9' : line.startsWith('>') ? '#8be9fd' : '#f8f8f2',
                  fontSize: 14,
                  lineHeight: '1.8',
                  fontWeight: line.startsWith('[') ? 700 : 400,
                  letterSpacing: line.startsWith('[') ? '0.1em' : 'normal',
                }}
              >
                {line || '\u00a0'}
              </div>
            ))}

            {visible >= LINES.length && (
              <>
                <div style={{ height: 16 }} />
                <div style={{ color: '#6272a4', fontSize: 13, lineHeight: 1.7 }}>
                  The site is currently being updated.
                  <br />
                  Check back soon.
                </div>
                <div style={{ height: 20 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#bd93f9', fontSize: 14 }}>~$</span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 9,
                      height: 16,
                      background: blink ? '#bd93f9' : 'transparent',
                      marginLeft: 6,
                      verticalAlign: 'middle',
                      transition: 'background 0.1s',
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <p style={{ color: '#44475a', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
          ritinder-singh.com
        </p>
      </div>
    </div>
  );
}
