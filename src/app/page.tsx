import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { Section } from "@/sanity/lib/interfaces/pages";
import { sanityFetch } from "@/sanity/lib/live";
import {
  LANDING_PAGE_QUERY,
} from "@/sanity/lib/queries";
import SectionRenderer from "@/utils/renderSection";
import { generatePageMetadata } from "@/utils/metadata";

export const revalidate = 43200; // ISR: 12 hours for landing page

export async function generateMetadata() {
  return generatePageMetadata();
}

export default async function Page() {
  try {
    const { data: initialLandingPage } = await sanityFetch({
      query: LANDING_PAGE_QUERY,
      params: {},
    });

    if (!initialLandingPage?.sections) {
      return <PMDDErrorMessage />;
    }

    return (
      <>
        {initialLandingPage.sections.map((section: Section) => (
          <SectionRenderer key={section._key} section={section} isLandingPage />
        ))}
      </>
    );
  } catch {
    return <PMDDErrorMessage />;
  }
}
