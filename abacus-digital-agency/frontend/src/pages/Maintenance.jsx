import { motion } from 'framer-motion';
import { FiTool } from 'react-icons/fi';
import Container from '@components/common/Container';
import GradientBlob from '@components/common/GradientBlob';

/**
 * Rendered instead of the whole app when SiteSettings.maintenanceMode is
 * enabled. Deliberately self-contained (no data fetching) — this needs
 * to render correctly even if other API calls are being rejected.
 */
export default function Maintenance({ message }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg text-text">
      <GradientBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={500} />
      <Container className="relative text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <FiTool className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            We&apos;ll be <span className="text-gradient">back shortly</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-text-secondary">
            {message || 'We are currently performing scheduled maintenance. Please check back shortly.'}
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
