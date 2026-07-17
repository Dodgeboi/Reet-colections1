// Every piece of editable copy on the site, with its default wording.
// Owners change these in place (edit mode → tap the text); changes are
// stored in site.json under "text" and merged over these defaults.
export const TEXT_DEFAULTS = {
  "hero.title": "Wear the Celebration",
  "hero.subtitle": "Handpicked Indian ethnic & fusion wear, revealed live every evening. Join the live, claim your piece, and we'll set it aside just for you.",

  "trust.1.title": "New drops every evening", "trust.1.sub": "Fresh styles, live at 8 PM",
  "trust.2.title": "Selected with love", "trust.2.sub": "Every piece handpicked",
  "trust.3.title": "Ships nationwide", "trust.3.sub": "Carefully packed for you",
  "trust.4.title": "Easy size help", "trust.4.sub": "Message us anytime",

  "heritage.title": "Woven with heritage, chosen with love",
  "heritage.body": "Every saree, lehenga, and kurti is handpicked for the way it drapes, shines, and carries a story — from Banarasi weaves and zari work to delicate chikankari and bandhani. It's tradition you can wear, shared with the warmth of a small family boutique.",
  "heritage.p1.title": "Handpicked", "heritage.p1.sub": "Every piece chosen by hand",
  "heritage.p2.title": "Heritage fabrics", "heritage.p2.sub": "Weaves & handwork we cherish",
  "heritage.p3.title": "Live & personal", "heritage.p3.sub": "Shop with us each evening",

  "home.cta.title": "Be the first to shop the newest drops",
  "home.cta.body": "Join us live on Facebook each evening — claim your piece in the comments and we'll set it aside just for you.",

  "banner.collections.title": "The Collection",
  "banner.collections.subtitle": "Browse everything in the boutique. Tap a category to filter, then sort to find your favorite — new pieces drop on the live every evening.",
  "banner.live.title": "Live Every Evening",
  "banner.live.subtitle": "The boutique comes alive at 8 PM. Replay the latest lives below and shop straight from the video.",

  "about.heading": "Hi, I'm the heart behind Reet Collections",
  "about.p1": "What started as a love for beautiful Indian wear — and a habit of helping friends find the perfect outfit — slowly grew into something I never expected: a little boutique with a big, warm community around it.",
  "about.p2": "Every evening I go live, hold up the pieces I've handpicked, and chat with you about fit, fabric, and which colour suits you best. It's the part of my day I look forward to most. There are no warehouses here, no endless racks — just pieces I genuinely love and think you'll love too.",
  "about.quote": "“I want every woman who shops with me to feel a little more like herself when she puts the outfit on.”",
  "about.promise": "Each piece is selected with love and care, just for you. We're honored to be a part of your style journey.",
};

export function textOf(site, key) {
  return (site?.text && site.text[key]) || TEXT_DEFAULTS[key] || "";
}
