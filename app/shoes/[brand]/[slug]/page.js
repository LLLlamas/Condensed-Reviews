import { notFound } from 'next/navigation';
import { getShoes } from '../../../../src/data/reviews';
import { getBrandSlug, getShoeSlug } from '../../../../lib/slugify';
import { avgScore } from '../../../../components/constants';
import ShoeDetail from '../../../../components/ShoeDetail';

function findShoe(brand, slug) {
  const shoes = getShoes('all');
  return shoes.find(s =>
    getBrandSlug(s.brand) === brand &&
    getShoeSlug(s.brand, s.name) === slug
  );
}

export function generateStaticParams() {
  const shoes = getShoes('all');
  return shoes.map(shoe => ({
    brand: getBrandSlug(shoe.brand),
    slug: getShoeSlug(shoe.brand, shoe.name),
  }));
}

export async function generateMetadata({ params }) {
  const { brand, slug } = await params;
  const shoe = findShoe(brand, slug);
  if (!shoe) return {};
  const score = avgScore(shoe);
  return {
    title: `${shoe.name} Review — Court Report (${score.toFixed(1)}/10 from ${shoe.reviews.length} reviews)`,
    description: `${shoe.name} rated ${score.toFixed(1)}/10 across cushioning, traction, support, fit, breathability, ground feel, durability, and value. Condensed from ${shoe.reviews.length} real Reddit reviews.`,
  };
}

export default async function ShoePage({ params }) {
  const { brand, slug } = await params;
  const shoe = findShoe(brand, slug);
  if (!shoe) notFound();

  const score = avgScore(shoe);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: shoe.name,
    brand: { '@type': 'Brand', name: shoe.brand },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: score.toFixed(1),
      reviewCount: shoe.reviews.length,
      bestRating: '10',
      worstRating: '0',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShoeDetail shoe={shoe} />
    </>
  );
}
