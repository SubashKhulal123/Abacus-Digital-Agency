import Hero from '@components/sections/Hero';
import AboutSection from '@components/sections/AboutSection';
import ValuesSection from '@components/sections/ValuesSection';
import ServicesSection from '@components/sections/ServicesSection';
import WhyChooseUsSection from '@components/sections/WhyChooseUsSection';
import ProcessSection from '@components/sections/ProcessSection';
import PortfolioSection from '@components/sections/PortfolioSection';
import TechnologiesSection from '@components/sections/TechnologiesSection';
import IndustriesSection from '@components/sections/IndustriesSection';
import TeamSection from '@components/sections/TeamSection';
import StatsSection from '@components/sections/StatsSection';
import TestimonialsSection from '@components/sections/TestimonialsSection';
import ClientLogosSection from '@components/sections/ClientLogosSection';
import AwardsSection from '@components/sections/AwardsSection';
import PricingSection from '@components/sections/PricingSection';
import FaqSection from '@components/sections/FaqSection';
import BlogPreviewSection from '@components/sections/BlogPreviewSection';
import CareerPreviewSection from '@components/sections/CareerPreviewSection';
import OpenSourceSection from '@components/sections/OpenSourceSection';
import PartnersSection from '@components/sections/PartnersSection';
import CTASection from '@components/sections/CTASection';
import ContactFormSection from '@components/sections/ContactFormSection';
import SEO, { buildOrganizationSchema } from '@components/common/SEO';
import { useSiteSettings } from '@hooks/useContent';

export default function Home() {
  const { data: settings } = useSiteSettings();

  return (
    <>
      <SEO
        title={settings?.seoDefaults?.title}
        description={settings?.seoDefaults?.description}
        url="/"
        structuredData={settings ? buildOrganizationSchema(settings) : undefined}
      />
      <Hero />
      <ClientLogosSection />
      <AboutSection />
      <ValuesSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <PortfolioSection />
      <TechnologiesSection />
      <IndustriesSection />
      <TeamSection />
      <StatsSection />
      <TestimonialsSection />
      <AwardsSection />
      <PricingSection />
      <BlogPreviewSection />
      <CareerPreviewSection />
      <OpenSourceSection />
      <PartnersSection />
      <FaqSection />
      <CTASection />
      <ContactFormSection />
    </>
  );
}
