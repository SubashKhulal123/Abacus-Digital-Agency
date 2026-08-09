import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import Container from '@components/common/Container';
import GradientBlob from '@components/common/GradientBlob';
import { useSubscribeNewsletter } from '@hooks/useContent';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeMutation.mutateAsync({ email, source: 'blog-page' });
      setEmail('');
    } catch (error) {
      // error surfaced via subscribeMutation.error below
    }
  };

  return (
    <section className="relative overflow-hidden py-24">
      <GradientBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={500} variant="subtle" />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="glass-panel mx-auto max-w-2xl rounded-3xl p-10 text-center sm:p-14"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Newsletter</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Occasional dispatches, <span className="text-gradient">never spam</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-text-secondary">
            New case studies, engineering write-ups, and open roles — straight to your inbox, a
            few times a month at most.
          </p>

          {subscribeMutation.isSuccess ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-success">
              <FiCheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Subscribed! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md gap-2">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-border bg-bg px-5 py-3 text-sm outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground disabled:opacity-50"
              >
                <FiSend className="h-4 w-4" />
              </button>
            </form>
          )}
          {subscribeMutation.isError && (
            <p className="mt-3 text-xs text-danger">
              {subscribeMutation.error?.message || 'Something went wrong.'}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
