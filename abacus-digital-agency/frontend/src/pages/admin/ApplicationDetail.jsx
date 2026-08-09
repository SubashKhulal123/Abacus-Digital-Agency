import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiExternalLink } from 'react-icons/fi';
import Skeleton from '@components/common/Skeleton';
import { useAdminOne } from '@hooks/useAdminResource';
import { useUpdateApplicationStatus } from '@hooks/useAdmin';

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'interviewing', 'hired', 'rejected'];

export default function ApplicationDetail() {
  const { id } = useParams();
  const { data: app, isLoading } = useAdminOne('applications', id);
  const statusMutation = useUpdateApplicationStatus();

  useEffect(() => {
    document.title = 'Application — Admin';
  }, []);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/applications" className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent">
        <FiArrowLeft className="h-4 w-4" /> All Applications
      </Link>

      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <h1 className="font-display text-xl font-semibold">{app.name}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Applied for <span className="font-medium text-text">{app.jobPost?.title}</span>
            </p>
          </div>
          <a
            href={app.resume?.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
          >
            <FiDownload className="h-4 w-4" /> View Resume
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-border-subtle py-6 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-text-muted">Email</p>
            <p>{app.email}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Phone</p>
            <p>{app.phone}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Experience</p>
            <p>{app.experienceYears} years</p>
          </div>
          {app.portfolioUrl && (
            <div>
              <p className="text-xs text-text-muted">Portfolio</p>
              <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                View <FiExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          {app.linkedinUrl && (
            <div>
              <p className="text-xs text-text-muted">LinkedIn</p>
              <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                View <FiExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          {app.expectedSalary && (
            <div>
              <p className="text-xs text-text-muted">Expected Salary</p>
              <p>{app.expectedSalary}</p>
            </div>
          )}
        </div>

        {app.coverLetter && (
          <div className="border-b border-border-subtle py-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-text-muted">Cover Letter</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{app.coverLetter}</p>
          </div>
        )}

        <div className="pt-6">
          <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => statusMutation.mutate({ id, status, notifyApplicant: true })}
                disabled={statusMutation.isPending}
                className={`rounded-full border px-4 py-2 text-xs font-medium capitalize transition-colors ${
                  app.status === status
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border text-text-secondary hover:border-accent/40'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-text-muted">
            Changing status to shortlisted, hired, or rejected sends the applicant a notification email.
          </p>
        </div>
      </div>
    </div>
  );
}
