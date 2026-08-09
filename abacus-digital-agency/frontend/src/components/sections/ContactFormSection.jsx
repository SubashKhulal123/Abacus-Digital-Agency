import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FiSend, FiCheckCircle, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import { Button } from '@components/ui/button';
import { useSubmitContact, useSiteSettings } from '@hooks/useContent';
import { contactFormSchema } from '@utils/validationSchemas';

const BUDGET_OPTIONS = [
  { value: 'not-specified', label: 'Not sure yet' },
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 – $15,000' },
  { value: '15k-50k', label: '$15,000 – $50,000' },
  { value: '50k-plus', label: '$50,000+' },
];

function Field({ label, error, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-text-secondary">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger" role="alert">{error.message}</p>}
    </div>
  );
}

const inputClasses =
  'w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-accent';

export default function ContactFormSection({ showInfo = true }) {
  const { data: settings } = useSiteSettings();
  const submitMutation = useSubmitContact();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { budgetRange: 'not-specified' },
  });

  const onSubmit = async (data) => {
    try {
      await submitMutation.mutateAsync(data);
      reset();
      toast.success("Message sent! We'll be in touch soon.");
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Tell us about"
          highlight="your project"
          description="Fill out the form and we'll get back to you within one business day."
        />

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5">
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="glass-panel space-y-6 rounded-2xl p-8">
                <div className="flex items-start gap-3">
                  <FiMail className="mt-0.5 h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs text-text-muted">Email</p>
                    <p className="text-sm font-medium">{settings?.contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="mt-0.5 h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs text-text-muted">Phone</p>
                    <p className="text-sm font-medium">{settings?.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="mt-0.5 h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs text-text-muted">Location</p>
                    <p className="text-sm font-medium">{settings?.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className={showInfo ? 'lg:col-span-3' : 'lg:col-span-5'}
          >
            {isSubmitSuccessful && submitMutation.isSuccess ? (
              <div className="glass-panel flex flex-col items-center justify-center gap-3 rounded-2xl p-12 text-center">
                <FiCheckCircle className="h-10 w-10 text-success" />
                <h3 className="font-display text-xl font-semibold">Message sent!</h3>
                <p className="text-sm text-text-secondary">
                  Thanks for reaching out — we&apos;ll be in touch within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name" error={errors.name}>
                    <input id="name" {...register('name')} className={inputClasses} placeholder="Jane Doe" />
                  </Field>
                  <Field label="Email" htmlFor="email" error={errors.email}>
                    <input id="email" {...register('email')} className={inputClasses} placeholder="jane@company.com" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Phone (optional)" htmlFor="phone" error={errors.phone}>
                    <input id="phone" {...register('phone')} className={inputClasses} placeholder="+1 (555) 000-0000" />
                  </Field>
                  <Field label="Company (optional)" htmlFor="company" error={errors.company}>
                    <input id="company" {...register('company')} className={inputClasses} placeholder="Acme Inc." />
                  </Field>
                </div>
                <Field label="Subject" htmlFor="subject" error={errors.subject}>
                  <input id="subject" {...register('subject')} className={inputClasses} placeholder="New product build" />
                </Field>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Estimated budget" htmlFor="budgetRange" error={errors.budgetRange}>
                    <select id="budgetRange" {...register('budgetRange')} className={inputClasses}>
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Project type (optional)" htmlFor="projectType" error={errors.projectType}>
                    <input id="projectType" {...register('projectType')} className={inputClasses} placeholder="Web application" />
                  </Field>
                </div>
                <Field label="Message" htmlFor="message" error={errors.message}>
                  <textarea
                    id="message" {...register('message')}
                    rows={5}
                    className={inputClasses}
                    placeholder="Tell us a bit about what you're building..."
                  />
                </Field>

                {submitMutation.isError && (
                  <p className="text-sm text-danger">
                    {submitMutation.error?.message || 'Something went wrong. Please try again.'}
                  </p>
                )}

                <Button type="submit" size="lg" disabled={submitMutation.isPending} className="w-full sm:w-auto">
                  <span className="inline-flex items-center gap-2">
                    {submitMutation.isPending ? 'Sending...' : 'Send Message'}
                    <FiSend className="h-4 w-4" />
                  </span>
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
