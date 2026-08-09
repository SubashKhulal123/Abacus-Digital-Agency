import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Marquee from '@components/common/Marquee';
import Skeleton from '@components/common/Skeleton';
import { useTechnologies } from '@hooks/useContent';

export default function TechnologiesSection() {
  const { data: technologies, isLoading } = useTechnologies();

  return (
    <section className="border-y border-border-subtle py-20">
      <Container>
        <SectionHeading
          eyebrow="Latest Technologies"
          title="Our"
          highlight="modern toolkit"
          description="We choose tools based on the problem at hand, not habit — always current, always production-tested."
        />
      </Container>

      <div className="mt-14">
        {isLoading ? (
          <Container>
            <div className="flex gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-32 shrink-0 rounded-xl" />
              ))}
            </div>
          </Container>
        ) : (
          <Marquee speed="slow">
            {technologies?.map((tech) => (
              <motion.div
                key={tech._id}
                whileHover={{ y: -4 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-bg-surface/40 px-6 py-3.5"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tech.color }}
                />
                <span className="whitespace-nowrap text-sm font-medium">{tech.name}</span>
              </motion.div>
            ))}
          </Marquee>
        )}
      </div>
    </section>
  );
}
