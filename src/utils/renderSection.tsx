import { ReactElement } from "react";
import dynamic from "next/dynamic";
import {
  ArticleObject,
  CalloutObject,
  CallToActionObject,
  ContactObject,
  FeaturesObject,
  GridObject,
  HeroObject,
  ImageObject,
  LogoSaladObject,
  QuoteObject,
  ResourcesObject,
  Section,
  SectionObject,
  TestimonialsObject,
} from "@/sanity/lib/interfaces/pages";

interface SectionRendererProps {
  section: Section;
  isLandingPage?: boolean;
}

interface RenderProps {
  isLandingPage: boolean;
}

const Hero = dynamic(() =>
  import("@/components/sections/hero/Hero").then((mod) => mod.Hero)
);
const LogoSalad = dynamic(() =>
  import("@/components/sections/logoSalad/LogoSalad").then(
    (mod) => mod.LogoSalad
  )
);
const Article = dynamic(() => import("@/components/sections/article/Article"));
const Callout = dynamic(() => import("@/components/sections/callout/Callout"));
const Quote = dynamic(() => import("@/components/sections/quote/Quote"));
const CallToAction = dynamic(
  () => import("@/components/sections/callToAction/CallToAction")
);
const Resources = dynamic(
  () => import("@/components/sections/resources/Resources")
);
const Contact = dynamic(() => import("@/components/sections/contact/Contact"));
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials/Testimonials").then(
    (mod) => mod.Testimonials
  )
);
const Features = dynamic(() =>
  import("@/components/sections/features/Features").then((mod) => mod.Features)
);
const ImageSection = dynamic(
  () => import("@/components/sections/imageSection/ImageSection")
);
const Grid = dynamic(() => import("@/components/sections/grid/Grid"));

// Type-safe section renderer map
const sectionRenderers: Record<
  string,
  (section: SectionObject, props: RenderProps) => ReactElement
> = {
  hero: (section, { isLandingPage }: RenderProps) => (
    <Hero hero={section as HeroObject} isLanding={isLandingPage} />
  ),
  logoSalad: (section) => <LogoSalad logoSalad={section as LogoSaladObject} />,
  article: (section) => <Article article={section as ArticleObject} />,
  callout: (section) => <Callout callout={section as CalloutObject} />,
  quote: (section) => <Quote quote={section as QuoteObject} />,
  ctaSection: (section) => (
    <CallToAction callToAction={section as CallToActionObject} />
  ),
  resources: (section) => <Resources resources={section as ResourcesObject} />,
  contactSection: (section) => <Contact contact={section as ContactObject} />,
  testimonials: (section) => (
    <Testimonials testimonials={section as TestimonialsObject} />
  ),
  features: (section) => <Features features={section as FeaturesObject} />,
  imageSection: (section) => <ImageSection section={section as ImageObject} />,
  grid: (section) => <Grid grid={section as GridObject} />,
};

const withLoadingState = (component: ReactElement) => <div>{component}</div>; // TODO: add loading

const SectionRenderer = ({
  section,
  isLandingPage = false,
}: SectionRendererProps): ReactElement | null => {
  const renderSection = sectionRenderers[section._type];

  if (!renderSection) {
    console.warn(`No renderer found for section type: ${section._type}`);
    return null;
  }

  return (
    <section data-section-type={section._type}>
      {withLoadingState(
        renderSection(section, {
          isLandingPage,
        })
      )}
    </section>
  );
};

export default SectionRenderer;
