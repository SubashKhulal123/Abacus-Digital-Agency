import * as FiIcons from 'react-icons/fi';

const FALLBACK = FiIcons.FiCircle;

/**
 * CMS content stores icon references as plain strings (e.g. "FiTarget")
 * so they stay editable from the database without shipping code. This
 * resolves that string to the actual react-icons component at render
 * time, falling back to a neutral circle icon if the name is unknown/unset.
 */
export function getIcon(name) {
  if (!name) return FALLBACK;
  return FiIcons[name] || FALLBACK;
}
