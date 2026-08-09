import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Abacus Digital Agency';
const DEFAULT_IMAGE = 'https://picsum.photos/seed/abacus-og/1200/630';

/**
 * Drop into any page to control its SEO metadata. Falls back to sensible
 * site-wide defaults so a page that forgets a prop still renders valid
 * tags rather than nothing.
 *
 * @param {string} title - page title (site name is appended automatically)
 * @param {string} description
 * @param {string} [image] - absolute URL for OG/Twitter image
 * @param {string} [url] - canonical path, e.g. "/blog/my-post"
 * @param {'website'|'article'} [type]
 * @param {Object|Object[]} [structuredData] - JSON-LD object(s)
 * @param {boolean} [noindex]
 */
export default function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url = '/',
  type = 'website',
  structuredData,
  noindex = false,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Product Design & Engineering Studio`;
  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = `${siteOrigin}${url}`;
  const schemaList = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {/* JSON-LD structured data */}
      {schemaList.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

/**
 * Structured data builders — kept alongside SEO since they're only ever
 * used to feed its `structuredData` prop.
 */
export const buildOrganizationSchema = (settings) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: settings?.siteName || SITE_NAME,
  url: typeof window !== 'undefined' ? window.location.origin : '',
  logo: settings?.logo?.url,
  description: settings?.tagline,
  sameAs: Object.values(settings?.socialLinks || {}).filter(Boolean),
  contactPoint: settings?.contactEmail
    ? [{ '@type': 'ContactPoint', email: settings.contactEmail, contactType: 'customer service' }]
    : undefined,
});

export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    item: `${typeof window !== 'undefined' ? window.location.origin : ''}${item.path}`,
  })),
});

export const buildArticleSchema = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage?.url,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: { '@type': 'Person', name: post.author?.name || SITE_NAME },
  publisher: { '@type': 'Organization', name: SITE_NAME },
});

export const buildJobPostingSchema = (job) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  datePosted: job.createdAt,
  validThrough: job.applicationDeadline,
  employmentType: job.type?.toUpperCase().replace('-', '_'),
  hiringOrganization: { '@type': 'Organization', name: SITE_NAME },
  jobLocation: { '@type': 'Place', address: job.location },
  ...(job.salaryRange?.isPublic && job.salaryRange?.min
    ? {
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: job.salaryRange.currency || 'USD',
          value: { '@type': 'QuantitativeValue', minValue: job.salaryRange.min, maxValue: job.salaryRange.max, unitText: 'YEAR' },
        },
      }
    : {}),
});
