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
  { id: 'lanolin',  label: 'Lanolin',       emoji: '🧴', cat: 'hidden',   load: 5,  note: 'Sheep-derived ingredient in some lotions, lip balms, and nipple creams. Skin contact may contribute.' },
  { id: 'supp',     label: 'Supplements',   emoji: '💊', cat: 'hidden',   load: 8,  note: 'Fish oil, collagen, and some vitamin capsules use bovine or porcine gelatin. Check "other ingredients."' },

  // Co-factors (these lower your ceiling — same food hits harder)
  { id: 'alcohol',  label: 'Alcohol',       emoji: '🍷', cat: 'cofactor', load: 15, note: 'Lowers your reaction threshold directly. A drink before eating mammals significantly increases risk.' },
  { id: 'nsaids',   label: 'Ibuprofen/NSAIDs', emoji: '💊', cat: 'cofactor', load: 20, note: 'Advil, Motrin, Aleve, aspirin, naproxen — one of the most significant AG cofactors. Many people don\'t realize this.', nsaidModifier: true },
  { id: 'heat',     label: 'Heat/Hot',      emoji: '🌡️', cat: 'cofactor', load: 13, note: 'Hot shower, sauna, sun exposure, fever. Core body temperature rise amplifies reactions.' },
  { id: 'exercise', label: 'Exercise',      emoji: '🏃', cat: 'cofactor', load: 10, note: 'Vigorous activity, especially within hours of eating. Even a brisk walk can matter.' },
  { id: 'illness',  label: 'Sick/Stress',   emoji: '🤒', cat: 'cofactor', load: 22, note: 'Active illness, poor sleep, and high emotional stress all lower your tolerance ceiling.' },
  { id: 'fatigue',  label: 'Exhaustion',    emoji: '😴', cat: 'cofactor', load: 12, note: 'Chronic sleep debt or a single bad night can meaningfully reduce tolerance.' },

  // OTC Medicines
  { id: 'gelcaps',  label: 'Gel Capsules',  emoji: '💉', cat: 'otc',      load: 10, note: 'Many OTC and prescription capsules use porcine or bovine gelatin shells. Ask your pharmacist.' },
  { id: 'aspirin',  label: 'Aspirin',       emoji: '🔴', cat: 'otc',      load: 15, note: 'A significant AG cofactor like ibuprofen. Includes baby aspirin taken daily.', nsaidModifier: true },
  { id: 'antacid',  label: 'Some Antacids', emoji: '🫧', cat: 'otc',      load: 5,  note: 'A few antacid brands use gelatin coatings or bovine-derived calcium. Check inactive ingredients.' },
];

export const SYMPTOMS = [
  { id: 'fine',    label: 'Feeling Good', emoji: '✅' },
  { id: 'hives',   label: 'Hives/Itch',   emoji: '🔴' },
  { id: 'gi',      label: 'GI / Stomach', emoji: '😣' },
  { id: 'stuffy',  label: 'Congestion',   emoji: '🤧' },
  { id: 'foggy',   label: 'Brain Fog',    emoji: '🌫️' },
  { id: 'tired',   label: 'Fatigue',      emoji: '😴' },
];

export const DAY_CONTEXTS = [
  { id: 'home',   label: 'Home Day',     emoji: '🏠', tip: 'Good day to test tolerance if you\'ve been curious.' },
  { id: 'work',   label: 'Work Day',     emoji: '💼', tip: 'Stay aware — stress can lower your threshold.' },
  { id: 'travel', label: 'Traveling',    emoji: '✈️', tip: 'Protect your bucket. Hidden sources everywhere.' },
  { id: 'social', label: 'Social Plans', emoji: '🥂', tip: 'Plan ahead so you can enjoy yourself.' },
];

export const TICK_REGIONS = [
  { key: 'northeast', label: 'Northeast' },
  { key: 'southeast', label: 'Southeast' },
  { key: 'midwest',   label: 'Midwest' },
  { key: 'southwest', label: 'Southwest' },
  { key: 'west',      label: 'West' },
  { key: 'other',     label: 'Other' },
];

export const TICK_ATTACHMENT_DURATIONS = [
  { key: 'crawling', label: 'Crawling / under 4 hrs' },
  { key: 'embedded', label: 'Embedded about a day' },
  { key: 'engorged', label: 'Engorged, over 24 hrs' },
];

export const TICK_SIZES = [
  { key: 'seed',  label: 'Speck / seed tick' },
  { key: 'nymph', label: 'Small / nymph' },
  { key: 'adult', label: 'Large / adult' },
];

