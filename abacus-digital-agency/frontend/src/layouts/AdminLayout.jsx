

import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '@components/admin/Sidebar';
import Topbar from '@components/admin/Topbar';

/**
 * Structural shell for the admin dashboard (CMS).
 * Below the lg breakpoint (1024px — covers phones, tablets, and small/
 * split-screen laptop windows) the sidebar becomes an off-canvas drawer
 * triggered from the Topbar, with a dismissible backdrop, instead of a
 * persistent 256px column eating most of the viewport.
 */
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
