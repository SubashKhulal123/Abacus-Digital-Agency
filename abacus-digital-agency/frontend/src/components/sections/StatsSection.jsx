import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import AnimatedCounter from '@components/common/AnimatedCounter';
import Skeleton from '@components/common/Skeleton';
import { useStatistics } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const { data: stats, isLoading } = useStatistics();
  const gridRef = useRef(null);

  useEffect(() => {
    if (isLoading || !gridRef.current) return undefined;

    const cards = gridRef.current.querySelectorAll('[data-stat-card]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Achievements"
          title="Numbers that reflect"
          highlight="real client outcomes"
        />

        <div ref={gridRef} className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-2xl" />)
            : stats?.map((stat) => {
                const Icon = getIcon(stat.icon);
                return (
                  <div
                    key={stat._id}
                    data-stat-card
                    className="glass-panel flex flex-col items-center gap-4 rounded-2xl p-8 text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-display text-4xl font-semibold">
                      <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </p>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                  </div>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
