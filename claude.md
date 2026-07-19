# Threshold — Project Brief
**Alpha-Gal Syndrome Personal Load Tracker**
*Claude Code project instructions — keep this file current*

---

## What This Is

Threshold is a mobile-first PWA that helps people with Alpha-Gal Syndrome (AGS) understand and manage their personal reaction thresholds. Built by someone who has AG, for people who have AG.

**Core insight:** AG is a threshold disease, not binary safe/unsafe. Every person has a tolerance ceiling. Food, cofactors, stress, and illness stack cumulatively. The same meal causes no reaction one day and full-body hives another, depending on what else is in the bucket. Threshold makes the invisible visible.

**This is not a diagnostic tool. It is a decision support tool — a budget, not a warning system.** Users manage their load to fit their life, not the other way around.

---

## The Builder

Nick has AGS. Building for himself and ~10 friends initially, with an eye toward the broader AG community. His doctor's husband is an AGS researcher — a potential future collaborator once real user data exists. An AGS researcher consultation has already informed the data model (see Researcher-Informed Features below).

---

## Target User

- People diagnosed with Alpha-Gal Syndrome
- Initial cohort: 35-60 years old, not highly tech-savvy
- Primary device: iPhone
- Needs: large tap targets, low-friction input, fast daily use, no learning curve
- Emotional context: years of confusing, seemingly random reactions; relief when patterns finally make sense
- **The 10-second rule:** A tired user who just finished eating should be able to log in under 10 seconds. Every feature must pass this test.

---

## Tech Stack

- **Framework:** React PWA (Vite + vite-plugin-pwa)
- **Backend/Auth:** Firebase (Firestore + Firebase Auth — email/password)
- **Firebase project:** `threshold-d03d7`
- **GitHub repo:** `kendo316/Threshold`
- **Hosting:** Firebase Hosting (target: `threshold-d03d7.web.app`)
- **Styling:** Inline styles (established pattern — do not introduce CSS modules or Tailwind)
- **Icons:** Emoji (universal, no dependencies)
- **Fonts:** Google Fonts — Lora (serif, headings) + DM Sans (UI/body)

---

## Current Build State

