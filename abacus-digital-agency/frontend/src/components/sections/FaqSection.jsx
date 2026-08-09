import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useFaqs } from '@hooks/useContent';
import { cn } from '@lib/utils';

export default function FaqSection() {
  const { data: faqs, isLoading } = useFaqs();
  const [openId, setOpenId] = useState(null);

  return (
    <section id="faq" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Questions you might"
          highlight="be asking"
        />

        <div className="mx-auto mt-16 max-w-2xl space-y-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
            : faqs?.map((faq) => {
                const isOpen = openId === faq._id;
                return (
                  <div
                    key={faq._id}
                    className="overflow-hidden rounded-xl border border-border transition-colors hover:border-accent/30"
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq._id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-medium">{faq.question}</span>
                      <FiPlus
                        className={cn(
                          'h-4 w-4 shrink-0 text-accent transition-transform duration-300',
                          isOpen && 'rotate-45'
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
