import { sanityFetch } from "@/sanity/lib/live";
import { ARTICLE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import ArticlePage from "@/components/pages/article/ArticlePage";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { generatePageMetadata } from "@/utils/metadata";

export const revalidate = 86400;

interface ArtikkelPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArtikkelPageProps) {
  const { slug } = await params;
  return generatePageMetadata(slug);
}

export default async function InformasjonArtikkelPage({
  params,
}: ArtikkelPageProps) {
  const { slug } = await params;

  const { data: article } = await sanityFetch({
    query: ARTICLE_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!article) {
    return <PMDDErrorMessage />;
  }

  return <ArticlePage article={article} currentSlug={slug} />;
}
