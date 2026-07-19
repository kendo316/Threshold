import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';
import { useDailyLog } from './hooks/useDailyLog';
import { useCheckin } from './hooks/useCheckin';
import { useLogHistory } from './hooks/useLogHistory';
import { useTickBites } from './hooks/useTickBites';
import { onSaveError } from './utils/saveStatus';
import { P } from './data/palette';
import Toast from './components/Toast';

import AuthScreen from './screens/AuthScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import LogScreen from './screens/LogScreen';
import CheckInScreen from './screens/CheckInScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import LabResultsScreen from './screens/LabResultsScreen';
import DateStrip from './components/DateStrip';

const NAV_TABS = [
  { id: 'home',    label: 'Today',    emoji: '🪣' },
  { id: 'log',     label: 'Log',      emoji: '＋' },
  { id: 'checkin', label: 'Check In', emoji: '☀️' },
  { id: 'history', label: 'History',  emoji: '📊' },
];

function AppShell() {
  const { currentUser } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useProfile(currentUser?.uid);
  const { logData, loading: logLoading, addItem, removeItem, setMammalFree, setAcidBlockerToday } = useDailyLog(currentUser?.uid);
  const { checkin, loading: checkinLoading, saveCheckin } = useCheckin(currentUser?.uid);
  const { history, checkinHistory, dateKeys, appendItemToDate } = useLogHistory(currentUser?.uid, 30);
  const { bites: tickBites, addBite: addTickBite } = useTickBites(currentUser?.uid);
  const [tab, setTab] = useState('home');
  const [retrySave, setRetrySave] = useState(null);
  const [retrySucceeded, setRetrySucceeded] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) setTab('home');
  }, [currentUser?.uid]);

  useEffect(() => onSaveError(retry => setRetrySave(() => retry)), []);

  // Apply the "daily acid blocker" default once per fresh day, without overriding a day
  // that's already been explicitly set (on or off). One attempt per session — if the
  // write fails and rolls back, retrying here would loop forever. It fails silently
  // (reportFailure: false): a background default isn't the user's data, and they can
  // still log Pepcid by hand.
  const acidBlockerAttempted = useRef(false);
  useEffect(() => {
    if (profileLoading || logLoading || acidBlockerAttempted.current) return;
    if (profile?.acidBlockerDefault && logData.acidBlockerToday === undefined) {
      acidBlockerAttempted.current = true;
      setAcidBlockerToday(true, { reportFailure: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLoading, logLoading, profile?.acidBlockerDefault, logData.acidBlockerToday]);

  // The moment after "Try again" works is the moment trust is rebuilt —
  // close the loop with a brief confirmation instead of silence.
  const handleRetry = async () => {
    const retry = retrySave;
    setRetrySave(null);
    const ok = await retry();
    if (ok !== false) {
      setRetrySucceeded(true);
    }
    // On another failure the hook re-reports and the error toast re-arms itself.
  };

  const saveErrorToast = retrySucceeded ? (
    <Toast tone="celebrate" autoHideMs={2000} onDismiss={() => setRetrySucceeded(false)}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: P.green, fontFamily: "'DM Sans', sans-serif" }}>
        ✓ Saved — all caught up
      </p>
    </Toast>
  ) : retrySave ? (
    <Toast tone="error" showDismiss={false} onDismiss={() => setRetrySave(null)}>
      <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: P.red, fontFamily: "'DM Sans', sans-serif" }}>
        That didn't save
      </p>
      <p style={{ margin: '0 0 10px', fontSize: 13, color: P.textMid, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
        Check your connection — nothing was lost, it just needs another try.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleRetry}
          style={{
            padding: '8px 14px', background: P.brown, color: 'white',
            border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Try again
        </button>
        <button
          onClick={() => setRetrySave(null)}
          style={{
            padding: '8px 14px', background: 'transparent', color: P.textMid,
            border: `1px solid ${P.border}`, borderRadius: 20, fontSize: 12,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Dismiss
        </button>
      </div>
    </Toast>
  ) : null;

  if (!currentUser) return <AuthScreen />;
  if (profileLoading || logLoading || checkinLoading) return <LoadingScreen />;

  if (!profile?.onboarded) {
    return (
      <>
        {saveErrorToast}
        <OnboardingScreen onComplete={saveProfile} />
      </>
    );
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
        button { transition: opacity 0.15s, transform 0.15s; }
        button:active { opacity: 0.75; transform: scale(0.97); }
        input[type=range] { cursor: pointer; }
        @keyframes screenFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '48px 20px 14px',
        background: P.card,
        borderBottom: `1px solid ${P.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
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
        <DateStrip
          history={history}
          checkinHistory={checkinHistory}
          todayCheckin={checkin}
          appendItemToDate={appendItemToDate}
        />
      </div>

      {/* Screens */}
      <div style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        {tab === 'home' && (
          <HomeScreen
            logData={logData}
            checkin={checkin}
            profile={profile}
            onRemoveItem={removeItem}
            onMarkMammalFree={setMammalFree}
            setTab={setTab}
          />
        )}
        {tab === 'log' && (
          <LogScreen
            onAdd={handleAddItem}
            onRemove={removeItem}
            loggedItems={logData.items}
            onBack={() => setTab('home')}
            onAddTickBite={addTickBite}
            onGoToProfile={() => setTab('profile')}
          />
        )}
        {tab === 'checkin' && (
          <CheckInScreen
            onComplete={handleCheckin}
            onBack={() => setTab('home')}
            existingCheckin={checkin}
          />
        )}
        {tab === 'history' && (
          <HistoryScreen
            history={history}
            checkinHistory={checkinHistory}
            dateKeys={dateKeys}
            onAppendItem={appendItemToDate}
            todayCheckin={checkin}
            profile={profile}
          />
        )}
        {tab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onSave={saveProfile}
            onLabResults={() => setTab('lab')}
            onBack={() => setTab('home')}
            tickBites={tickBites}
            onAddTickBite={addTickBite}
          />
        )}
        {tab === 'lab' && (
          <LabResultsScreen
            labResults={profile?.labResults}
            onSave={(data) => saveProfile({ labResults: data })}
            onBack={() => setTab('profile')}
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
          display: 'flex', padding: '8px 0 calc(14px + env(safe-area-inset-bottom))',
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

      {saveErrorToast}
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
