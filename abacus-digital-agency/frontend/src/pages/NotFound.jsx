import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import CTAButton from '@components/common/CTAButton';
import GradientBlob from '@components/common/GradientBlob';
import SEO from '@components/common/SEO';

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <SEO title="Page Not Found" description="This page doesn't exist." url="/404" noindex />
      <GradientBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={500} variant="subtle" />
      <Container className="relative text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-display text-8xl font-semibold text-gradient">404</p>
          <h1 className="mt-4 font-display text-2xl font-semibold">This page went missing.</h1>
          <p className="mx-auto mt-3 max-w-sm text-text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButton to="/">Back to Home</CTAButton>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
