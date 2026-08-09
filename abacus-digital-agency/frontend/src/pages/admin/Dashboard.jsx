import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import {
  FiFolder, FiFileText, FiMail, FiUsers, FiAlertCircle, FiEye, FiTrendingUp,
} from 'react-icons/fi';
import StatCard from '@components/admin/StatCard';
import Skeleton from '@components/common/Skeleton';
import { useAdminDashboard } from '@hooks/useAdmin';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <p className="text-text-muted">{label}</p>
      <p className="font-semibold text-accent">{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function Dashboard() {
  const { data, isLoading } = useAdminDashboard();

  useEffect(() => {
    document.title = 'Dashboard — Admin';
  }, []);

  const s = data?.summary;

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">An overview of your site&apos;s content and activity.</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Published Projects" value={s.publishedProjects} icon={FiFolder} delay={0} />
            <StatCard label="Published Blog Posts" value={s.publishedBlogs} icon={FiFileText} delay={0.05} />
            <StatCard label="Unread Messages" value={s.unreadMessages} icon={FiMail} delay={0.1} />
            <StatCard label="Newsletter Subscribers" value={s.totalSubscribers} icon={FiUsers} delay={0.15} />
            <StatCard label="Pending Applications" value={s.pendingApplications} icon={FiAlertCircle} delay={0.2} />
            <StatCard label="Active Job Posts" value={s.activeJobs} icon={FiTrendingUp} delay={0.25} />
            <StatCard label="Total Media Files" value={s.totalMedia} icon={FiEye} delay={0.3} />
            <StatCard label="Total Team Members" value={s.totalDevelopers} icon={FiUsers} delay={0.35} />
          </div>

          {data.charts?.isPlaceholder && (
            <div className="mt-6 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-xs text-warning">
              {data.charts.placeholderNotice}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
              <p className="mb-1 font-display text-base font-semibold">Visitor Traffic</p>
              <p className="mb-4 text-xs text-text-muted">Last 30 days (simulated)</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.charts.visitors}>
                  <defs>
                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--color-accent))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="rgb(var(--color-accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border-subtle))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgb(var(--color-text-muted))' }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgb(var(--color-text-muted))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="rgb(var(--color-accent))" fill="url(#visitorGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <p className="mb-1 font-display text-base font-semibold">Revenue</p>
              <p className="mb-4 text-xs text-text-muted">Last 12 months (simulated)</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.charts.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border-subtle))" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'rgb(var(--color-text-muted))' }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgb(var(--color-text-muted))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="rgb(var(--color-accent-secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
              <p className="mb-4 font-display text-base font-semibold">Recent Activity</p>
              <div className="space-y-4">
                {data.recentActivity.length === 0 ? (
                  <p className="text-sm text-text-muted">No activity recorded yet.</p>
                ) : (
                  data.recentActivity.map((log) => (
                    <div key={log._id} className="flex items-start gap-3 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <div className="flex-1">
                        <p>
                          <span className="font-medium">{log.adminName}</span>{' '}
                          <span className="text-text-secondary">{log.description}</span>
                        </p>
                        <p className="text-xs text-text-muted">{timeAgo(log.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <p className="mb-4 font-display text-base font-semibold">Top Content</p>
              <div className="space-y-3">
                {data.topProjects.slice(0, 3).map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-sm">
                    <span className="line-clamp-1">{p.title}</span>
                    <span className="text-xs text-text-muted">{p.views} views</span>
                  </div>
                ))}
                {data.topBlogs.slice(0, 3).map((b) => (
                  <div key={b._id} className="flex items-center justify-between text-sm">
                    <span className="line-clamp-1">{b.title}</span>
                    <span className="text-xs text-text-muted">{b.views} views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
