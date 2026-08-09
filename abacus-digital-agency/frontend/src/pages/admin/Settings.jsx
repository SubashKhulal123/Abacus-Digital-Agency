import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiHome, FiInfo, FiDroplet, FiLayout, FiSearch, FiShare2, FiMail as FiMailIcon,
  FiCloud, FiDatabase, FiSave, FiCheck, FiDownload,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Skeleton from '@components/common/Skeleton';
import { THEMES } from '@constants/themes';
import { useAdminSettings, useAdminEnvConfig, useUpdateSettings, useDownloadBackup } from '@hooks/useAdmin';
import { cn } from '@lib/utils';

const TABS = [
  { id: 'hero', label: 'Hero', icon: FiHome },
  { id: 'about', label: 'About', icon: FiInfo },
  { id: 'theme', label: 'Theme', icon: FiDroplet },
  { id: 'footer', label: 'Footer', icon: FiLayout },
  { id: 'seo', label: 'SEO & Analytics', icon: FiSearch },
  { id: 'social', label: 'Social Links', icon: FiShare2 },
  { id: 'smtp', label: 'SMTP', icon: FiMailIcon },
  { id: 'cloudinary', label: 'Cloudinary', icon: FiCloud },
  { id: 'backup', label: 'Backup', icon: FiDatabase },
];

const inputCls = 'w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-2.5 text-sm outline-none focus:border-accent';
const labelCls = 'mb-2 block text-sm font-medium text-text-secondary';

