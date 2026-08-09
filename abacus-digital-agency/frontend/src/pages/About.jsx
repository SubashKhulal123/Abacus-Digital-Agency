import PageHero from '@components/common/PageHero';
import AboutSection from '@components/sections/AboutSection';
import ValuesSection from '@components/sections/ValuesSection';
import TimelineSection from '@components/sections/TimelineSection';
import TeamSection from '@components/sections/TeamSection';
import StatsSection from '@components/sections/StatsSection';
import AwardsSection from '@components/sections/AwardsSection';
import TestimonialsSection from '@components/sections/TestimonialsSection';
import CTASection from '@components/sections/CTASection';
import SEO from '@components/common/SEO';

export default function About() {
  return (
    <>
      <SEO
        title="About Us"
        description="Meet the team behind Abacus Digital Agency — designers and engineers who own a product from first sketch through production deployment."
        url="/about"
      />
      <PageHero
        eyebrow="About Abacus"
        title="A team obsessed with"
        highlight="doing it right"
        description="We're designers and engineers who believe great products come from one accountable team, not a relay race of handoffs."
      />
      <AboutSection />
      <StatsSection />
      <ValuesSection />
      <TimelineSection />
      <TeamSection />
      <AwardsSection />
      <TestimonialsSection />
      <CTASection
        eyebrow="Join the Team"
        title="Want to build"
        highlight="with us?"
        description="We're always looking for senior designers and engineers who care about craft."
        primaryLabel="View Open Roles"
        primaryTo="/careers"
        secondaryLabel="Get in Touch"
        secondaryTo="/contact"
      />
    </>
  );
}
