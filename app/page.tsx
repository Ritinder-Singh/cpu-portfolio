import ContactButton from '@/components/maintenance/ContactButton';

export default function Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #21222c; }

        .wrap {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          padding: 2rem;
          background: #21222c;
        }

        .window {
          width: 100%;
          max-width: 540px;
          background: #282a36;
          border: 1px solid #44475a;
          border-radius: 8px;
          overflow: hidden;
        }

        .titlebar {
          background: #383a59;
          border-bottom: 1px solid #44475a;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .dot-r { background: #ff5555; }
        .dot-y { background: #f1fa8c; }
        .dot-g { background: #50fa7b; }
        .title-label { color: #6272a4; font-size: 12px; margin-left: 8px; }

        .body { padding: 24px 20px 28px; }

        .line {
          font-size: 14px;
          line-height: 1.8;
          opacity: 0;
          animation: fadein 0.3s forwards;
        }
        .line-cmd  { color: #8be9fd; }
        .line-text { color: #f8f8f2; }
        .line-head { color: #bd93f9; font-weight: 700; letter-spacing: 0.1em; }

        .line:nth-child(1) { animation-delay: 0.3s; }
        .line:nth-child(2) { animation-delay: 0.9s; }
        .line:nth-child(3) { animation-delay: 1.5s; }
        .line:nth-child(4) { animation-delay: 2.1s; }
        .line:nth-child(5) { animation-delay: 2.7s; }
        .line:nth-child(6) { animation-delay: 3.3s; }

        .sub {
          color: #6272a4;
          font-size: 13px;
          line-height: 1.7;
          margin-top: 16px;
          opacity: 0;
          animation: fadein 0.4s 4s forwards;
        }

        .prompt {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 20px;
          opacity: 0;
          animation: fadein 0.3s 4.2s forwards;
        }
        .ps1 { color: #bd93f9; font-size: 14px; }
        .cursor {
          width: 9px;
          height: 16px;
          background: #bd93f9;
          animation: blink 1.06s step-end infinite;
        }

        @keyframes fadein { to { opacity: 1; } }
        @keyframes blink  { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .footer {
          color: #44475a;
          font-size: 12px;
          text-align: center;
          margin-top: 20px;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      <div className="wrap">
        <div>
          <div className="window">
            <div className="titlebar">
              <span className="dot dot-r" />
              <span className="dot dot-y" />
              <span className="dot dot-g" />
              <span className="title-label">portfolio — bash</span>
            </div>
            <div className="body">
              <div className="line line-cmd">&gt; initializing portfolio...</div>
              <div className="line line-cmd">&gt; loading assets...</div>
              <div className="line line-cmd">&gt; running diagnostics...</div>
              <div className="line line-cmd">&gt; system check failed.</div>
              <div className="line line-text">&nbsp;</div>
              <div className="line line-head">[ MAINTENANCE MODE ]</div>
              <div className="sub">
                The site is currently being updated.<br />
                Check back soon.
              </div>
              <div className="prompt">
                <span className="ps1">~$</span>
                <span className="cursor" />
              </div>
              <ContactButton />
            </div>
          </div>
          <p className="footer">ritinder-singh.com</p>
        </div>
      </div>
    </>
  );
}
