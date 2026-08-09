import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiBriefcase, FiCheckCircle, FiUpload } from 'react-icons/fi';
import Container from '@components/common/Container';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import SEO, { buildJobPostingSchema } from '@components/common/SEO';
import { Button } from '@components/ui/button';
import { useJob, useApplyToJob } from '@hooks/useContent';
import { applicationFormSchema } from '@utils/validationSchemas';

const inputClasses =
  'w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-accent';

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-secondary">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger">{error.message}</p>}
    </div>
  );
}

export default function JobDetail() {
  const { slug } = useParams();
  const { data: job, isLoading, isError } = useJob(slug);
  const applyMutation = useApplyToJob();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(applicationFormSchema) });


  const onSubmit = async (data) => {
    if (!resumeFile) {
      setResumeError('Please attach your resume (PDF or Word doc).');
      return;
    }
    setResumeError('');

    const formData = new FormData();
    formData.append('jobPost', job._id);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') formData.append(key, value);
    });
    formData.append('resume', resumeFile);

    try {
      await applyMutation.mutateAsync(formData);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Container className="pb-24 pt-40">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-8 h-64 w-full rounded-2xl" />
      </Container>
    );
  }

  if (isError || !job) {
    return (
      <Container className="pb-24 pt-40">
        <ErrorState message="We couldn't find that role." />
      </Container>
    );
  }

  return (
    <section className="pb-24 pt-40 sm:pt-48">
      <SEO
        title={job.title}
        description={job.description?.slice(0, 160)}
        url={`/careers/${job.slug}`}
        structuredData={buildJobPostingSchema(job)}
      />
      <Container className="max-w-4xl">
        <Link
          to="/careers"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
        >
          <FiArrowLeft className="h-4 w-4" /> All Roles
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{job.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <FiBriefcase className="h-4 w-4" /> {job.department}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiMapPin className="h-4 w-4" /> {job.location}
            </span>
            <span className="capitalize">{job.type?.replace('-', ' ')}</span>
            {job.salaryRange?.isPublic && job.salaryRange?.min && (
              <span>
                ${job.salaryRange.min.toLocaleString()} – ${job.salaryRange.max.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <p className="leading-relaxed text-text-secondary">{job.description}</p>

              {job.responsibilities?.length > 0 && (
                <div>
                  <h2 className="mb-3 font-display text-lg font-semibold">Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.map((r) => (
                      <li key={r} className="text-sm text-text-secondary">— {r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {job.requirements?.length > 0 && (
                <div>
                  <h2 className="mb-3 font-display text-lg font-semibold">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((r) => (
                      <li key={r} className="text-sm text-text-secondary">— {r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {job.niceToHave?.length > 0 && (
                <div>
                  <h2 className="mb-3 font-display text-lg font-semibold">Nice to Have</h2>
                  <ul className="space-y-2">
                    {job.niceToHave.map((r) => (
                      <li key={r} className="text-sm text-text-secondary">— {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="glass-panel sticky top-28 rounded-2xl p-6">
                <h2 className="mb-5 font-display text-lg font-semibold">Apply for this role</h2>

                {submitted ? (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <FiCheckCircle className="h-9 w-9 text-success" />
                    <p className="text-sm font-medium">Application submitted!</p>
                    <p className="text-xs text-text-secondary">We&apos;ll be in touch if there&apos;s a fit.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Field label="Full name" error={errors.name}>
                      <input {...register('name')} className={inputClasses} placeholder="Jane Doe" />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input {...register('email')} className={inputClasses} placeholder="jane@email.com" />
                    </Field>
                    <Field label="Phone" error={errors.phone}>
                      <input {...register('phone')} className={inputClasses} placeholder="+1 (555) 000-0000" />
                    </Field>
                    <Field label="LinkedIn (optional)" error={errors.linkedinUrl}>
                      <input {...register('linkedinUrl')} className={inputClasses} placeholder="https://linkedin.com/in/..." />
                    </Field>
                    <Field label="Portfolio (optional)" error={errors.portfolioUrl}>
                      <input {...register('portfolioUrl')} className={inputClasses} placeholder="https://..." />
                    </Field>
                    <Field label="Years of experience" error={errors.experienceYears}>
                      <input
                        type="number"
                        min="0"
                        {...register('experienceYears')}
                        className={inputClasses}
                        placeholder="5"
                      />
                    </Field>
                    <Field label="Cover letter (optional)" error={errors.coverLetter}>
                      <textarea
                        {...register('coverLetter')}
                        rows={3}
                        className={inputClasses}
                        placeholder="Anything you'd like us to know..."
                      />
                    </Field>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">Resume</label>
                      <label
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-sm transition-colors ${
                          resumeFile ? 'border-accent text-accent' : 'border-border text-text-muted hover:border-accent/50'
                        }`}
                      >
                        <FiUpload className="h-4 w-4" />
                        {resumeFile ? resumeFile.name : 'Upload PDF or Word doc'}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      {resumeError && <p className="mt-1.5 text-xs text-danger">{resumeError}</p>}
                    </div>

                    {applyMutation.isError && (
                      <p className="text-sm text-danger">
                        {applyMutation.error?.message || 'Something went wrong. Please try again.'}
                      </p>
                    )}

                    <Button type="submit" className="w-full" disabled={applyMutation.isPending}>
                      {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
