import Container from '@components/common/Container';
import Marquee from '@components/common/Marquee';
import Skeleton from '@components/common/Skeleton';
import { useClients } from '@hooks/useContent';

export default function ClientLogosSection() {
  const { data: clients, isLoading } = useClients();

  return (
    <section className="py-16">
      <Container>
        <p className="mb-10 text-center font-mono text-xs uppercase tracking-widest text-text-muted">
          Trusted by ambitious teams
        </p>
      </Container>

      {isLoading ? (
        <Container>
          <div className="flex justify-center gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28" />
            ))}
          </div>
        </Container>
      ) : (
        <Marquee>
          {clients?.map((client) => (
            <img
              key={client._id}
              src={client.logo?.url}
              alt={client.name}
              className="h-8 w-auto shrink-0 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </Marquee>
      )}
    </section>
  );
}