function SaveButton({ onClick, isPending, saved }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
    >
      {saved ? <FiCheck className="h-4 w-4" /> : <FiSave className="h-4 w-4" />}
      {isPending ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
    </button>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('hero');
  const { data: settings, isLoading } = useAdminSettings();
  const { data: envConfig } = useAdminEnvConfig();
  const updateMutation = useUpdateSettings();
  const downloadBackup = useDownloadBackup();

  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = 'Settings — Admin';
  }, []);

  useEffect(() => {
    if (settings && !form) setForm(settings);
  }, [settings, form]);

  if (isLoading || !form) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  const setPath = (path, value) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i += 1) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const getPath = (path) => path.split('.').reduce((acc, k) => acc?.[k], form);

  const save = async (payload) => {
    setSaved(false);
    try {
      await updateMutation.mutateAsync(payload);
      setSaved(true);
      toast.success('Settings saved');
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    }
  };

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Website Settings</h1>
      <p className="mb-8 text-sm text-text-secondary">Control every editable aspect of the public site.</p>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border-subtle pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors',
              activeTab === tab.id ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-text-secondary hover:border-accent/40'
            )}
          >
            <tab.icon className="h-3.5 w-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="glass-panel rounded-2xl p-6 sm:p-8">
        {activeTab === 'hero' && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Badge Text</label>
              <input className={inputCls} value={getPath('heroContent.badge') || ''} onChange={(e) => setPath('heroContent.badge', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={getPath('heroContent.title') || ''} onChange={(e) => setPath('heroContent.title', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Title Highlight (gradient text)</label>
              <input className={inputCls} value={getPath('heroContent.highlight') || ''} onChange={(e) => setPath('heroContent.highlight', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <textarea rows={3} className={inputCls} value={getPath('heroContent.subtitle') || ''} onChange={(e) => setPath('heroContent.subtitle', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Primary CTA Label</label>
                <input className={inputCls} value={getPath('heroContent.primaryCtaLabel') || ''} onChange={(e) => setPath('heroContent.primaryCtaLabel', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Primary CTA Link</label>
                <input className={inputCls} value={getPath('heroContent.primaryCtaLink') || ''} onChange={(e) => setPath('heroContent.primaryCtaLink', e.target.value)} />
              </div>
            </div>
            <SaveButton onClick={() => save({ heroContent: form.heroContent })} isPending={updateMutation.isPending} saved={saved} />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Our Story</label>
              <textarea rows={5} className={inputCls} value={getPath('aboutContent.story') || ''} onChange={(e) => setPath('aboutContent.story', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Mission</label>
              <textarea rows={3} className={inputCls} value={getPath('aboutContent.mission') || ''} onChange={(e) => setPath('aboutContent.mission', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Vision</label>
              <textarea rows={3} className={inputCls} value={getPath('aboutContent.vision') || ''} onChange={(e) => setPath('aboutContent.vision', e.target.value)} />
            </div>
            <SaveButton onClick={() => save({ aboutContent: form.aboutContent })} isPending={updateMutation.isPending} saved={saved} />
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Default Mode</label>
              <div className="flex gap-3">
                {['dark', 'light'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPath('themeSettings.defaultMode', mode)}
                    className={cn('rounded-lg border px-4 py-2 text-sm capitalize', getPath('themeSettings.defaultMode') === mode ? 'border-accent bg-accent text-accent-foreground' : 'border-border')}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Default Theme</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPath('themeSettings.defaultTheme', t.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs',
                      getPath('themeSettings.defaultTheme') === t.id ? 'border-accent' : 'border-border'
                    )}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.swatch }} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <SaveButton onClick={() => save({ themeSettings: form.themeSettings })} isPending={updateMutation.isPending} saved={saved} />
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Footer Text / Copyright</label>
              <input className={inputCls} value={form.footerText || ''} onChange={(e) => setForm({ ...form, footerText: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Contact Email</label>
              <input className={inputCls} value={form.contactEmail || ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Contact Phone</label>
              <input className={inputCls} value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input className={inputCls} value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <SaveButton
              onClick={() => save({ footerText: form.footerText, contactEmail: form.contactEmail, contactPhone: form.contactPhone, address: form.address })}
              isPending={updateMutation.isPending}
              saved={saved}
            />
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Default Meta Title</label>
              <input className={inputCls} value={getPath('seoDefaults.title') || ''} onChange={(e) => setPath('seoDefaults.title', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Default Meta Description</label>
              <textarea rows={3} className={inputCls} value={getPath('seoDefaults.description') || ''} onChange={(e) => setPath('seoDefaults.description', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Google Analytics Measurement ID</label>
              <input
                className={inputCls}
                placeholder="G-XXXXXXXXXX"
                value={getPath('analytics.googleAnalyticsId') || ''}
                onChange={(e) => setPath('analytics.googleAnalyticsId', e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Google Tag Manager ID</label>
              <input
                className={inputCls}
                placeholder="GTM-XXXXXXX"
                value={getPath('analytics.googleTagManagerId') || ''}
                onChange={(e) => setPath('analytics.googleTagManagerId', e.target.value)}
              />
            </div>
            <SaveButton
              onClick={() => save({ seoDefaults: form.seoDefaults, analytics: form.analytics })}
              isPending={updateMutation.isPending}
              saved={saved}
            />
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-5">
            {['twitter', 'linkedin', 'github', 'instagram', 'dribbble', 'behance', 'youtube'].map((key) => (
              <div key={key}>
                <label className={cn(labelCls, 'capitalize')}>{key}</label>
                <input
                  className={inputCls}
                  placeholder={`https://${key}.com/...`}
                  value={getPath(`socialLinks.${key}`) || ''}
                  onChange={(e) => setPath(`socialLinks.${key}`, e.target.value)}
                />
              </div>
            ))}
            <SaveButton onClick={() => save({ socialLinks: form.socialLinks })} isPending={updateMutation.isPending} saved={saved} />
          </div>
        )}

        {activeTab === 'smtp' && (
          <div className="space-y-4">
            <p className="mb-2 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-xs text-warning">
              SMTP credentials are environment variables (.env), not database fields — this keeps secrets out of the
              database. To change them, update the backend .env file and restart the server.
            </p>
            {envConfig ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-text-muted">Host</p><p>{envConfig.smtp.host || '—'}</p></div>
                <div><p className="text-xs text-text-muted">Port</p><p>{envConfig.smtp.port || '—'}</p></div>
                <div><p className="text-xs text-text-muted">User</p><p className="font-mono">{envConfig.smtp.user || '—'}</p></div>
                <div><p className="text-xs text-text-muted">Status</p><p className={envConfig.smtp.configured ? 'text-success' : 'text-danger'}>{envConfig.smtp.configured ? 'Configured' : 'Not configured'}</p></div>
              </div>
            ) : (
              <Skeleton className="h-24 w-full" />
            )}
          </div>
        )}

        {activeTab === 'cloudinary' && (
          <div className="space-y-4">
            <p className="mb-2 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-xs text-warning">
              Cloudinary credentials are environment variables (.env), not database fields. To change them, update
              the backend .env file and restart the server.
            </p>
            {envConfig ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-text-muted">Cloud Name</p><p>{envConfig.cloudinary.cloudName || '—'}</p></div>
                <div><p className="text-xs text-text-muted">API Key</p><p className="font-mono">{envConfig.cloudinary.apiKey || '—'}</p></div>
                <div><p className="text-xs text-text-muted">Status</p><p className={envConfig.cloudinary.configured ? 'text-success' : 'text-danger'}>{envConfig.cloudinary.configured ? 'Configured' : 'Not configured'}</p></div>
              </div>
            ) : (
              <Skeleton className="h-24 w-full" />
            )}
          </div>
        )}

        {activeTab === 'backup' && (
          <div>
            <p className="mb-4 text-sm text-text-secondary">
              Download a full JSON export of all public content (projects, blogs, services, team, testimonials,
              clients, technologies, FAQs, statistics, jobs, and settings). Contact messages and applications
              (personal data) are excluded from this export by design.
            </p>
            <button
              onClick={() => downloadBackup.mutate()}
              disabled={downloadBackup.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
            >
              <FiDownload className="h-4 w-4" /> {downloadBackup.isPending ? 'Generating...' : 'Download Backup'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
