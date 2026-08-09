import PageHero from '@components/common/PageHero';
import SEO from '@components/common/SEO';
import ContactFormSection from '@components/sections/ContactFormSection';
import FaqSection from '@components/sections/FaqSection';

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description="Tell us about your project and we'll get back to you within one business day."
        url="/contact"
      />
      <PageHero
        eyebrow="Contact"
        title="Let's build"
        highlight="something great"
        description="Tell us about your project and we'll get back to you within one business day."
      />
      <ContactFormSection />
      <FaqSection />
    </>
  );
}
