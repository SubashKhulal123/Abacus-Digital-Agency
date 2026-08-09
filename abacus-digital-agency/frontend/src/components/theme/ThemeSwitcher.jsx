import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSun, FiMoon, FiCheck, FiDroplet } from 'react-icons/fi';
import { useTheme } from '@context/ThemeContext';
import { THEMES } from '@constants/themes';
import { useClickOutside } from '@hooks/useClickOutside';
import { cn } from '@lib/utils';

export default function ThemeSwitcher() {
  const { theme, setTheme, mode, toggleMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="flex items-center gap-2">
      {/* Dark / light toggle */}
      <button
        type="button"
        onClick={toggleMode}
        aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        data-cursor-hover
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-300 hover:border-accent hover:text-accent"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex"
          >
            {mode === 'dark' ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Theme palette picker */}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Choose a color theme"
          data-cursor-hover
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          <FiDroplet className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="glass-panel absolute right-0 top-full z-50 mt-3 w-64 rounded-lg p-2"
            >
              <p className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                Color theme
              </p>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-bg-surface',
                    theme === t.id && 'bg-bg-surface'
                  )}
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-bg"
                    style={{ backgroundColor: t.swatch, '--tw-ring-color': t.swatch }}
                  />
                  <span className="flex-1">
                    <span className="block font-medium">{t.label}</span>
                    <span className="block text-xs text-text-muted">{t.description}</span>
                  </span>
                  {theme === t.id && <FiCheck className="h-4 w-4 text-accent" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
