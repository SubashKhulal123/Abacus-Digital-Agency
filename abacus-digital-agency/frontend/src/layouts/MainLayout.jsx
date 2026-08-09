import { Outlet } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import Maintenance from '@pages/Maintenance';
import { useSiteSettings } from '@hooks/useContent';

/**
 * Structural shell for all public-facing routes. Also gates the entire
 * public site behind the Maintenance page when SiteSettings.maintenanceMode
 * is enabled — the /admin routes use a separate layout entirely, so admins
 * can always log in to turn maintenance mode back off.
 */
export default function MainLayout() {
  const { data: settings } = useSiteSettings();

  if (settings?.maintenanceMode?.isEnabled) {
    return <Maintenance message={settings.maintenanceMode.message} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
