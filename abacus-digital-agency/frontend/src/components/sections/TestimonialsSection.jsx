import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import { useTestimonials } from '@hooks/useContent';

export default function TestimonialsSection() {
  const { data: testimonials, isLoading, isError } = useTestimonials({ featured: 'true' });
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (dir) => {
    if (!testimonials?.length) return;
    setDirection(dir);
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const current = testimonials?.[index];

  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Don't just take"
          highlight="our word for it"
        />

        {isError && <ErrorState message="We couldn't load testimonials right now." />}

        <div className="mx-auto mt-16 max-w-3xl">
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-2xl" />
          ) : testimonials?.length ? (
            <>
              <div className="glass-panel relative min-h-[280px] overflow-hidden rounded-2xl p-8 sm:p-12">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current?._id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mb-6 flex gap-1">
                      {Array.from({ length: current?.rating || 5 }).map((_, i) => (
                        <FiStar key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-balance font-display text-xl leading-relaxed sm:text-2xl">
                      &ldquo;{current?.message}&rdquo;
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <img
                        src={current?.clientAvatar?.url}
                        alt={current?.clientName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{current?.clientName}</p>
                        <p className="text-sm text-text-muted">
                          {current?.clientDesignation}, {current?.clientCompany}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Previous testimonial"
                  data-cursor-hover
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((t, i) => (
                    <button
                      key={t._id}
                      onClick={() => {
                        setDirection(i > index ? 1 : -1);
                        setIndex(i);
                      }}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? 'w-6 bg-accent' : 'w-1.5 bg-border'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => paginate(1)}
                  aria-label="Next testimonial"
                  data-cursor-hover
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
