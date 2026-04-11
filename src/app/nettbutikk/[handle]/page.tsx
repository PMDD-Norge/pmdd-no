import type { Metadata } from 'next';
import { getProductByHandle } from '@/utils/shopify';
import ProductPage from '@/components/pages/merch/ProductPage';
import PMDDErrorMessage from '@/components/pages/information/components/customErrorMessage/PMDDErrorMessage';
import { logError } from '@/utils/logger';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  return {
    title: product ? `${product.title} | PMDD Norge` : 'Produkt | PMDD Norge',
    description: product?.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { handle } = await params;

  try {
    const product = await getProductByHandle(handle);
    if (!product) return <PMDDErrorMessage />;
    return <ProductPage product={product} />;
  } catch (error) {
    logError(error, { message: 'Failed to fetch Shopify product', handle });
    return <PMDDErrorMessage />;
  }
}
