/**
 * UI configuration for the table tennis buying guide.
 * Filter options and quiz questions live here — product data comes from /api/tables.
 */

export const filterConfig = {
  priceRanges: [
    { label: 'Under $300', min: 0, max: 299 },
    { label: '$300 – $600', min: 300, max: 600 },
    { label: '$600 – $1,000', min: 600, max: 1000 },
    { label: 'Over $1,000', min: 1000, max: Infinity },
  ],
  skillLevels: [
    { value: 'beginner', label: 'Beginner', description: 'Casual fun, family use' },
    { value: 'intermediate', label: 'Intermediate', description: 'Regular competitive play' },
    { value: 'advanced', label: 'Advanced', description: 'Serious training' },
    { value: 'professional', label: 'Professional', description: 'Club / tournament use' },
  ],
  environments: [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
  ],
  sizes: [
    { value: 'full', label: 'Full Size (9ft)', description: 'Standard tournament dimensions' },
    { value: 'mid', label: 'Mid Size (7ft)', description: 'Fits smaller rooms' },
    { value: 'mini', label: 'Mini (5ft)', description: 'Kids or very tight spaces' },
  ],
  features: [
    { key: 'playbackMode', label: 'Solo Playback Mode' },
    { key: 'paddlesIncluded', label: 'Paddles Included' },
    { key: 'wheeledLegs', label: 'Wheeled Legs' },
    { key: 'foldable', label: 'Foldable' },
  ],
};

export const quizQuestions = [
  {
    id: 'environment',
    question: 'Where will you set up the table?',
    options: [
      { label: 'Indoors (basement, rec room)', value: 'indoor', emoji: '🏠' },
      { label: 'Outdoors (patio, backyard)', value: 'outdoor', emoji: '☀️' },
    ],
  },
  {
    id: 'space',
    question: 'How much space do you have?',
    options: [
      { label: 'Full room — no size limit', value: 'full', emoji: '🏟️' },
      { label: 'Limited — need a compact option', value: 'mid', emoji: '📐' },
    ],
  },
  {
    id: 'skillLevel',
    question: 'What best describes your play style?',
    options: [
      { label: 'Casual / Family fun', value: 'beginner', emoji: '🎉' },
      { label: 'Regular competitive play', value: 'intermediate', emoji: '🏓' },
      { label: 'Serious training / Competition', value: 'advanced', emoji: '🏆' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget?",
    options: [
      { label: 'Under $300', value: '0-299', emoji: '💰' },
      { label: '$300 – $600', value: '300-600', emoji: '💵' },
      { label: '$600+', value: '600-99999', emoji: '💎' },
    ],
  },
];

export const FAQ = [
  {
    question: 'What thickness table tennis table do I need?',
    answer:
      'Surface thickness is the single most important spec. Tables range from 12mm to 30mm. ' +
      '12–15mm tables are entry-level with inconsistent bounce — fine for kids. ' +
      '16–19mm is the sweet spot for home and recreational play, offering consistent bounce and good durability. ' +
      '20–25mm tables are near-tournament grade, ideal for serious players. ' +
      '25–30mm surfaces are ITTF competition standard used in professional and Olympic play. ' +
      'For most families, 16–19mm is the best value.',
  },
  {
    question: 'What is the difference between indoor and outdoor table tennis tables?',
    answer:
      'Indoor tables use a wood-based playing surface that delivers the most authentic, consistent bounce — preferred by serious players. ' +
      'However they will warp, swell, or delaminate if left outside. ' +
      'Outdoor tables use aluminum, resin, or coated surfaces that resist rain, UV rays, and temperature swings. ' +
      'The trade-off is a slightly different ball feel compared to wood. ' +
      'If your table will ever be left in a garage, patio, or anywhere exposed to moisture, always choose an outdoor-rated table.',
  },
  {
    question: 'How much room do I need for a full-size table tennis table?',
    answer:
      'A full-size regulation table is 9ft × 5ft (274cm × 152cm). ' +
      'To play comfortably, you need at least 5ft of clearance on each end and 3ft on each side. ' +
      'That means a minimum room size of roughly 19ft × 11ft (580cm × 335cm). ' +
      'If your space is smaller, consider a mid-size (7ft) or conversion top table. ' +
      'Most foldable tables can be stored upright in about 5ft × 2.5ft of floor space.',
  },
  {
    question: 'Is a foldable table tennis table worth it?',
    answer:
      'Yes — for almost everyone. Foldable tables store upright against a wall and many roll on casters, letting you clear the space in minutes. ' +
      'Modern foldable tables are structurally just as solid as non-folding models. ' +
      'Look for tables with locking casters so it stays put during play, and a playback mode (one half folds up independently) for solo practice. ' +
      'The only reason to skip folding is if the table is a permanent installation in a dedicated game room.',
  },
  {
    question: 'What are the best table tennis table brands?',
    answer:
      'STIGA and JOOLA dominate the beginner to intermediate market with excellent value. ' +
      'Butterfly is the gold standard for competitive and professional play — most world-class tournaments use Butterfly tables. ' +
      'Cornilleau is the top choice for outdoor tables, trusted for weather durability. ' +
      'Killerspin offers stylish premium tables for design-conscious buyers. ' +
      'For most buyers, JOOLA or STIGA at the 18mm+ level offers the best balance of price, quality, and brand support.',
  },
  {
    question: 'What is playback mode on a ping pong table?',
    answer:
      'Playback mode (also called solo mode) lets you fold one half of the table upright at an angle, creating a backboard you can hit balls against — like a solo rally machine. ' +
      'It\'s a great feature for practicing serves, returns, and consistency without a partner. ' +
      'Most foldable tables in the $300+ range support playback mode. ' +
      'If you plan to practice alone, make sure it\'s listed in the table\'s features.',
  },
];
