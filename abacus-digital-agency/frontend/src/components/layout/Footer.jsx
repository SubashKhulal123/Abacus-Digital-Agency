import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Container from '@components/common/Container';
import logoMark from '@assets/logos/logo-mark.png';
import { useSiteSettings, useSubscribeNewsletter } from '@hooks/useContent';
import { useState } from 'react';

const FOOTER_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Product Design', to: '/services/product-design' },
      { label: 'Web Development', to: '/services/web-application-development' },
      { label: 'Mobile Development', to: '/services/mobile-app-development' },
      { label: 'All Services', to: '/services' },
    ],
  },
  {
    title: 'Work',
    links: [
      { label: 'Case Studies', to: '/portfolio' },
      { label: 'Testimonials', to: '/about#testimonials' },
    ],
  },
];

const SOCIAL_ICONS = {
  github: FiGithub,
  twitter: FiTwitter,
  linkedin: FiLinkedin,
  instagram: FiInstagram,
};

export default function Footer() {
  const { data: settings } = useSiteSettings();
  const subscribeMutation = useSubscribeNewsletter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeMutation.mutateAsync({ email, source: 'footer' });
      setStatus({ type: 'success', message: 'Subscribed! Check your inbox.' });
      setEmail('');
      toast.success('Subscribed! Check your inbox.');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong.' });
      toast.error(error.message || 'Something went wrong.');
    }
  };

  const socialLinks = settings?.socialLinks || {};

  return (
    <footer className="relative mt-32 border-t border-border-subtle bg-bg-surface/40">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <img src={logoMark} alt={settings?.siteName || 'Abacus Digital Agency'} className="h-9 w-9 rounded-full" />
              {settings?.siteName || 'Abacus Digital Agency'}
            </Link>
            <p className="mt-4 max-w-xs text-sm text-text-secondary">
              {settings?.tagline || 'We engineer digital experiences that convert.'}
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-xs">
              <label htmlFor="footer-newsletter" className="mb-2 block text-xs font-medium text-text-secondary">
                Get occasional updates on our work
              </label>
              <div className="flex items-center overflow-hidden rounded-full border border-border bg-bg pr-1 focus-within:border-accent">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-text-muted"
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  aria-label="Subscribe"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform hover:scale-105 disabled:opacity-50"
                >
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
              {status && (
                <p
                  className={`mt-2 text-xs ${status.type === 'success' ? 'text-success' : 'text-danger'}`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-text-secondary transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            {settings?.footerText || `© ${new Date().getFullYear()} Abacus Digital Agency.`}
          </p>
          <div className="flex items-center gap-3">
            {Object.entries(socialLinks).map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key];
              if (!Icon || !url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={key}
                  data-cursor-hover
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </Container>
    </footer>
  );
}
