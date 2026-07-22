export const TRIGGERS = [
  // Meat & Mammal
  { id: 'beef',     label: 'Beef',          emoji: '🥩', cat: 'meat',     load: 25, note: 'All cuts — steak, burger, roast, ground beef. One of the highest alpha-gal sources.' },
  { id: 'pork',     label: 'Pork',          emoji: '🐖', cat: 'meat',     load: 20, note: 'Bacon, ham, sausage, pork chops, ribs. Often hidden in restaurant dishes.' },
  { id: 'lamb',     label: 'Lamb',          emoji: '🐑', cat: 'meat',     load: 28, note: 'Among the highest alpha-gal concentrations of any common meat.' },
  { id: 'venison',  label: 'Venison/Bison', emoji: '🦌', cat: 'meat',     load: 25, note: 'Deer, elk, bison — all wild mammals carry alpha-gal.' },
  { id: 'rabbit',   label: 'Rabbit',        emoji: '🐇', cat: 'meat',     load: 22, note: 'Often overlooked. Appears in specialty dishes and stews.' },
  { id: 'veal',     label: 'Veal',          emoji: '🐄', cat: 'meat',     load: 25, note: 'Young beef — same alpha-gal exposure as beef.' },
  { id: 'hotdog',   label: 'Hot Dogs',      emoji: '🌭', cat: 'meat',     load: 18, note: 'Most hot dogs and deli meats contain pork and/or beef byproducts.' },

  // Dairy
  { id: 'milk',     label: 'Milk/Cream',    emoji: '🥛', cat: 'dairy',    load: 8,  note: 'Whole milk, half-and-half, heavy cream. Alpha-gal is present but at lower levels than meat.' },
  { id: 'butter',   label: 'Butter',        emoji: '🧈', cat: 'dairy',    load: 5,  note: 'Often hidden in cooking, sauces, and baked goods. Easy to miss.' },
  { id: 'cheese',   label: 'Cheese',        emoji: '🧀', cat: 'dairy',    load: 10, note: 'Aged cheeses tend to have less alpha-gal than fresh. All carry some risk.' },
  { id: 'icecream', label: 'Ice Cream',     emoji: '🍦', cat: 'dairy',    load: 12, note: 'Higher dairy content than milk alone. Watch for gelatin stabilizers as an added source.' },
  { id: 'yogurt',   label: 'Yogurt',        emoji: '🫙', cat: 'dairy',    load: 8,  note: 'Includes Greek yogurt. Often contains gelatin as a thickener — a double source.' },

  // Hidden Sources
  { id: 'gelatin',  label: 'Gelatin',       emoji: '🍬', cat: 'hidden',   load: 12, note: 'In gummies, marshmallows, Jell-O, puddings, and many gel capsules. Read labels.' },
  { id: 'broth',    label: 'Bone Broth',    emoji: '🍲', cat: 'hidden',   load: 15, note: 'Beef and pork bone broth is a concentrated hidden source. Common in soups and gravies.' },
  { id: 'lard',     label: 'Lard/Tallow',  emoji: '🫙', cat: 'hidden',   load: 15, note: 'Used in baked goods, pie crusts, and some restaurant frying — rarely labeled clearly.' },
  { id: 'worcsauce',label: 'Worcestershire',emoji: '🍶', cat: 'hidden',   load: 6,  note: 'Traditional recipes contain anchovies (fish, safe) but some brands add beef extract — check labels.' },
  { id: 'lanolin',  label: 'Lanolin',       emoji: '🧴', cat: 'hidden',   load: 5,  note: 'Sheep-derived ingredient in some lotions, lip balms, and nipple creams. Skin contact may contribute.', amountType: 'contact' },
  { id: 'supp',     label: 'Supplements',   emoji: '💊', cat: 'hidden',   load: 8,  note: 'Fish oil, collagen, and some vitamin capsules use bovine or porcine gelatin. Check "other ingredients."', amountType: 'dose' },

  // Co-factors (these lower your ceiling — same food hits harder)
  { id: 'alcohol',  label: 'Alcohol',       emoji: '🍷', cat: 'cofactor', load: 15, note: 'Alcohol can lower your reaction threshold, especially alongside mammalian food.', amountType: 'drinks' },
  { id: 'nsaids',   label: 'Ibuprofen/NSAIDs', emoji: '💊', cat: 'cofactor', load: 20, note: 'Advil, Motrin, Aleve, aspirin, naproxen — one of the most significant AG cofactors. Many people don\'t realize this.', amountType: 'dose' },
  { id: 'heat',     label: 'Heat/Hot',      emoji: '🌡️', cat: 'cofactor', load: 13, note: 'Hot shower, sauna, sun exposure, fever. Core body temperature rise amplifies reactions.', amountType: 'exposure' },
  { id: 'exercise', label: 'Exercise',      emoji: '🏃', cat: 'cofactor', load: 10, note: 'Vigorous activity, especially within hours of eating. Even a brisk walk can matter.', amountType: 'intensity' },
  { id: 'illness',  label: 'Sick/Stress',   emoji: '🤒', cat: 'cofactor', load: 22, note: 'Active illness, poor sleep, and high emotional stress all lower your tolerance ceiling.', amountType: 'severity' },
  { id: 'fatigue',  label: 'Exhaustion',    emoji: '😴', cat: 'cofactor', load: 12, note: 'Chronic sleep debt or a single bad night can meaningfully reduce tolerance.', amountType: 'severity' },

  // Medications
  { id: 'gelcaps',   label: 'Gel Capsules',        emoji: '💉', cat: 'otc', load: 10, note: 'Many OTC and prescription capsules use porcine or bovine gelatin shells. Ask your pharmacist.', amountType: 'dose' },
  { id: 'aspirin',   label: 'Aspirin',             emoji: '🔴', cat: 'otc', load: 15, note: 'A significant AG cofactor like ibuprofen. Includes baby aspirin taken daily.', amountType: 'dose' },
  { id: 'antihistamine', label: 'Daily Antihistamine', emoji: '🌼', cat: 'otc', load: 0, note: 'Allegra, Claritin, Zyrtec — a daily allergy medication, not a reaction to a specific exposure.', amountType: 'dose', isAntihistamine: true },
  { id: 'benadryl',  label: 'Benadryl',            emoji: '💊', cat: 'otc', load: 0, note: 'Taken reactively, during or after a reaction.', amountType: 'dose' },
  { id: 'pepcid',    label: 'Pepcid/Famotidine',   emoji: '🫧', cat: 'otc', load: 0, note: 'An H2 blocker — often taken ahead of a riskier meal, or when nervous about incidental exposure. Reduces stomach acid, which may affect how alpha-gal is broken down.', amountType: 'dose', isAcidBlocker: true },
];

