import { useState } from 'react';
import { P } from '../data/palette';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const friendlyError = (code) => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Email or password is incorrect.';
      case 'auth/user-not-found':
        return 'No account found with that email.';
      case 'auth/email-already-in-use':
        return 'An account with that email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    border: `1.5px solid ${P.border}`,
    borderRadius: 13,
    fontSize: 16, fontFamily: "'DM Sans', sans-serif",
    color: P.textDark, background: P.card,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh', background: P.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 24px 48px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <h1 style={{
          margin: '0 0 4px',
          fontSize: 34, fontFamily: "'Lora', serif",
          color: P.textDark, letterSpacing: '-0.02em',
        }}>
          Threshold
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: P.textLight, letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 600 }}>
          Alpha-Gal Load Tracker
        </p>
      </div>

      <div style={{
        width: '100%', maxWidth: 400,
        background: P.card,
        border: `1px solid ${P.border}`,
        borderRadius: 20, padding: '28px 24px 32px',
      }}>
        <h2 style={{ margin: '0 0 22px', fontSize: 20, color: P.textDark, fontFamily: "'Lora', serif" }}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {error && (
            <p style={{ margin: 0, fontSize: 13, color: P.red, lineHeight: 1.4 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6, padding: '16px',
              background: loading ? P.border : P.brown,
              color: 'white', border: 'none', borderRadius: 14,
              fontSize: 16, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, cursor: loading ? 'default' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ margin: '20px 0 0', fontSize: 14, color: P.textLight, textAlign: 'center' }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: P.brown, fontWeight: 600, fontSize: 14,
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
