
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiBriefcase, FiFolder, FiFileText, FiMessageSquare,
  FiUserCheck, FiLayers, FiHelpCircle, FiBarChart2, FiBriefcase as FiJobs,
  FiMail, FiSend, FiImage, FiSettings, FiActivity, FiTerminal, FiChevronsLeft,
  FiChevronsRight, FiTag, FiX,
} from 'react-icons/fi';
import { cn } from '@lib/utils';
import logoMark from '@assets/logos/logo-mark.png';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', icon: FiGrid, end: true }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Projects', to: '/admin/projects', icon: FiFolder },
      { label: 'Services', to: '/admin/services', icon: FiBriefcase },
      { label: 'Blog Posts', to: '/admin/blogs', icon: FiFileText },
      { label: 'Categories', to: '/admin/categories', icon: FiTag },
      { label: 'Technologies', to: '/admin/technologies', icon: FiLayers },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Developers', to: '/admin/developers', icon: FiUsers },
      { label: 'Testimonials', to: '/admin/testimonials', icon: FiMessageSquare },
      { label: 'Clients', to: '/admin/clients', icon: FiUserCheck },
    ],
  },
  {
    label: 'Recruiting',
    items: [
      { label: 'Job Posts', to: '/admin/jobs', icon: FiJobs },
      { label: 'Applications', to: '/admin/applications', icon: FiUserCheck },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Messages', to: '/admin/messages', icon: FiMail },
      { label: 'Newsletter', to: '/admin/newsletter', icon: FiSend },
      { label: 'FAQs', to: '/admin/faqs', icon: FiHelpCircle },
      { label: 'Statistics', to: '/admin/statistics', icon: FiBarChart2 },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Media Library', to: '/admin/media', icon: FiImage },
      { label: 'Settings', to: '/admin/settings', icon: FiSettings },
      { label: 'Audit Logs', to: '/admin/audit-logs', icon: FiActivity },
      { label: 'System Logs', to: '/admin/logs', icon: FiTerminal },
    ],
  },
];

/**
 * @param {boolean} mobileOpen - whether the drawer is open on small/medium screens (< lg)
 * @param {() => void} onClose - closes the mobile drawer (backdrop click, X button, or nav link tap)
 */
export default function Sidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        // Mobile/tablet (< lg): fixed off-canvas drawer, slides in via transform
        'fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-border-subtle bg-bg shadow-2xl transition-transform duration-300 ease-premium',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop (lg+): back to a normal persistent sidebar, width driven by collapse state
        'lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 lg:bg-bg-surface/40 lg:shadow-none',
        collapsed ? 'lg:w-[72px]' : 'lg:w-64'
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border-subtle px-4">
        <img src={logoMark} alt="Abacus" className="h-8 w-8 shrink-0 rounded-full" />
        {!collapsed && <span className="font-display text-sm font-semibold">Admin Panel</span>}
        {/* Close button — mobile/tablet only, desktop uses the collapse toggle at the bottom instead */}
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-accent lg:hidden"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={collapsed ? item.label : undefined}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-surface hover:text-text',
                      isActive && 'bg-accent/10 text-accent'
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle — desktop only; mobile/tablet always shows the full drawer since it's an overlay, not persistent real estate */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden h-12 shrink-0 items-center justify-center gap-2 border-t border-border-subtle text-text-muted transition-colors hover:text-accent lg:flex"
      >
        {collapsed ? <FiChevronsRight className="h-4 w-4" /> : <FiChevronsLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