// Amount-selector language and multipliers, by trigger id.
// Food defaults to a 3-point small/moderate/large scale. Cofactors that are
// scientifically binary (heat, exercise) use a 2-point scale instead of
// forcing a fake "moderate" middle option.
const DEFAULT_AMOUNT_OPTIONS = [
  { key: 'small',    label: 'Small',    descriptor: 'a few bites or sips',                mult: 0.5 },
  { key: 'moderate', label: 'Moderate', descriptor: 'a normal serving',                    mult: 1 },
  { key: 'large',    label: 'Large',    descriptor: 'a large portion or several servings', mult: 1.5 },
];

export const AMOUNT_OPTIONS_BY_TRIGGER = {
  illness: [ // Sick/Stress
    { key: 'small',    label: 'Mild',     descriptor: 'manageable, low-grade',        mult: 0.5 },
    { key: 'moderate', label: 'Moderate', descriptor: 'noticeably unwell or stressed', mult: 1 },
    { key: 'large',    label: 'Severe',   descriptor: 'acute illness or high stress',  mult: 1.5 },
  ],
  heat: [
    { key: 'small', label: 'Brief exposure',    descriptor: 'a few minutes',      mult: 0.6 },
    { key: 'large', label: 'Extended exposure', descriptor: 'prolonged exposure', mult: 1.4 },
  ],
  exercise: [
    { key: 'small', label: 'Light activity',  descriptor: 'a walk or easy movement',    mult: 0.6 },
    { key: 'large', label: 'Intense workout', descriptor: 'vigorous or prolonged exertion', mult: 1.4 },
  ],
  alcohol: [
    { key: 'small',    label: 'One drink',       descriptor: '', mult: 0.5 },
    { key: 'moderate', label: 'A few drinks',    descriptor: '', mult: 1 },
    { key: 'large',    label: 'Several drinks',  descriptor: '', mult: 1.5 },
  ],
};

export function getAmountOptions(triggerId) {
  return AMOUNT_OPTIONS_BY_TRIGGER[triggerId] ?? DEFAULT_AMOUNT_OPTIONS;
}

export function computeEffectiveLoad(trigger, amountKey) {
  const options = getAmountOptions(trigger.id);
  const mult = options.find(o => o.key === amountKey)?.mult ?? 1;
  return Math.round(trigger.load * mult);
}

// NSAIDs disrupt intestinal tight junctions; Tylenol/antihistamines do not.
// Only NSAID + simultaneous-with-food carries the full researcher-flagged load.
export const NSAID_TYPE_OPTIONS = [
  { key: 'nsaid', label: 'NSAID', descriptor: 'Ibuprofen, Naproxen, Aspirin' },
  { key: 'other', label: 'Other', descriptor: 'Tylenol, Antihistamine' },
];

export const NSAID_TIMING_OPTIONS = [
  { key: 'simultaneous', label: 'With or just before food', descriptor: '' },
  { key: 'apart',        label: 'Hours apart from food',    descriptor: '' },
];

const NSAID_LOAD_MULTIPLIERS = {
  nsaid_simultaneous: 1,
  nsaid_apart: 0.4,
  other_simultaneous: 0.15,
  other_apart: 0.1,
};

export function computeNsaidLoad(trigger, nsaidType, nsaidTiming) {
  const mult = NSAID_LOAD_MULTIPLIERS[`${nsaidType}_${nsaidTiming}`] ?? 1;
  return Math.round(trigger.load * mult);
}

// Alpha-gal concentrates in mammalian fat, not lean protein — same portion,
// higher effective load the fattier/more rendered the cut.
export const FAT_PROFILE_OPTIONS = [
  { key: 'lean',  label: 'Lean',            descriptor: 'sirloin, venison, lean pork',    mult: 0.8 },
  { key: 'fatty', label: 'Fatty/Rendered',  descriptor: 'bacon, sausage, marbled ribeye', mult: 1.3 },
  { key: 'organ', label: 'Organ/High-fat',  descriptor: 'lard, bone broth, suet',         mult: 1.5 },
];

export function computeFatAdjustedLoad(trigger, amountKey, fatProfileKey) {
  const amountMult = getAmountOptions(trigger.id).find(o => o.key === amountKey)?.mult ?? 1;
  const fatMult = FAT_PROFILE_OPTIONS.find(o => o.key === fatProfileKey)?.mult ?? 1;
  return Math.round(trigger.load * amountMult * fatMult);
}

export const LOG_CATEGORIES = [
  { key: 'meat',     label: 'Meat & Mammal' },
  { key: 'dairy',    label: 'Dairy' },
  { key: 'hidden',   label: 'Hidden Sources' },
  { key: 'cofactor', label: 'Co-factors' },
  { key: 'otc',      label: 'OTC Medicines' },
];
