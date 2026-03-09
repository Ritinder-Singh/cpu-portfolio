import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0d0d0d',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#bd93f9',
          letterSpacing: -1,
        }}
      >
        &gt;_
      </div>
    ),
    { ...size }
  );
}
