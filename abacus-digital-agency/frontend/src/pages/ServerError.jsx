import { motion } from 'framer-motion';
import { FiRefreshCw, FiHome } from 'react-icons/fi';
import Container from '@components/common/Container';
import GradientBlob from '@components/common/GradientBlob';

/**
 * Shown by ErrorBoundary when a render error is caught anywhere in the
 * tree. Deliberately simple and dependency-light — if something crashed
 * badly enough to get here, this page needs to render with as few moving
 * parts as possible.
 */
export default function ServerError({ onRetry }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg text-text">
      <GradientBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={500} variant="subtle" />
      <Container className="relative text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-display text-8xl font-semibold text-gradient">500</p>
          <h1 className="mt-4 font-display text-2xl font-semibold">Something went wrong.</h1>
          <p className="mx-auto mt-3 max-w-sm text-text-secondary">
            We hit an unexpected error rendering this page. Try again, or head back home.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground"
              >
                <FiRefreshCw className="h-4 w-4" /> Try Again
              </button>
            )}
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium"
            >
              <FiHome className="h-4 w-4" /> Back to Home
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