### Completed and working:
- Firebase Auth (email/password sign-up/sign-in/sign-out)
- Onboarding flow: disclaimer → name + IgE → threshold sliders (GI/Hives/Severe)
- Home screen: bucket gauge (with personal threshold tick marks), contextual advice, today's log summary, quiet "Mark today mammal-free" action
- Bucket gauge: circular SVG, fills green → amber → orange → red, threshold ticks drawn from profile
- Log screen: tile grid (Meat & Mammal, Dairy, Hidden Sources, Co-factors, Medications), plus a quiet "Log a tick bite" entry point
- Tile detail modal: amount selector with per-type contextual language (not one-size-fits-all food portions), bucket impact preview (hidden for zero-load items), educational note; CTA copy is day-aware ("Add to Today" vs "Add to This Day")
- Per-type amount language: food (portions), drinks (alcohol), dose (NSAIDs/OTC/supplements), exposure (heat), intensity (exercise), severity (sick/stress/exhaustion), contact (lanolin)
- Remove from log: tap logged tile → modal shows day-aware remove copy
- "Done for now" button in log screen header
- Morning check-in: symptom tiles logged against prior day (eat→feel pairing with correct date offset)
- Date-aware logging: uses local date not UTC
- History screen: 30-day scrollable list, eat→feel narrative with connector, correct D/D+1 pairing, quiet 🌱 mammal-free indicator when applicable
- Header date strip: two past-day chips with load dot + symptom indicator, non-interactive today pill
- Past day modal: bottom-sheet with drag handle, internal scroll + sticky footer, append-only "add something I forgot" (day-aware copy)
- Profile screen: back button, name, IgE, living threshold sliders (reframed — revisitable anytime, shows "last adjusted" date), daily acid-blocker default toggle, standing medications (set-once), tick-bite history (list + manual past-bite entry), lab results link, sign out
- Lab results screen: allergen-specific IgE fields, "I don't have these yet" toggle, Firebase storage
- Tick bites: in-the-moment quick log (Log screen) + manual past-bite entry (Profile), both writing to `users/{uid}/tickBites`; logging one surfaces a gentle, dismissible nudge to revisit thresholds
- Mammal-free days: quiet per-day flag with a warm one-off celebration toast ("Mammal-free day ✨"), rare (~1-in-8) pixel-art robot easter egg ("COMPLIANCE!" — a wink to Max from *Flight of the Navigator*); no streaks or counters are ever shown in daily UI
- Situational medications: Daily Antihistamine, Benadryl, Pepcid/Famotidine tiles in the Medications category; Pepcid ties directly into the acid-blocker flag (no redundant "some antacid" tile)
- Standing medications: profile-level chips (Escitalopram, Bupropion, GLP-1/semaglutide/tirzepatide family) + free text
- Day-context selector (Home/Work/Travel/Social) removed — changed advice copy only, no data, didn't earn its space
- Shared `Toast` component, global button tap-scale feedback, screen fade-in transitions, safe-area-aware spacing throughout (modals, bottom nav, screen padding)
- Scroll fade on Log and History screens; bottom sheets use an internal scroll region + sticky footer instead
- Sign-out/sign-in routing bug fixed (tab resets to home on auth change)
- Write reliability: every Firestore write is wrapped — daily log and check-in saves are optimistic with honest rollback, and any failed write surfaces a retryable "That didn't save" error toast (via `src/utils/saveStatus.js`); celebrations and "✓ Saved" states never fire on a failed write
- Pattern detection: History shows a Patterns card computed from the user's own eat→feel pairs (`src/data/patterns.js`, pure + node-testable) — validates their personal GI line (symptom rate above vs below it) and co-factor days vs clean days; stays silent until each comparison group has ≥3 pairs, and shows a gentle pair-count progress line before that
- Date utils live in `src/utils/dates.js` (firebase-free) so data-layer logic stays testable without Firebase init
- Day-rollover safety: `useTodayKey` re-checks the calendar on resume/focus/pageshow (iOS PWAs resume frozen with yesterday's date), all daily hooks refetch when the day changes, and every date-keyed write stamps `localDateKey()` at WRITE time — a check-in or log entry can never land on the wrong day, even if the app sat open overnight or midnight passes mid-session. This protects the eat→feel pairing, which must never break.
- Firestore security rules: users can only read/write their own documents
- PWA manifest + service worker

### Expanded trigger library (current):
**Meat & Mammal:** Beef, Pork, Lamb, Venison/Bison, Rabbit, Veal, Hot Dogs
**Dairy:** Milk/Cream, Butter, Cheese, Ice Cream, Yogurt
**Hidden Sources:** Gelatin, Bone Broth, Lard/Tallow, Worcestershire, Lanolin, Supplements
**Co-factors:** Alcohol, Ibuprofen/NSAIDs, Heat/Hot, Exercise, Sick/Stress, Exhaustion
**Medications:** Gel Capsules, Aspirin, Daily Antihistamine, Benadryl, Pepcid/Famotidine

---

## Queued for Next Session

Not part of the last session's scope — still open:

### 1. NSAID type and timing modifier (researcher-informed)
When any NSAID tile is tapped, replace generic amount with two quick choices:
- **Type:** "NSAID (Ibuprofen/Naproxen/Aspirin)" vs "Other (Tylenol/Antihistamine)"
- **Timing:** "With or just before food" vs "Hours apart from food"

NSAIDs disrupt intestinal tight junctions; Tylenol does not. Only NSAID + simultaneous timing carries full bucket load. Store `nsaidType` and `nsaidTiming` on item.

### 2. Fat profile modifier on meat tiles (researcher-informed)
Alpha-gal concentrates in mammalian fat, not lean protein. When any Meat & Mammal tile is tapped, add fat profile selector:
- Lean (sirloin, venison, lean pork)
- Fatty/Rendered (bacon, sausage, marbled ribeye)
- Organ/High-fat broth (lard, bone broth, suet)

Adjust effective load accordingly — fatty/rendered carries meaningfully higher load than lean at same portion. Store `fatProfile` on meat items.

### 3. Acid-blocker load science (researcher-informed, deliberately deferred)
The current acid-blocker toggle/tile only tracks *whether* an acid blocker was taken (`acidBlockerToday`) — it does not yet adjust bucket math. The researcher-informed idea (PPIs/H2 blockers increasing effective load of other items eaten same-day) is a real bucket-math change that wasn't built this session, to avoid faking science ahead of validation. Revisit once there's a clear model for the multiplier.

### 4. Mammal-free research surfacing
Mammal-free days are captured per-day (`logs/{date}.mammalFree`) but nothing reads them back yet beyond a quiet history indicator. Build the doctor/research-facing aggregate view (e.g. "19 of the last 21 days mammal-free") when there's an actual export/consult flow to attach it to — deliberately not built speculatively.

### 7. Firestore schema updates
```javascript
// Updated item structure
{
  triggerId: string,
  label: string,
  category: string,
  baseLoad: number,
  amount: string,
  effectiveLoad: number,
  fatProfile: string,        // meat items only: 'lean' | 'fatty' | 'organ'
  nsaidType: string,         // NSAID items only: 'nsaid' | 'other'
  nsaidTiming: string,       // NSAID items only: 'simultaneous' | 'apart'
  loggedAt: timestamp
}

// New tick bite subcollection
users/{uid}/tickBites/{timestamp}
{
  date: string,              // YYYY-MM-DD
  bodyLocation: string,
  region: string,
  attachmentDuration: string, // 'crawling' | 'embedded' | 'engorged'
  tickSize: string,           // 'seed' | 'nymph' | 'adult'
  loggedAt: timestamp
}

// Profile additions
{
  ...existing,
  acidBlockerDefault: boolean
}

// Daily log additions
users/{uid}/logs/{YYYY-MM-DD}
{
  ...existing,
  acidBlockerToday: boolean
}
```

---

## Friction Audit Rule
Before finalizing any UI addition: would a tired, just-finished-eating user still log this in under 10 seconds? If any addition adds more than one extra tap to the core logging flow, make it optional or progressive. Flag conflicts with this principle before building.

---

## Design System

**Colors:**
```
bg:           #FAF6F0  (warm cream)
card:         #FFFFFF
brown:        #4A2C1A  (primary CTA, active states)
brownLight:   #7A4A30
amber:        #C8872A  (selected state, accents)
amberLight:   #F5E6C8  (selected tile backgrounds)
green:        #3D6B4A  (low load)
greenLight:   #E0EDE4
orange:       #C85A20  (high load)
orangeLight:  #FAE6DC
red:          #B02020  (near limit)
redLight:     #FAE0E0
textDark:     #1E0E06
textMid:      #6B4030
textLight:    #A07858
border:       #E8D8C4
borderLight:  #F2EAE0
```

**Typography:** Lora (serif) for headings, DM Sans for UI/body
**Tile sizing:** min 96px wide, 44px+ tap targets, emoji icons 34-56px
**Border radius:** 13-18px cards/tiles, 20px pills, 14px buttons
**Styling:** Inline styles only — no CSS files, no Tailwind

---

## Core Data Model

```javascript
// User profile
users/{uid}/data/profile
{
  name: string,
  igeNumber: number,
  thresholds: { gi: number, hives: number, severe: number },
  thresholdsUpdatedAt: string,      // ISO — set whenever thresholds actually change
  acidBlockerDefault: boolean,
  standingMedications: { chips: string[], other: string },
  onboarded: boolean,
  createdAt: timestamp
}

// Daily log
users/{uid}/logs/{YYYY-MM-DD}
{
  items: [...],              // see item structure above
  totalLoad: number,
  acidBlockerToday: boolean,
  mammalFree: boolean,
  notes: string
}

// Morning check-in (logged against PRIOR day's eating)
users/{uid}/checkins/{YYYY-MM-DD}
{
  symptoms: string[],        // ['hives', 'gi', 'foggy', 'fine', etc.]
  reactionSeverity: number,  // 0-3
  loggedAt: timestamp
}

// Tick bites (both in-the-moment quick logs and manual past-bite entries)
users/{uid}/tickBites/{docId}
{
  date: string,
  bodyLocation: string,
  region: string,
  attachmentDuration: string,
  tickSize: string,
  loggedAt: timestamp
}
```

---

## Key Product Principles

- **Decision support, not warning system.** The bucket is a budget. Some days you spend freely.
- **No streaks, no shame.** AG carries enough anxiety. The app never punishes. Mammal-free days are a quiet gift (a one-off celebration), never a scoreboard — no streak or counter is ever shown in the daily UI, and non-mammal-free days are never framed as failure.
- **Eat→feel narrative is core.** AG reactions are delayed 3-8 hours. Morning check-in always maps to prior day's intake. This pairing must never break.
- **The threshold lines are living, not one-time.** Alpha-gal isn't static — a tick bite can reset tolerance, careful reintroduction can raise it. The threshold sliders are always one tap away from Profile, and logging a tick bite gently (never naggingly) invites the user to revisit them.
- **Low friction above all.** If it's too annoying to log, people stop logging. Dead app.
- **Don't fake science.** IgE numbers and fat profiles are stored but not used in bucket math until the science supports it. The acid-blocker flag is tracked the same way — stored, not yet a bucket-math multiplier. Be honest about what the app does and doesn't know.

---

## Near-Term Roadmap (post-current session)

- Demographic profile questions for research dataset
- Google sign-in option (easier for less tech-savvy users)
- Deploy to Firebase Hosting for first friend beta
- Hidden sources "more" expansion without cluttering main tile grid

## Future

- Provider finder by region
- Anonymous research data export (opt-in)
- Restaurant mode
- Medication checker

---

*Built by someone who has AG. For people who have AG.*
