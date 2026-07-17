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
- Home screen: bucket gauge, day context selector, contextual advice, today's log summary
- Bucket gauge: circular SVG, fills green → amber → orange → red
- Log screen: tile grid (Meat & Mammal, Dairy, Hidden Sources, Co-factors, OTC Medicines)
- Tile detail modal: amount selector with descriptors, bucket impact preview, educational note
- Amount descriptors on food: "a few bites or sips" / "a normal serving" / "a large portion or several servings"
- Remove from log: tap logged tile → modal shows "Remove from today's log"
- "Done for now" button in log screen header
- Morning check-in: symptom tiles logged against prior day (eat→feel pairing with correct date offset)
- Date-aware logging: uses local date not UTC
- History screen: 30-day scrollable list, eat→feel narrative with connector, correct D/D+1 pairing
- Header date strip: two past-day chips with load dot + symptom indicator, non-interactive today pill
- Past day modal: read-only view with append-only "add something I forgot"
- Profile screen: name, IgE, threshold sliders, sign out
- Lab results screen: allergen-specific IgE fields, "I don't have these yet" toggle, Firebase storage
- Scroll fade on Log and History screens
- Sign-out/sign-in routing bug fixed (tab resets to home on auth change)
- Firestore security rules: users can only read/write their own documents
- PWA manifest + service worker
- Threshold markers on gauge ring: tick marks at personal GI/Hives/Severe thresholds, pulled from profile
- Contextual amount-selector language per cofactor: Sick/Stress (Mild/Moderate/Severe), Heat and Exercise (2-point Brief-Extended / Light-Intense scales, no forced "moderate"), Alcohol (One drink/A few drinks/Several drinks). Amount option sets and load math centralized in `data/triggers.js` (`getAmountOptions`, `computeEffectiveLoad`) so TileModal and the log-history append flow can't drift apart.
- Tick bite logging: dedicated entry point on Log screen ("🕷️ Log a tick bite"), captures date/body location/region/attachment duration/tick size, stored under `users/{uid}/tickBites/{timestamp}`. Distinct red-themed treatment in History (badge on days with a bite, full detail in the past-day modal) — tick-only days (no food log) render without a bucket-load bar.
- NSAID type/timing modifier (researcher-informed): tapping the NSAID or Aspirin tile replaces the amount selector with Type (NSAID vs Other) + Timing (with food vs apart) choices, pre-selected to the conservative default so default tap-through cost is unchanged. Only NSAID+simultaneous carries full load; other combinations are reduced (see `computeNsaidLoad` in `data/triggers.js`).
- PPI/acid blocker toggle (researcher-informed): profile default ("I take a daily acid blocker") auto-applies each day; one-tap override chip on Home next to Day Context. Stored but not yet factored into bucket math — no researcher-specified load value exists for it (see "Don't fake science" principle).
- Fat profile modifier on meat tiles (researcher-informed): Lean/Fatty-Rendered/Organ-High-fat selector on Meat & Mammal tiles, pre-selected to "Fatty/Rendered" so the default tap-through path costs no extra taps. Adjusts effective load via `computeFatAdjustedLoad`.

### Expanded trigger library (current):
**Meat & Mammal:** Beef, Pork, Lamb, Venison/Bison, Rabbit, Veal, Hot Dogs
**Dairy:** Milk/Cream, Butter, Cheese, Ice Cream, Yogurt
**Hidden Sources:** Gelatin, Bone Broth, Lard/Tallow, Worcestershire, Lanolin, Supplements
**Co-factors:** Alcohol, Ibuprofen/NSAIDs, Heat/Hot, Exercise, Sick/Stress
**OTC Medicines:** (expanding in next session)

### Load multipliers are product estimates, not clinical values
Per the "don't fake science" principle, multipliers for fat profile (lean 0.8x / fatty 1.3x / organ 1.5x) and NSAID type+timing (nsaid+simultaneous 1x / nsaid+apart 0.4x / other+simultaneous 0.15x / other+apart 0.1x) are directionally faithful to the researcher's guidance but not derived from a cited formula — flag if real data suggests different ratios.

---

## Queued for Next Session

_Empty — the AGS researcher review batch (threshold gauge ticks, cofactor amount language, tick bite logging, NSAID type/timing modifier, PPI/acid blocker toggle, fat profile modifier, and the schema updates underneath them) shipped this session. See Current Build State above for what each does and where the load-multiplier estimates live._

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
  acidBlockerDefault: boolean,
  onboarded: boolean,
  createdAt: timestamp
}

// Daily log
users/{uid}/logs/{YYYY-MM-DD}
{
  dayContext: string,        // 'home' | 'work' | 'travel' | 'social'
  items: [...],              // see item structure above
  totalLoad: number,
  acidBlockerToday: boolean,
  notes: string
}

// Morning check-in (logged against PRIOR day's eating)
users/{uid}/checkins/{YYYY-MM-DD}
{
  symptoms: string[],        // ['hives', 'gi', 'foggy', 'fine', etc.]
  reactionSeverity: number,  // 0-3
  loggedAt: timestamp
}

// Tick bites
users/{uid}/tickBites/{timestamp}
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
- **No streaks, no shame.** AG carries enough anxiety. The app never punishes.
- **Eat→feel narrative is core.** AG reactions are delayed 3-8 hours. Morning check-in always maps to prior day's intake. This pairing must never break.
- **The threshold lines are the differentiating feature.** A map of your body, not a generic scale. Everything builds toward making those lines accurate.
- **Low friction above all.** If it's too annoying to log, people stop logging. Dead app.
- **Don't fake science.** IgE numbers and fat profiles are stored but not used in bucket math until the science supports it. Be honest about what the app does and doesn't know.

---

## Near-Term Roadmap (post-current session)

- Pattern detection: "You've reported GI symptoms 4 of the last 5 times your load exceeded 50%"
- Apollo-inspired UI polish: spring animations, micro-interactions, satisfying tap feedback
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
