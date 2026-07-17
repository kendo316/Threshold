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

### Expanded trigger library (current):
**Meat & Mammal:** Beef, Pork, Lamb, Venison/Bison, Rabbit, Veal, Hot Dogs
**Dairy:** Milk/Cream, Butter, Cheese, Ice Cream, Yogurt
**Hidden Sources:** Gelatin, Bone Broth, Lard/Tallow, Worcestershire, Lanolin, Supplements
**Co-factors:** Alcohol, Ibuprofen/NSAIDs, Heat/Hot, Exercise, Sick/Stress
**OTC Medicines:** (expanding in next session)

---

## Queued for Next Session

Build in this order. Confirm plan before writing any code.

### 1. Threshold markers on gauge ring
Draw tick marks on the SVG ring at the user's personal GI, Hives, and Severe threshold percentages. Label minimally. As the bucket fills toward a marker, the user sees it coming. Pull values from user profile.

### 2. Cofactor amount language
Current small/moderate/large was designed for food — wrong for cofactors. Use contextually appropriate language per type:
- Sick/Stress: Mild / Moderate / Severe
- NSAIDs: One dose / Multiple doses
- Heat: Brief exposure / Extended exposure
- Exercise: Light activity / Intense workout
- Alcohol: One drink / A few drinks / Several drinks

### 3. Tick bite logging
Dedicated log entry — not a food tile. Capture:
- Date (defaults to today)
- Body location (simple text or picker)
- Geographic region (Northeast / Southeast / Midwest / Southwest / West / Other)
- Attachment duration (Crawling/under 4hrs / Embedded about a day / Engorged over 24hrs)
- Tick size (Speck/seed tick / Small/nymph / Large/adult)

Store under `users/{uid}/tickBites/{timestamp}`. Surface in History with distinct visual treatment. Add accessible entry point (home or log screen).

### 4. NSAID type and timing modifier (researcher-informed)
When any NSAID tile is tapped, replace generic amount with two quick choices:
- **Type:** "NSAID (Ibuprofen/Naproxen/Aspirin)" vs "Other (Tylenol/Antihistamine)"
- **Timing:** "With or just before food" vs "Hours apart from food"

NSAIDs disrupt intestinal tight junctions; Tylenol does not. Only NSAID + simultaneous timing carries full bucket load. Store `nsaidType` and `nsaidTiming` on item.

### 5. PPI / acid blocker daily toggle (researcher-informed)
PPIs and H2 blockers (Omeprazole, Famotidine, Pepcid) reduce stomach acid, leaving larger alpha-gal peptide chains intact and increasing effective load. Add:
- Profile default: "I take a daily acid blocker" toggle (auto-logs unless overridden)
- Daily override available in morning check-in or home screen
- Store `acidBlockerDefault` in profile, `acidBlockerToday` in daily log

### 6. Fat profile modifier on meat tiles (researcher-informed)
Alpha-gal concentrates in mammalian fat, not lean protein. When any Meat & Mammal tile is tapped, add fat profile selector:
- Lean (sirloin, venison, lean pork)
- Fatty/Rendered (bacon, sausage, marbled ribeye)
- Organ/High-fat broth (lard, bone broth, suet)

Adjust effective load accordingly — fatty/rendered carries meaningfully higher load than lean at same portion. Store `fatProfile` on meat items.

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
