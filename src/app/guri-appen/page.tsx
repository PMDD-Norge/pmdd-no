import { sanityFetch } from "@/sanity/lib/live";
import { GURI_APPEN_QUERY } from "@/sanity/lib/queries";
import GuriAppen from "@/components/pages/guri-appen/guri-appen";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { generatePageMetadata } from "@/utils/metadata";

export const revalidate = 86400;

export async function generateMetadata() {
  return generatePageMetadata("guri-appen");
}

export default async function GuriAppenPage() {
  const { data: document } = await sanityFetch({
    query: GURI_APPEN_QUERY,
    params: {},
  });

  if (!document) {
    return <PMDDErrorMessage />;
  }

  return <GuriAppen document={document} />;
}
