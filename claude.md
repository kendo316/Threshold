# Threshold — Project Brief
**Alpha-Gal Syndrome Personal Load Tracker**
*Handoff document for Claude Code development*

---

## What This Is

Threshold is a mobile-first PWA (Progressive Web App) that helps people with Alpha-Gal Syndrome (AGS) understand and manage their personal reaction thresholds. It is built by someone who has AG, for people who have AG.

The core insight: AG is not a binary safe/unsafe disease. It is a **threshold disease**. Every person has a tolerance ceiling, and multiple inputs — food, cofactors, stress, illness — stack cumulatively. The same meal can cause no reaction one day and full-body hives another, depending on what else is in the bucket. This "randomness" has made the disease feel unmanageable. Threshold makes the invisible visible.

This is not a diagnostic tool. It is a **decision support tool** — a budget, not a warning system. Users manage their load to fit their life, not the other way around.

---

## The Builder

The developer (Nick) has AGS. He is building this for himself and approximately 10 friends with AG, with an eye toward a broader AG community release. His doctor's husband is an AG researcher — a potential future collaborator once real user data exists.

---

## Target User

- People diagnosed with Alpha-Gal Syndrome
- Initial cohort: 35-60 years old, not highly tech-savvy
- Primary device: iPhone
- Needs: large tap targets, low-friction input, fast daily use, no learning curve
- Emotional context: years of confusing, seemingly random reactions; a history of being dismissed by doctors; real relief when patterns finally make sense

---

## Core Mechanics

### The Bucket
Each day starts at 0%. As users log food and cofactors, their bucket fills. The bucket is not a warning — it is a budget. Some days you spend freely. Some days (traveling, client dinners, important meetings) you protect it.

### Personal Thresholds
Not one line at 100% — multiple personal lines at different levels for different symptom types:
- **GI threshold** (e.g., ~55% for this user): loose stool, stomach issues
- **Hives threshold** (e.g., ~80%): skin reaction, itching
- **Severe threshold**: user-defined for anaphylaxis risk

These lines are set by the user initially from experience, then refined over time as the app learns from logged reactions. This is the single most differentiating feature — a map of *your* body, not a generic scale.

### Cofactor Logic
Cofactors lower the ceiling rather than fill the bucket. They make the same amount of food more dangerous. Key cofactors: alcohol, NSAIDs (ibuprofen/aspirin/naproxen), heat (hot shower, sun, sauna), exercise, illness, poor sleep, stress. The app treats these as bucket contributors with a note that they are ceiling-lowerers, not just additive load.

**Important educational note for the app:** Ibuprofen (Advil) is one of the most significant AG cofactors. Many users don't know this. The OTC Medicines tile should surface this clearly.

### Rolling 3-Day View
The daily bucket does not necessarily reset cleanly. Whether multi-day accumulation is real in AG is not yet scientifically confirmed, but showing 3 days of context helps users surface patterns they can't see any other way. This is also potentially useful data for researchers.

### Learning Loop
1. User logs intake + cofactors throughout the day
2. Next morning: morning check-in tiles for symptoms (hives, GI, congestion, brain fog, fatigue, or feeling good)
3. Symptom check-in is logged against prior day's intake
4. Over weeks, the app identifies where the user's personal threshold lines fall
5. Threshold markers on the gauge update to reflect learned patterns

---

## Feature List

### MVP (Build First)
- [ ] Onboarding: brief disclaimer, IgE number input, set initial threshold estimates
- [ ] Home screen: bucket gauge with personal threshold markers, day context selector, contextual advice, today's log summary
- [ ] Log screen: tile grid organized by category (Meat & Mammal, Dairy, Hidden Sources, Co-factors, OTC Medicines)
- [ ] Tile detail: tap to expand, select amount (small/moderate/large), shows bucket impact
- [ ] Tile backs: brief educational note on each trigger explaining the AG connection
- [ ] Morning check-in: symptom tiles logged against yesterday
- [ ] 3-day rolling view: simple strip showing prior two days' load + reactions
- [ ] Profile screen: IgE number, personal threshold line settings, name
- [ ] Onboarding disclaimer screen (one tap to acknowledge, plain English)
- [ ] Firebase persistence: all logs stored per user

### Near-Term (Post-MVP)
- [ ] Pattern detection: "You've reported GI symptoms 4 of the last 5 times your load exceeded 50%"
- [ ] Hidden sources lookup: search any food or product for alpha-gal content
- [ ] Restaurant mode: quick-log for eating out, flag hidden risks (broth, lard, gelatin capsules in supplements)
- [ ] Medication checker: flag common medications with alpha-gal risk (gel caps, certain cardiac drugs, cetuximab)
- [ ] Lab results upload: parse IgE number from PDF

### Future / Community
- [ ] Provider finder: doctors and allergists who know what AG is, by region
- [ ] AG-friendly restaurant tagging (community-maintained)
- [ ] Research feed: curated updates on AG science
- [ ] Anonymous data contribution for researchers (opt-in)

---

## UX Decisions (Already Made)

**Tile-based input.** Large visual tiles with emoji icons, organized by category. Tap to select, modal slides up for detail input. Works for older users. Fast enough for right-after-eating logging.

**Bucket gauge.** Circular gauge, fills and changes color green → amber → orange → red. Percentage displayed prominently. Personal threshold lines marked on the gauge ring.

**Day context.** Four options: Home Day, Work Day, Traveling, Social Plans. Changes the advice text. Core insight: the same bucket level means different things depending on what's at stake.

**Bottom tab navigation.** Today / Log / Check In / History. Large tap targets, emoji + label.