export const SYMPTOMS = [
  { id: 'fine',    label: 'Feeling Good', emoji: '✅' },
  { id: 'hives',   label: 'Hives/Itch',   emoji: '🔴' },
  { id: 'gi',      label: 'GI / Stomach', emoji: '😣' },
  { id: 'stuffy',  label: 'Congestion',   emoji: '🤧' },
  { id: 'foggy',   label: 'Brain Fog',    emoji: '🌫️' },
  { id: 'tired',   label: 'Fatigue',      emoji: '😴' },
];

export const AMOUNT_MULTIPLIERS = { small: 0.5, moderate: 1, large: 1.5 };

export const AMOUNT_LABELS = {
  food: {
    small:    { label: 'Small',    desc: 'a few bites or sips' },
    moderate: { label: 'Moderate', desc: 'a normal serving' },
    large:    { label: 'Large',    desc: 'a large portion or several servings' },
  },
  drinks: {
    small:    { label: 'One drink',      desc: '' },
    moderate: { label: 'A few drinks',   desc: '2-3' },
    large:    { label: 'Several drinks', desc: '4 or more' },
  },
  dose: {
    small:    { label: 'One dose',       desc: '' },
    moderate: { label: 'Two doses',      desc: '' },
    large:    { label: 'Multiple doses', desc: '3 or more' },
  },
  exposure: {
    small:    { label: 'Brief exposure',    desc: 'a few minutes' },
    moderate: { label: 'Extended exposure', desc: '15-30 minutes' },
    large:    { label: 'Prolonged',         desc: 'sauna, hot yoga, fever' },
  },
  intensity: {
    small:    { label: 'Light activity', desc: 'a walk, light chores' },
    moderate: { label: 'Moderate',       desc: 'a workout' },
    large:    { label: 'Intense',        desc: 'hard training' },
  },
  severity: {
    small:    { label: 'Mild',     desc: '' },
    moderate: { label: 'Moderate', desc: '' },
    large:    { label: 'Severe',   desc: '' },
  },
  contact: {
    small:    { label: 'Brief contact',    desc: '' },
    moderate: { label: 'Regular use',      desc: '' },
    large:    { label: 'Extended contact', desc: '' },
  },
};

export const LOG_CATEGORIES = [
  { key: 'meat',     label: 'Meat & Mammal' },
  { key: 'dairy',    label: 'Dairy' },
  { key: 'hidden',   label: 'Hidden Sources' },
  { key: 'cofactor', label: 'Co-factors' },
  { key: 'otc',      label: 'Medications' },
];
