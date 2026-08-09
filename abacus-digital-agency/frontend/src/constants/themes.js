/**
 * Metadata for the 5 premium themes. Consumed by ThemeContext (for
 * validation/persistence) and by the theme-switcher UI component
 * (built in a later phase) to render swatches and labels.
 */
export const THEMES = [
  {
    id: 'midnight-violet',
    label: 'Midnight Violet',
    description: 'Indigo & violet on near-black — the signature theme',
    swatch: '#7C5CFC',
  },
  {
    id: 'electric-blue',
    label: 'Electric Blue',
    description: 'Cyan-blue on deep navy',
    swatch: '#2F8FFF',
  },
  {
    id: 'emerald-noir',
    label: 'Emerald Noir',
    description: 'Emerald & teal on charcoal-green',
    swatch: '#2FD98A',
  },
  {
    id: 'sunset-amber',
    label: 'Sunset Amber',
    description: 'Warm amber on espresso-brown',
    swatch: '#FF8A3D',
  },
  {
    id: 'crimson-steel',
    label: 'Crimson Steel',
    description: 'Red & rose on cool graphite',
    swatch: '#FF4661',
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);
export const DEFAULT_THEME = 'midnight-violet';

export const MODES = ['dark', 'light'];
export const DEFAULT_MODE = 'dark';

export const THEME_STORAGE_KEY = 'abacus-theme';
export const MODE_STORAGE_KEY = 'abacus-mode';
