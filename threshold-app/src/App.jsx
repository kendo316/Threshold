import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';
import { useDailyLog } from './hooks/useDailyLog';
import { useCheckin } from './hooks/useCheckin';
import { P } from './data/palette';

import AuthScreen from './screens/AuthScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import LogScreen from './screens/LogScreen';
import CheckInScreen from './screens/CheckInScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

const NAV_TABS = [
  { id: 'home',    label: 'Today',    emoji: '🪣' },
  { id: 'log',     label: 'Log',      emoji: '＋' },
  { id: 'checkin', label: 'Check In', emoji: '☀️' },
  { id: 'history', label: 'History',  emoji: '📊' },
];

function AppShell() {
  const { currentUser } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useProfile(currentUser?.uid);
  const { logData, loading: logLoading, addItem, setDayContext } = useDailyLog(currentUser?.uid);
  const { checkin, loading: checkinLoading, saveCheckin } = useCheckin(currentUser?.uid);
  const [tab, setTab] = useState('home');

  if (!currentUser) return <AuthScreen />;
  if (profileLoading || logLoading || checkinLoading) return <LoadingScreen />;
  if (!profile?.onboarded) {
    return <OnboardingScreen onComplete={saveProfile} />;
  }

  const handleAddItem = async (trigger, amount) => {
    await addItem(trigger, amount);
    setTab('home');
  };

  const handleCheckin = async (symptoms, severity) => {
    await saveCheckin(symptoms, severity);
    setTab('home');
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: P.bg,
      minHeight: '100vh',
      maxWidth: 640,
      margin: '0 auto',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { transition: opacity 0.15s; }
        button:active { opacity: 0.75; }
        input[type=range] { cursor: pointer; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '48px 20px 18px',
        background: P.card,
        borderBottom: `1px solid ${P.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 26,
            fontFamily: "'Lora', serif",
            color: P.textDark, letterSpacing: '-0.02em',
          }}>
            Threshold
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: P.textLight, letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 600 }}>
            Alpha-Gal Load Tracker
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 12, color: P.textLight,
            background: P.bg, border: `1px solid ${P.border}`,
            borderRadius: 20, padding: '4px 12px', fontWeight: 500,
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={() => setTab('profile')}
            style={{
              background: 'none', border: `1px solid ${P.border}`,
              borderRadius: 20, padding: '4px 10px',
              fontSize: 12, color: P.textLight, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {profile?.name ?? 'Me'}
          </button>
        </div>
      </div>

      {/* Screens */}
      <div style={{ paddingBottom: 80 }}>
        {tab === 'home' && (
          <HomeScreen
            logData={logData}
            checkin={checkin}
            profile={profile}
            onSetDayContext={setDayContext}
            setTab={setTab}
          />
        )}
        {tab === 'log' && (
          <LogScreen
            onAdd={handleAddItem}
            loggedItems={logData.items}
            onBack={() => setTab('home')}
          />
        )}
        {tab === 'checkin' && (
          <CheckInScreen
            onComplete={handleCheckin}
            onBack={() => setTab('home')}
            existingCheckin={checkin}
          />
        )}
        {tab === 'history' && <HistoryScreen />}
        {tab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onSave={saveProfile}
          />
        )}
      </div>

      {/* Bottom Nav */}
      {tab !== 'profile' && (
        <div style={{
          position: 'fixed', bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 640,
          background: P.card,
          borderTop: `1px solid ${P.border}`,
          display: 'flex', padding: '8px 0 24px',
          zIndex: 50,
        }}>
          {NAV_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, background: 'none', border: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                cursor: 'pointer', padding: '6px 0',
                opacity: tab === t.id ? 1 : 0.4,
              }}
            >
              <span style={{ fontSize: 22 }}>{t.emoji}</span>
              <span style={{
                fontSize: 11,
                color: tab === t.id ? P.brown : P.textLight,
                fontWeight: tab === t.id ? 600 : 400,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: P.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 36, marginBottom: 12 }}>🪣</p>
        <p style={{ fontSize: 14, color: P.textLight }}>Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
