export const TRIGGERS = [
  { id: 'beef',     label: 'Beef',        emoji: '🥩', cat: 'meat',     load: 25, note: 'Steak, burger, roast, ground beef' },
  { id: 'pork',     label: 'Pork',        emoji: '🐖', cat: 'meat',     load: 20, note: 'Bacon, ham, sausage, pork chops' },
  { id: 'lamb',     label: 'Lamb',        emoji: '🐑', cat: 'meat',     load: 28, note: 'High alpha-gal content' },
  { id: 'venison',  label: 'Venison',     emoji: '🦌', cat: 'meat',     load: 25, note: 'Deer, elk, bison' },
  { id: 'rabbit',   label: 'Rabbit',      emoji: '🐇', cat: 'meat',     load: 22, note: 'Often overlooked mammal' },
  { id: 'dairy',    label: 'Milk/Cream',  emoji: '🥛', cat: 'dairy',    load: 8,  note: 'Whole milk, cream, butter' },
  { id: 'cheese',   label: 'Cheese',      emoji: '🧀', cat: 'dairy',    load: 10, note: 'Aged cheese has less alpha-gal' },
  { id: 'gelatin',  label: 'Gelatin',     emoji: '🍬', cat: 'hidden',   load: 12, note: 'Gummies, marshmallows, gel caps, broth' },
  { id: 'lard',     label: 'Lard/Tallow', emoji: '🫙', cat: 'hidden',   load: 15, note: 'Baked goods, frying oils — often unlabeled' },
  { id: 'alcohol',  label: 'Alcohol',     emoji: '🍷', cat: 'cofactor', load: 15, note: 'Lowers your reaction threshold' },
  { id: 'nsaids',   label: 'NSAIDs',      emoji: '💊', cat: 'cofactor', load: 20, note: 'Ibuprofen (Advil), aspirin, naproxen — one of the most significant AG cofactors. Many people don\'t know this.' },
  { id: 'heat',     label: 'Heat/Hot',    emoji: '🌡️', cat: 'cofactor', load: 13, note: 'Hot shower, sun, sauna, fever' },
  { id: 'exercise', label: 'Exercise',    emoji: '🏃', cat: 'cofactor', load: 10, note: 'Vigorous physical activity' },
  { id: 'illness',  label: 'Sick/Stress', emoji: '🤒', cat: 'cofactor', load: 22, note: 'Illness, poor sleep, high stress' },
  { id: 'gelcaps',  label: 'Gel Capsules',emoji: '💉', cat: 'otc',      load: 10, note: 'Many OTC capsules contain gelatin — check your supplements' },
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

export const AMOUNT_MULTIPLIERS = { small: 0.5, moderate: 1, large: 1.5 };

export const LOG_CATEGORIES = [
  { key: 'meat',     label: 'Meat & Mammal' },
  { key: 'dairy',    label: 'Dairy' },
  { key: 'hidden',   label: 'Hidden Sources' },
  { key: 'cofactor', label: 'Co-factors' },
  { key: 'otc',      label: 'OTC Medicines' },
];
