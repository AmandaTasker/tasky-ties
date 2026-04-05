import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase setup ────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const generateCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();

const COLORS = {
  cream: "#FDF6EC",
  paper: "#F5ECD7",
  rust: "#C0533A",
  rustLight: "#E87A5D",
  brown: "#3D2B1F",
  brownMid: "#6B4C3B",
  sage: "#7A9E7E",
  gold: "#D4A843",
  white: "#FFFDF8",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.cream}; font-family: 'Nunito', sans-serif; color: ${COLORS.brown}; min-height: 100vh; }
  .app {
    min-height: 100vh;
    background: ${COLORS.cream};
    background-image:
      radial-gradient(circle at 20% 20%, rgba(192,83,58,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(212,168,67,0.08) 0%, transparent 50%);
    padding: 24px 16px 60px;
  }
  .header { text-align: center; margin-bottom: 32px; }
  .logo { font-family: 'Playfair Display', serif; font-size: 2.4rem; color: ${COLORS.rust}; letter-spacing: -0.5px; line-height: 1; }
  .logo span { color: ${COLORS.gold}; }
  .tagline { font-size: 0.85rem; color: ${COLORS.brownMid}; margin-top: 4px; letter-spacing: 0.5px; }
  .card {
    background: ${COLORS.white};
    border-radius: 16px;
    padding: 28px 24px;
    max-width: 520px;
    margin: 0 auto 20px;
    box-shadow: 0 2px 12px rgba(61,43,31,0.08), 0 1px 3px rgba(61,43,31,0.06);
    border: 1px solid rgba(212,168,67,0.2);
  }
  .card-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: ${COLORS.rust}; margin-bottom: 20px; }
  .input {
    width: 100%;
    border: 1.5px solid rgba(61,43,31,0.15);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.95rem;
    color: ${COLORS.brown};
    background: ${COLORS.cream};
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 12px;
  }
  .input:focus { border-color: ${COLORS.rust}; background: #fff; }
  .input::placeholder { color: rgba(61,43,31,0.35); }
  .textarea { resize: vertical; min-height: 90px; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 11px 22px; border-radius: 10px;
    font-family: 'Nunito', sans-serif; font-size: 0.92rem; font-weight: 700;
    cursor: pointer; border: none; transition: all 0.18s; letter-spacing: 0.2px;
  }
  .btn-primary { background: ${COLORS.rust}; color: white; width: 100%; font-size: 1rem; padding: 13px; }
  .btn-primary:hover { background: ${COLORS.rustLight}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(192,83,58,0.3); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-secondary { background: transparent; color: ${COLORS.rust}; border: 1.5px solid ${COLORS.rust}; width: 100%; font-size: 1rem; padding: 12px; }
  .btn-secondary:hover { background: rgba(192,83,58,0.06); }
  .btn-sm { padding: 7px 14px; font-size: 0.82rem; border-radius: 8px; }
  .btn-sage { background: ${COLORS.sage}; color: white; }
  .btn-sage:hover { background: #6a8d6e; }
  .btn-google {
    background: white; color: #3c4043; border: 1.5px solid #dadce0;
    width: 100%; font-size: 1rem; padding: 13px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer;
    transition: all 0.18s; box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .btn-google:hover { background: #f8f9fa; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
  .item-list { display: flex; flex-direction: column; gap: 10px; }
  .item-row { background: ${COLORS.paper}; border-radius: 12px; padding: 14px 16px; border: 1.5px solid transparent; transition: border-color 0.2s; }
  .item-row.claimed { border-color: rgba(122,158,126,0.4); }
  .item-row.multi-claimed { border-color: rgba(212,168,67,0.5); }
  .item-name { font-weight: 700; font-size: 1rem; color: ${COLORS.brown}; margin-bottom: 4px; }
  .claim-list { font-size: 0.82rem; color: ${COLORS.sage}; font-weight: 600; display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
  .claim-badge { background: rgba(122,158,126,0.15); border-radius: 20px; padding: 2px 10px; display: flex; align-items: center; gap: 4px; }
  .claim-badge .remove-btn { background: none; border: none; cursor: pointer; color: ${COLORS.sage}; padding: 0; font-size: 0.9rem; line-height: 1; opacity: 0.7; }
  .claim-badge .remove-btn:hover { opacity: 1; }
  .notice { background: rgba(212,168,67,0.12); border: 1px solid rgba(212,168,67,0.4); border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: #7a5c1e; margin-top: 8px; display: flex; gap: 6px; align-items: flex-start; }
  .notice-success { background: rgba(122,158,126,0.12); border-color: rgba(122,158,126,0.4); color: #3a6b3e; }
  .notice-error { background: rgba(192,83,58,0.08); border-color: rgba(192,83,58,0.3); color: ${COLORS.rust}; }
  .event-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: ${COLORS.brown}; margin-bottom: 4px; }
  .event-meta { font-size: 0.82rem; color: ${COLORS.brownMid}; margin-bottom: 20px; opacity: 0.8; }
  .section-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1.2px; color: ${COLORS.brownMid}; opacity: 0.7; margin-bottom: 10px; font-weight: 700; }
  .add-item-row { display: flex; gap: 8px; margin-top: 12px; }
  .add-item-row .input { margin-bottom: 0; flex: 1; }
  .copy-btn { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 2px 6px; border-radius: 6px; transition: background 0.15s; color: ${COLORS.brownMid}; }
  .copy-btn:hover { background: rgba(61,43,31,0.08); }
  .edit-btn { background: none; border: 1.5px solid rgba(61,43,31,0.15); cursor: pointer; font-size: 0.75rem; padding: 3px 9px; border-radius: 20px; color: ${COLORS.brownMid}; font-family: 'Nunito', sans-serif; font-weight: 700; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px; }
  .edit-btn:hover { border-color: ${COLORS.rust}; color: ${COLORS.rust}; background: rgba(192,83,58,0.05); }
  .edit-input-row { display: flex; gap: 8px; align-items: center; margin-top: 8px; }
  .edit-input-row .input { margin-bottom: 0; flex: 1; padding: 8px 12px; font-size: 0.92rem; }
  .save-btn { background: ${COLORS.rust}; color: white; border: none; border-radius: 8px; padding: 8px 14px; font-family: 'Nunito', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
  .save-btn:hover { background: ${COLORS.rustLight}; }
  .invite-box { background: ${COLORS.paper}; border: 2px dashed rgba(212,168,67,0.5); border-radius: 12px; padding: 18px 20px; margin: 16px 0; }
  .invite-link-text { font-size: 0.82rem; color: ${COLORS.brownMid}; word-break: break-all; margin-bottom: 12px; font-family: monospace; }
  .event-card { background: ${COLORS.white}; border-radius: 14px; padding: 18px 20px; max-width: 520px; margin: 0 auto 12px; box-shadow: 0 1px 6px rgba(61,43,31,0.07); border: 1px solid rgba(212,168,67,0.18); cursor: pointer; transition: all 0.18s; }
  .event-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(61,43,31,0.11); }
  .event-card-title { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: ${COLORS.brown}; margin-bottom: 4px; }
  .event-card-meta { font-size: 0.8rem; color: ${COLORS.brownMid}; display: flex; gap: 12px; flex-wrap: wrap; }
  .badge { font-size: 0.72rem; background: rgba(192,83,58,0.1); color: ${COLORS.rust}; border-radius: 20px; padding: 2px 10px; font-weight: 700; }
  .badge-guest { background: rgba(122,158,126,0.12); color: ${COLORS.sage}; }
  .user-bar { display: flex; align-items: center; justify-content: space-between; max-width: 520px; margin: 0 auto 24px; }
  .user-info { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 34px; height: 34px; border-radius: 50%; background: ${COLORS.rust}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; overflow: hidden; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .user-name { font-size: 0.88rem; font-weight: 700; color: ${COLORS.brownMid}; }
  .sign-out-btn { background: none; border: none; font-size: 0.8rem; color: ${COLORS.brownMid}; cursor: pointer; font-family: 'Nunito', sans-serif; opacity: 0.7; }
  .sign-out-btn:hover { opacity: 1; text-decoration: underline; }
  .spinner { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
  .spinner-circle { width: 36px; height: 36px; border: 3px solid rgba(192,83,58,0.2); border-top-color: ${COLORS.rust}; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .empty-state { text-align: center; padding: 48px 24px; color: ${COLORS.brownMid}; }
  .empty-state-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .empty-state-text { font-size: 0.95rem; margin-bottom: 20px; }
`;

// ─── Supabase helpers ──────────────────────────────────────────
async function loadEvent(code) {
  const { data, error } = await supabase
    .from("events")
    .select("data")
    .eq("code", code)
    .single();
  if (error || !data) return null;
  return data.data;
}

async function saveEvent(event, ownerId, expiresAt) {
  const row = { code: event.code, data: event };
  if (ownerId) row.owner_id = ownerId;
  if (expiresAt) row.expires_at = expiresAt;
  const { error } = await supabase
    .from("events")
    .upsert(row, { onConflict: "code" });
  return !error;
}

async function addGuest(eventCode, userId, displayName, avatarUrl) {
  const { error } = await supabase
    .from("event_guests")
    .upsert(
      { event_code: eventCode, user_id: userId, display_name: displayName, avatar_url: avatarUrl },
      { onConflict: "event_code,user_id" }
    );
  return !error;
}

// ─── Main App ──────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState("home"); // home | create | event
  const [myEvents, setMyEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [createTime, setCreateTime] = useState("");
  const [createLocation, setCreateLocation] = useState("");
  const [createItems, setCreateItems] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [copied, setCopied] = useState(false);

  // ─── Inject global styles ──────────────────────────────────
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = globalStyles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // ─── Auth init & ?join= link handling ──────────────────────
  useEffect(() => {
    // Grab any pending join code from the URL before auth redirect wipes it
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get("join");
    if (joinCode) {
      localStorage.setItem("pendingJoin", joinCode.toUpperCase());
      window.history.replaceState({}, "", window.location.pathname);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) handlePendingJoin(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) handlePendingJoin(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePendingJoin = async (session) => {
    const code = localStorage.getItem("pendingJoin");
    if (!code) return;
    localStorage.removeItem("pendingJoin");

    const user = session.user;
    const displayName = user.user_metadata?.full_name || user.email;
    const avatarUrl = user.user_metadata?.avatar_url || null;

    await addGuest(code, user.id, displayName, avatarUrl);
    const eventData = await loadEvent(code);
    if (eventData) {
      setCurrentEvent({ ...eventData, isOrganizer: eventData.ownerUserId === user.id });
      setView("event");
    }
  };

  // ─── Load my events when on home screen ───────────────────
  useEffect(() => {
    if (session && view === "home") loadMyEvents();
  }, [session, view]);

  const loadMyEvents = async () => {
    if (!session) return;
    setEventsLoading(true);
    const now = new Date().toISOString();

    const [{ data: owned }, { data: guestRows }] = await Promise.all([
      supabase
        .from("events")
        .select("code, data, expires_at")
        .eq("owner_id", session.user.id)
        .gt("expires_at", now)
        .order("expires_at", { ascending: true }),
      supabase
        .from("event_guests")
        .select("event_code, events(code, data, expires_at)")
        .eq("user_id", session.user.id),
    ]);

    const ownedList = (owned || []).map(e => ({ ...e.data, isOrganizer: true, expiresAt: e.expires_at }));
    const guestList = (guestRows || [])
      .filter(g => g.events && g.events.expires_at > now)
      .map(g => ({ ...g.events.data, isOrganizer: false, expiresAt: g.events.expires_at }))
      .filter(g => !ownedList.find(o => o.code === g.code));

    setMyEvents([...ownedList, ...guestList].sort((a, b) => {
      if (a.date && b.date) return new Date(a.date) - new Date(b.date);
      return 0;
    }));
    setEventsLoading(false);
  };

  // ─── Auth actions ─────────────────────────────────────────
  const signInWithGoogle = () => {
    const joinCode = localStorage.getItem("pendingJoin");
    const redirectTo = joinCode
      ? `${window.location.origin}/?join=${joinCode}`
      : window.location.origin;
    supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMyEvents([]);
    setCurrentEvent(null);
    setView("home");
  };

  // ─── Create event ─────────────────────────────────────────
  const handleCreate = async () => {
    if (!createTitle.trim()) { setCreateError("Give your event a name!"); return; }
    if (!createItems.trim()) { setCreateError("Add at least one item to bring."); return; }
    setCreateError("");
    setCreateLoading(true);

    const items = createItems
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map((label, i) => ({ id: `item_${i}_${Date.now()}`, label, claims: [] }));

    const code = generateCode();
    const user = session.user;

    // Expire 7 days after the event date, or 7 days from now if no date set
    const baseDate = createDate
      ? new Date(createDate + "T23:59:59")
      : new Date();
    const expiresAt = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const newEvent = {
      code,
      title: createTitle.trim(),
      date: createDate,
      time: createTime,
      location: createLocation.trim(),
      items,
      ownerUserId: user.id,
      ownerName: user.user_metadata?.full_name || user.email,
      createdAt: Date.now(),
    };

    const ok = await saveEvent(newEvent, user.id, expiresAt);
    setCreateLoading(false);
    if (!ok) { setCreateError("Couldn't save the event — check your Supabase setup!"); return; }

    // Also add organizer as a guest so they appear in the guest list query
    await addGuest(code, user.id, user.user_metadata?.full_name || user.email, user.user_metadata?.avatar_url);

    setCurrentEvent({ ...newEvent, isOrganizer: true });
    setView("event");
    // Reset form
    setCreateTitle(""); setCreateDate(""); setCreateTime(""); setCreateLocation(""); setCreateItems("");
  };

  // ─── Claim / unclaim ──────────────────────────────────────
  const handleClaim = async (itemId) => {
    const user = session.user;
    const myName = user.user_metadata?.full_name || user.email;
    const updated = await loadEvent(currentEvent.code) || currentEvent;
    const items = updated.items.map(item => {
      if (item.id !== itemId) return item;
      const alreadyClaimed = item.claims.find(c => c.userId === user.id);
      if (alreadyClaimed) return item;
      return { ...item, claims: [...item.claims, { userId: user.id, name: myName, claimedAt: Date.now() }] };
    });
    const newEvent = { ...updated, items };
    await saveEvent(newEvent);
    setCurrentEvent({ ...newEvent, isOrganizer: currentEvent.isOrganizer });
  };

  const handleRemoveClaim = async (itemId, claimedAt) => {
    const updated = await loadEvent(currentEvent.code) || currentEvent;
    const items = updated.items.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, claims: item.claims.filter(c => c.claimedAt !== claimedAt) };
    });
    const newEvent = { ...updated, items };
    await saveEvent(newEvent);
    setCurrentEvent({ ...newEvent, isOrganizer: currentEvent.isOrganizer });
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    const updated = await loadEvent(currentEvent.code) || currentEvent;
    const newItem = { id: `item_${Date.now()}`, label: newItemText.trim(), claims: [] };
    const newEvent = { ...updated, items: [...updated.items, newItem] };
    await saveEvent(newEvent);
    setCurrentEvent({ ...newEvent, isOrganizer: currentEvent.isOrganizer });
    setNewItemText("");
  };

  const handleEditItem = async (itemId, newLabel) => {
    const updated = await loadEvent(currentEvent.code) || currentEvent;
    let items;
    if (!newLabel.trim()) {
      // Blank → remove the item entirely
      items = updated.items.filter(item => item.id !== itemId);
    } else {
      // Update the label
      items = updated.items.map(item =>
        item.id === itemId ? { ...item, label: newLabel.trim() } : item
      );
    }
    const newEvent = { ...updated, items };
    await saveEvent(newEvent);
    setCurrentEvent({ ...newEvent, isOrganizer: currentEvent.isOrganizer });
  };

  // ─── Live polling ─────────────────────────────────────────
  useEffect(() => {
    if (view !== "event" || !currentEvent) return;
    const interval = setInterval(async () => {
      const updated = await loadEvent(currentEvent.code);
      if (updated) setCurrentEvent(prev => ({ ...updated, isOrganizer: prev.isOrganizer }));
    }, 4000);
    return () => clearInterval(interval);
  }, [view, currentEvent?.code]);

  const copyInviteLink = () => {
    const link = `${window.location.origin}/?join=${currentEvent.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareInviteLink = () => {
    const link = `${window.location.origin}/?join=${currentEvent.code}`;
    if (navigator.share) {
      navigator.share({ title: currentEvent.title, text: `Join me at ${currentEvent.title}!`, url: link });
    } else {
      copyInviteLink();
    }
  };

  // ─── Render ───────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="app">
        <div className="spinner"><div className="spinner-circle" /></div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 4 }}>
          <img src="/logo.png" alt="Tasky Ties logo" style={{ width: 52, height: 52, objectFit: "contain" }} />
          <div className="logo">Tasky <span>Ties</span></div>
        </div>
        <div className="tagline">Family gatherings, effortlessly organized</div>
      </div>

      {/* ── Not signed in ── */}
      {!session && (
        <div className="card" style={{ textAlign: "center", paddingTop: 36, paddingBottom: 36 }}>
          <img src="/logo.png" alt="Tasky Ties" style={{ width: 64, height: 64, objectFit: "contain", marginBottom: 12 }} />
          <div className="card-title" style={{ marginBottom: 8 }}>Welcome to Tasky Ties</div>
          <p style={{ fontSize: "0.9rem", color: COLORS.brownMid, marginBottom: 28, lineHeight: 1.6 }}>
            Sign in to create gatherings, invite family, and see everything you've signed up to bring — all in one place.
          </p>
          <button className="btn-google" onClick={signInWithGoogle}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      )}

      {/* ── Signed in ── */}
      {session && (
        <>
          {/* User bar */}
          <div className="user-bar">
            <div className="user-info">
              <div className="avatar">
                {session.user.user_metadata?.avatar_url
                  ? <img src={session.user.user_metadata.avatar_url} alt="" />
                  : (session.user.user_metadata?.full_name || session.user.email || "?")[0].toUpperCase()
                }
              </div>
              <span className="user-name">
                {session.user.user_metadata?.full_name || session.user.email}
              </span>
            </div>
            <button className="sign-out-btn" onClick={signOut}>Sign out</button>
          </div>

          {/* ── Home: My Events dashboard ── */}
          {view === "home" && (
            <>
              <button
                className="btn btn-primary"
                style={{ maxWidth: 520, margin: "0 auto 24px", display: "flex" }}
                onClick={() => setView("create")}
              >
                ✨ New Event
              </button>

              {eventsLoading && (
                <div className="spinner" style={{ minHeight: 120 }}>
                  <div className="spinner-circle" />
                </div>
              )}

              {!eventsLoading && myEvents.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🗓️</div>
                  <div className="empty-state-text">No upcoming events yet.<br />Create one and invite your people!</div>
                </div>
              )}

              {!eventsLoading && myEvents.map(ev => (
                <EventCard
                  key={ev.code}
                  event={ev}
                  onClick={() => { setCurrentEvent(ev); setView("event"); }}
                />
              ))}
            </>
          )}

          {/* ── Create event ── */}
          {view === "create" && (
            <div className="card">
              <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.brownMid, fontSize: "0.88rem", fontFamily: "'Nunito', sans-serif", display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                ← Back
              </button>
              <div className="card-title">Plan your gathering</div>
              <input className="input" placeholder="Event name (e.g. Easter Potluck 🐣)" value={createTitle} onChange={e => setCreateTitle(e.target.value)} />
              <div style={{ display: "flex", gap: 10 }}>
                <input className="input" type="date" value={createDate} onChange={e => setCreateDate(e.target.value)} style={{ flex: 1 }} />
                <input className="input" type="time" value={createTime} onChange={e => setCreateTime(e.target.value)} style={{ flex: 1 }} />
              </div>
              <input className="input" placeholder="📍 Location (e.g. Mom's house, 123 Main St)" value={createLocation} onChange={e => setCreateLocation(e.target.value)} />
              <div className="section-label">What do people need to bring?</div>
              <textarea className="input textarea" placeholder={"Spaghetti\nGarlic bread\nPaper plates\nSoda & drinks\nDessert"} value={createItems} onChange={e => setCreateItems(e.target.value)} />
              <div style={{ fontSize: "0.78rem", color: COLORS.brownMid, opacity: 0.7, marginBottom: 16 }}>One item per line</div>
              {createError && <div className="notice notice-error" style={{ marginBottom: 12 }}>⚠️ {createError}</div>}
              <button className="btn btn-primary" onClick={handleCreate} disabled={createLoading}>
                {createLoading ? "Creating…" : "Create Event →"}
              </button>
            </div>
          )}

          {/* ── Event view ── */}
          {view === "event" && currentEvent && (
            <EventView
              event={currentEvent}
              session={session}
              onBack={() => { setView("home"); setCurrentEvent(null); }}
              onClaim={handleClaim}
              onRemoveClaim={handleRemoveClaim}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              newItemText={newItemText}
              setNewItemText={setNewItemText}
              copyInviteLink={copyInviteLink}
              shareInviteLink={shareInviteLink}
              copied={copied}
            />
          )}
        </>
      )}
    </div>
  );
}

// ─── Event Card (dashboard) ───────────────────────────────────
function EventCard({ event, onClick }) {
  const totalClaimed = event.items?.filter(i => i.claims.length > 0).length ?? 0;
  const total = event.items?.length ?? 0;

  const formatDate = () => {
    if (!event.date) return null;
    return new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="event-card" onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div className="event-card-title">{event.title}</div>
        <span className={`badge ${event.isOrganizer ? "" : "badge-guest"}`}>
          {event.isOrganizer ? "Organizer" : "Guest"}
        </span>
      </div>
      <div className="event-card-meta">
        {formatDate() && <span>📅 {formatDate()}{event.time ? ` · ${new Date("1970-01-01T" + event.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}` : ""}</span>}
        {event.location && <span>📍 {event.location}</span>}
        <span>✅ {totalClaimed}/{total} items covered</span>
      </div>
    </div>
  );
}

// ─── Event View ───────────────────────────────────────────────
function EventView({ event, session, onBack, onClaim, onRemoveClaim, onAddItem, onEditItem, newItemText, setNewItemText, copyInviteLink, shareInviteLink, copied }) {
  const [notices, setNotices] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const inviteLink = `${window.location.origin}/?join=${event.code}`;
  const myUserId = session.user.id;

  const startEdit = (item) => {
    setEditingItemId(item.id);
    setEditingText(item.label);
  };

  const saveEdit = (itemId) => {
    onEditItem(itemId, editingText);
    setEditingItemId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditingText("");
  };

  const handleClaim = (itemId) => {
    const item = event.items.find(i => i.id === itemId);
    const alreadyMine = item.claims.find(c => c.userId === myUserId);
    if (alreadyMine) return;
    if (item.claims.length > 0) {
      setNotices(prev => ({
        ...prev,
        [itemId]: `Heads up — ${item.claims.map(c => c.name).join(" & ")} also signed up for this!`
      }));
      setTimeout(() => setNotices(prev => { const n = { ...prev }; delete n[itemId]; return n; }), 5000);
    }
    onClaim(itemId);
  };

  const totalClaimed = event.items.filter(i => i.claims.length > 0).length;
  const total = event.items.length;

  const formatDate = () => {
    if (!event.date && !event.time) return null;
    let str = "";
    if (event.date) str += new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    if (event.time) str += ` · ${new Date("1970-01-01T" + event.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    return str;
  };

  return (
    <>
      <div style={{ maxWidth: 520, margin: "0 auto 16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.brownMid, fontSize: "0.88rem", fontFamily: "'Nunito', sans-serif", display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
          ← My Events
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="event-title">{event.title}</div>
          <span className={`badge ${event.isOrganizer ? "" : "badge-guest"}`} style={{ marginTop: 6 }}>
            {event.isOrganizer ? "Organizer" : "Guest"}
          </span>
        </div>
        {formatDate() && (
          <div style={{ fontSize: "0.88rem", color: COLORS.rust, fontWeight: 700, marginBottom: 4 }}>📅 {formatDate()}</div>
        )}
        {event.location && (
          <div style={{ fontSize: "0.88rem", color: COLORS.brownMid, fontWeight: 600, marginBottom: 4 }}>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: COLORS.brownMid, textDecoration: "none" }}
            >
              📍 {event.location} ↗
            </a>
          </div>
        )}
        <div className="event-meta" style={{ marginTop: 6 }}>{totalClaimed} of {total} items covered 🎉</div>
      </div>

      {/* Invite link */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-label">Invite your people</div>
        <div className="invite-box">
          <div style={{ fontSize: "0.8rem", color: COLORS.brownMid, marginBottom: 10 }}>
            Share this link — they tap it, sign in with Google, and they're in!
          </div>
          <div className="invite-link-text">{inviteLink}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={shareInviteLink}>
              {copied ? "✓ Copied!" : "📤 Share Invite"}
            </button>
            <button className="btn btn-secondary" style={{ width: "auto", padding: "11px 16px" }} onClick={copyInviteLink} title="Copy link">
              📋
            </button>
          </div>
        </div>
        {copied && <div className="notice notice-success">✓ Link copied to clipboard!</div>}
      </div>

      {/* Items */}
      <div className="card">
        <div className="card-title">What's everyone bringing?</div>
        <div className="item-list">
          {event.items.map(item => {
            const hasClaims = item.claims.length > 0;
            const multiClaimed = item.claims.length > 1;
            const iMyClaim = item.claims.find(c => c.userId === myUserId);
            const isEditing = editingItemId === item.id;
            return (
              <div key={item.id} className={`item-row ${hasClaims ? "claimed" : ""} ${multiClaimed ? "multi-claimed" : ""}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className="item-name">{hasClaims ? "✅" : "⬜"} {item.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {multiClaimed && (
                      <span style={{ fontSize: "0.75rem", background: "rgba(212,168,67,0.2)", color: "#7a5c1e", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
                        {item.claims.length} bringing this
                      </span>
                    )}
                    {event.isOrganizer && !isEditing && (
                      <button className="edit-btn" onClick={() => startEdit(item)}>✏️ Edit</button>
                    )}
                  </div>
                </div>

                {/* Inline edit input */}
                {isEditing && (
                  <div className="edit-input-row">
                    <input
                      className="input"
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveEdit(item.id); if (e.key === "Escape") cancelEdit(); }}
                      autoFocus
                      placeholder="Leave blank to remove this item"
                    />
                    <button className="save-btn" onClick={() => saveEdit(item.id)}>Save</button>
                    <button className="edit-btn" onClick={cancelEdit}>Cancel</button>
                  </div>
                )}

                {hasClaims && (
                  <div className="claim-list">
                    {item.claims.map(c => (
                      <div key={c.claimedAt} className="claim-badge">
                        {c.name}
                        {(c.userId === myUserId || event.isOrganizer) && (
                          <button className="remove-btn" onClick={() => onRemoveClaim(item.id, c.claimedAt)}>×</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {notices[item.id] && <div className="notice" style={{ marginBottom: 8 }}>⚠️ {notices[item.id]}</div>}
                {!isEditing && !iMyClaim && (
                  <button className="btn btn-sage btn-sm" onClick={() => handleClaim(item.id)} style={{ marginTop: 8 }}>
                    I'll bring this
                  </button>
                )}
                {!isEditing && iMyClaim && (
                  <div style={{ fontSize: "0.8rem", color: COLORS.sage, fontWeight: 700, marginTop: 8 }}>
                    ✓ You're bringing this
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {event.isOrganizer && (
          <>
            <div style={{ height: 16 }} />
            <div className="section-label">Add another item</div>
            <div className="add-item-row">
              <input className="input" placeholder="e.g. Veggie tray…" value={newItemText} onChange={e => setNewItemText(e.target.value)} onKeyDown={e => e.key === "Enter" && onAddItem()} />
              <button className="btn btn-primary btn-sm" onClick={onAddItem} style={{ whiteSpace: "nowrap", width: "auto" }}>Add</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
