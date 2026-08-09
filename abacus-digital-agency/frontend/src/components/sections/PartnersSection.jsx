import Container from '@components/common/Container';
import Marquee from '@components/common/Marquee';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';

export default function PartnersSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const partners = settings?.partners || [];

  return (
    <section className="border-y border-border-subtle py-16">
      <Container>
        <p className="mb-10 text-center font-mono text-xs uppercase tracking-widest text-text-muted">
          Technology Partners
        </p>
      </Container>
      {isLoading ? (
        <Container>
          <div className="flex justify-center gap-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24" />
            ))}
          </div>
        </Container>
      ) : (
        <Marquee reverse speed="slow">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="shrink-0 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            >
              <img src={partner.logo?.url} alt={partner.name} className="h-7 w-auto" />
            </a>
          ))}
        </Marquee>
      )}
    </section>
  );
}