**Warm, non-clinical aesthetic.** Cream/amber palette. Serif + sans-serif type. Feels personal, not medical. The app should feel like it was built by someone who has AG, not a wellness startup.

**No streaks, no shame.** AG already carries enough anxiety. The app does not punish missed logging days or bad choices. It provides information, not judgment.

---

## Data Model

```javascript
// User profile
{
  userId: string,
  name: string,
  igeNumber: number,           // IgE lab result (kU/L)
  thresholds: {
    gi: number,                // % at which GI symptoms typically occur
    hives: number,             // % at which hives typically occur
    severe: number             // % at which severe reactions occur
  },
  createdAt: timestamp
}

// Daily log entry
{
  userId: string,
  date: string,                // YYYY-MM-DD
  dayContext: string,          // 'home' | 'work' | 'travel' | 'social'
  items: [
    {
      triggerId: string,       // e.g., 'beef', 'alcohol', 'heat'
      label: string,
      category: string,        // 'meat' | 'dairy' | 'hidden' | 'cofactor' | 'otc'
      baseLoad: number,        // base bucket % contribution
      amount: string,          // 'small' | 'moderate' | 'large'
      effectiveLoad: number,   // baseLoad * amount multiplier
      loggedAt: timestamp
    }
  ],
  totalLoad: number,           // sum of effectiveLoad
  notes: string
}

// Morning check-in
{
  userId: string,
  date: string,                // YYYY-MM-DD (the morning after)
  symptoms: string[],          // ['hives', 'gi', 'foggy', 'fine', etc.]
  reactionSeverity: number,    // 0-3 scale
  loggedAt: timestamp
}
```

---

## Trigger Library

### Meat & Mammal
| ID | Label | Base Load | Notes |
|----|-------|-----------|-------|
| beef | Beef | 25% | Steak, burger, roast, ground beef |
| pork | Pork | 20% | Bacon, ham, sausage, pork chops |
| lamb | Lamb | 28% | High alpha-gal content |
| venison | Venison | 25% | Deer, elk, bison |
| rabbit | Rabbit | 22% | Often overlooked mammal |

### Dairy
| ID | Label | Base Load | Notes |
|----|-------|-----------|-------|
| dairy | Milk/Cream | 8% | Whole milk, cream, butter |
| cheese | Cheese | 10% | Aged cheese has less alpha-gal |

### Hidden Sources
| ID | Label | Base Load | Notes |
|----|-------|-----------|-------|
| gelatin | Gelatin | 12% | Gummies, marshmallows, broth, some capsules |
| lard | Lard/Tallow | 15% | Baked goods, frying oil — often unlabeled |

### Co-factors (ceiling-lowerers)
| ID | Label | Base Load | Notes |
|----|-------|-----------|-------|
| alcohol | Alcohol | 15% | Lowers reaction threshold |
| nsaids | NSAIDs | 20% | Ibuprofen, aspirin, naproxen — significant cofactor |
| heat | Heat/Hot | 13% | Hot shower, sun, sauna, fever |
| exercise | Exercise | 10% | Vigorous physical activity |
| illness | Sick/Stress | 22% | Illness, poor sleep, high stress |

### OTC Medicines
| ID | Label | Base Load | Notes |
|----|-------|-----------|-------|
| nsaids | NSAIDs | 20% | Advil, Motrin, Aleve — major cofactor most users don't know about |
| gelcaps | Gel Capsules | 10% | Many OTC capsules contain gelatin — check your supplements |

---

## Amount Multipliers
- Small: 0.5x base load
- Moderate: 1.0x base load
- Large: 1.5x base load

---

## Design System

**Color palette:**
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

**Typography:**
- Display/headings: Lora (serif, warm)
- Body/UI: DM Sans
- Import: `https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap`

**Tile sizing:** Minimum 96px wide, 44px+ tap targets everywhere, large emoji icons (34-56px)

**Border radius:** 13-18px for cards/tiles, 20px for pills/tags, 14px for primary buttons

---

## Tech Stack

- **Framework:** React (PWA)
- **Backend/Auth:** Firebase (Firestore + Firebase Auth)
- **Hosting:** Firebase Hosting
- **Styling:** Inline styles (established pattern from prototype)
- **Icons:** Emoji (universal, no dependencies)
- **Fonts:** Google Fonts (Lora + DM Sans)

The developer has prior experience with this stack from building Pantry Champion, a Firebase-based household inventory PWA.

---

## Legal / Compliance

- Threshold is a personal logging tool, not a medical device
- Does not provide diagnosis or medical advice
- Onboarding disclaimer required: one screen, plain English, one tap to acknowledge
- Suggested text: *"Threshold is a personal tracking tool. It is not a medical device and does not provide medical advice. Always consult your doctor before making health decisions."*
- Privacy policy required before any public release (Firebase stores personal health data)
- HIPAA does not technically apply to consumer wellness apps, but honest data handling language is required

---

## What to Build First in Claude Code

1. Set up Firebase project + React PWA scaffold
2. Firebase Auth (email/password, simple)
3. Onboarding flow: disclaimer → name + IgE → initial threshold estimates
4. Home screen with bucket gauge + threshold markers + day context
5. Log screen with tile grid + detail modal
6. Firebase persistence for daily logs
7. Morning check-in with Firebase persistence
8. 3-day rolling strip on home screen
9. Profile screen
10. PWA manifest + service worker for home screen install

---

## Prototype Reference

A working React prototype was built in Claude.ai covering: home screen, bucket gauge, tile grid, tile detail modal (with amount selector and load impact preview), morning check-in, day context selector, and contextual advice text. That prototype file is available as `threshold-app.jsx` and can be used as a direct reference for component structure and visual design.

---

*Built by someone who has AG. For people who have AG.*
