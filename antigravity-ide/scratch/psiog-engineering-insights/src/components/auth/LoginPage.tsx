import React, { useState } from 'react';
import { Mail, Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

/* ── Brand wordmark ── */
const PsiogLogo: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <span style={{
      fontFamily: "'Outfit', 'Nunito', sans-serif",
      fontSize: '2.8rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1,
    }}>
      <span style={{ color: '#2DC4C2' }}>psi</span><span style={{ color: '#C5D000' }}>og</span>
    </span>
  </div>
);

/* ── Full-viewport abstract background ── */
const BackgroundDecor: React.FC = () => (
  <svg
    aria-hidden="true"
    style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
      overflow: 'visible',
    }}
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
  >
    {/* ─── Top-left: nested teal concentric rings ─── */}
    <circle cx="-70" cy="-70" r="310" stroke="#2DC4C2" strokeWidth="60" opacity="0.06" />
    <circle cx="-70" cy="-70" r="190" stroke="#2DC4C2" strokeWidth="35" opacity="0.07" />
    <circle cx="-70" cy="-70" r="100" stroke="#2DC4C2" strokeWidth="20" opacity="0.08" />
    {/* accent dots escaping the rings */}
    <circle cx="248" cy="55"  r="9"   fill="#2DC4C2" opacity="0.18" />
    <circle cx="280" cy="105" r="6"   fill="#2DC4C2" opacity="0.13" />
    <circle cx="230" cy="140" r="5"   fill="#C5D000" opacity="0.22" />
    <circle cx="300" cy="70"  r="4"   fill="#C5D000" opacity="0.18" />

    {/* ─── Bottom-right: nested lime concentric rings ─── */}
    <circle cx="1510" cy="970" r="350" stroke="#C5D000" strokeWidth="65" opacity="0.07" />
    <circle cx="1510" cy="970" r="220" stroke="#C5D000" strokeWidth="40" opacity="0.07" />
    <circle cx="1510" cy="970" r="120" stroke="#C5D000" strokeWidth="22" opacity="0.09" />
    {/* accent dots */}
    <circle cx="1195" cy="830" r="9"   fill="#C5D000" opacity="0.2"  />
    <circle cx="1230" cy="865" r="6"   fill="#C5D000" opacity="0.14" />
    <circle cx="1165" cy="870" r="5"   fill="#2DC4C2" opacity="0.18" />
    <circle cx="1210" cy="800" r="4"   fill="#2DC4C2" opacity="0.14" />

    {/* ─── Top-right: small lime ring cluster ─── */}
    <circle cx="1420" cy="-30" r="140" stroke="#C5D000" strokeWidth="30" opacity="0.07" />
    <circle cx="1420" cy="-30" r="80"  stroke="#C5D000" strokeWidth="18" opacity="0.07" />
    <circle cx="1285" cy="85"  r="7"   fill="#C5D000" opacity="0.2"  />
    <circle cx="1320" cy="55"  r="5"   fill="#2DC4C2" opacity="0.16" />
    <circle cx="1310" cy="100" r="3.5" fill="#C5D000" opacity="0.18" />

    {/* ─── Bottom-left: small teal ring cluster ─── */}
    <circle cx="20" cy="930" r="120" stroke="#2DC4C2" strokeWidth="28" opacity="0.07" />
    <circle cx="20" cy="930" r="65"  stroke="#2DC4C2" strokeWidth="16" opacity="0.07" />
    <circle cx="150" cy="820" r="7"   fill="#2DC4C2" opacity="0.18" />
    <circle cx="180" cy="850" r="5"   fill="#C5D000" opacity="0.2"  />
    <circle cx="130" cy="858" r="3.5" fill="#2DC4C2" opacity="0.15" />

    {/* ─── Right-side floating dot grid (teal) ─── */}
    {(Array.from({ length: 16 }) as undefined[]).map((_, i) => (
      <circle
        key={`gr${i}`}
        cx={1360 + (i % 4) * 26}
        cy={350 + Math.floor(i / 4) * 26}
        r="3.2"
        fill="#2DC4C2"
        opacity="0.13"
      />
    ))}

    {/* ─── Left-side floating dot grid (lime) ─── */}
    {(Array.from({ length: 12 }) as undefined[]).map((_, i) => (
      <circle
        key={`gl${i}`}
        cx={52 + (i % 3) * 26}
        cy={360 + Math.floor(i / 3) * 26}
        r="3"
        fill="#C5D000"
        opacity="0.16"
      />
    ))}

    {/* ─── Mid-page: a lone teal arc echoing the logo, upper-center-right ─── */}
    <path
      d="M 1100 180 A 90 90 0 1 0 1100 340"
      stroke="#2DC4C2"
      strokeWidth="22"
      opacity="0.06"
      strokeLinecap="round"
    />

    {/* ─── Mid-page: lone lime arc, lower-center-left ─── */}
    <path
      d="M 320 580 A 70 70 0 1 0 320 700"
      stroke="#C5D000"
      strokeWidth="18"
      opacity="0.07"
      strokeLinecap="round"
    />
  </svg>
);

const MicrosoftLogo: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="0" y="0" width="9" height="9" fill="#F25022" />
    <rect x="11" y="0" width="9" height="9" fill="#7FBA00" />
    <rect x="0" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onLogin(); }, 900);
  };

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onLogin(); }, 900);
  };

  return (
    <div className="lp-page">
      <BackgroundDecor />

      <div className="lp-card">
        {/* Logo */}
        <div className="lp-logo-wrap">
          <PsiogLogo />
        </div>

        <h2 className="lp-title">Welcome back</h2>
        <p className="lp-subtitle">Sign in to your Psiog account</p>

        {/* Microsoft SSO */}
        <button className="lp-btn-ms" onClick={handleMicrosoftLogin} disabled={isLoading}>
          <MicrosoftLogo />
          <span>Continue with Microsoft</span>
          <span className="lp-chevron">›</span>
        </button>

        {/* Divider */}
        <div className="lp-divider">
          <span className="lp-divider-line" />
          <span className="lp-divider-text">or</span>
          <span className="lp-divider-line" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSignIn} className="lp-form">
          <label className="lp-label">Work email</label>
          <div className="lp-input-wrap">
            <Mail size={16} color="#9ca3af" />
            <input
              type="email"
              className="lp-input"
              placeholder="name@psiog.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <button type="submit" className="lp-btn-signin" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Forgot password */}
        <a href="#" className="lp-forgot" onClick={(e) => e.preventDefault()}>
          Forgot password?
        </a>

        {/* Footer */}
        <div className="lp-footer">
          <Shield size={13} color="#b0b8c4" />
          <span>Secure internal application&nbsp;&bull;&nbsp;Powered by Microsoft Azure</span>
        </div>
      </div>

      {isLoading && <div className="lp-overlay" />}
    </div>
  );
};
