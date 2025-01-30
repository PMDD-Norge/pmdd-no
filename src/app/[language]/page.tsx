import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import { Section } from "@/sanity/lib/interfaces/pages";
import { sanityFetch } from "@/sanity/lib/live";
import { LANDING_PAGE_QUERY } from "@/sanity/lib/queries/pages";
import SectionRenderer from "@/utils/renderSection";

export const revalidate = 3600;

type HomePageProps = {
  params: {
    language: string;
  };
};

const Page = async ({ params }: HomePageProps) => {
  const { language } = await params;

  const {
    data: { pageData: initialLandingPage },
  } = await sanityFetch({
    query: LANDING_PAGE_QUERY,
    params: { language },
  });

  if (!initialLandingPage?.sections) {
    return <PMDDErrorMessage />;
  }

  return (
    <div>
      {initialLandingPage.sections?.map((section: Section) => (
        <SectionRenderer
          key={section._key}
          section={section}
          isLandingPage={true}
        />
      ))}
    </div>
  );
};

export default Page;
