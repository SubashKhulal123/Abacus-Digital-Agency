
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiUser, FiLogOut, FiSettings, FiChevronDown, FiMenu } from 'react-icons/fi';
import ThemeSwitcher from '@components/theme/ThemeSwitcher';
import NotificationsDropdown from './NotificationsDropdown';
import GlobalSearch from '@components/common/GlobalSearch';
import { useAuthContext } from '@context/AuthContext';
import { useClickOutside } from '@hooks/useClickOutside';

/**
 * @param {() => void} onMenuClick - opens the mobile/tablet sidebar drawer (AdminLayout owns the open state)
 */
export default function Topbar({ onMenuClick }) {
  const { admin, logout } = useAuthContext();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setProfileOpen(false), profileOpen);

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

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-bg/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent lg:hidden"
        >
          <FiMenu className="h-4 w-4" />
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-bg-surface/50 px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent sm:flex-none"
        >
          <FiSearch className="h-4 w-4 shrink-0" />
          <span className="hidden truncate sm:inline">Search anything...</span>
          <kbd className="ml-2 hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] sm:inline">⌘K</kbd>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ThemeSwitcher />
        <NotificationsDropdown />

        <div className="relative" ref={ref}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:border-accent"
          >
            {admin?.avatar?.url ? (
              <img src={admin.avatar.url} alt={admin.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                <FiUser className="h-4 w-4" />
              </span>
            )}
            <span className="hidden text-sm font-medium sm:inline">{admin?.name}</span>
            <FiChevronDown className="h-3.5 w-3.5 text-text-muted" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="glass-panel absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-xl p-1.5"
              >
                <Link
                  to="/admin/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-bg-surface"
                >
                  <FiUser className="h-4 w-4" /> My Profile
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-bg-surface"
                >
                  <FiSettings className="h-4 w-4" /> Site Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-danger transition-colors hover:bg-danger/10"
                >
                  <FiLogOut className="h-4 w-4" /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
