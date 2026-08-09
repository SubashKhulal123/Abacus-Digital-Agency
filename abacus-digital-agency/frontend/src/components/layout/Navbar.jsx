import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import Container from '@components/common/Container';
import ThemeSwitcher from '@components/theme/ThemeSwitcher';
import CTAButton from '@components/common/CTAButton';
import GlobalSearch from '@components/common/GlobalSearch';
import logoMark from '@assets/logos/logo-mark.png';
import { cn } from '@lib/utils';

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium',
        scrolled ? 'py-3' : 'py-6'
      )}
    >
      <Container>
        <div
          className={cn(
            'flex items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 ease-premium',
            scrolled
              ? 'glass-panel border-border-subtle'
              : 'border-transparent bg-transparent'
          )}
        >
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold" data-cursor-hover>
            <img src={logoMark} alt="Abacus Digital Agency" className="h-9 w-9 rounded-full" />
            Abacus
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                data-cursor-hover
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-text',
                    isActive && 'bg-bg-surface text-text'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search (Cmd+K)"
              data-cursor-hover
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <FiSearch className="h-4 w-4" />
            </button>
            <ThemeSwitcher />
            <CTAButton to="/contact" size="sm">
              Start a Project
            </CTAButton>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
            >
              <FiSearch className="h-4 w-4" />
            </button>
            <ThemeSwitcher />
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
            >
              {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <Container>
              <div className="glass-panel mt-3 flex flex-col gap-1 rounded-2xl p-4">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors',
                        isActive && 'bg-bg-surface text-text'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <CTAButton to="/contact" className="mt-2 w-full justify-center">
                  Start a Project
                </CTAButton>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
