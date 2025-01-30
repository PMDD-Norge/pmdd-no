import { ReactElement } from "react";
import Article from "@/components/sections/article/Article";
import Callout from "@/components/sections/callout/Callout";
import CallToAction from "@/components/sections/callToAction/CallToAction";
import Contact from "@/components/sections/contact/Contact";
import { Features } from "@/components/sections/features/Features";
import Grid from "@/components/sections/grid/Grid";
import { Hero } from "@/components/sections/hero/Hero";
import ImageSection from "@/components/sections/imageSection/ImageSection";
import { LogoSalad } from "@/components/sections/logoSalad/LogoSalad";
import Quote from "@/components/sections/quote/Quote";
import Resources from "@/components/sections/resources/Resources";
import { Testimonials } from "@/components/sections/testimonials/Testimonials";
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
  TestimonialsObject,
} from "@/sanity/lib/interfaces/pages";

interface SectionRendererProps {
  section: Section;
  isLandingPage?: boolean;
}

interface RenderProps {
  isLandingPage: boolean;
}

// Type-safe section renderer map
const sectionRenderers: Record<
  string,
  (section: any, props: RenderProps) => ReactElement
> = {
  hero: (section: HeroObject, { isLandingPage }: RenderProps) => (
    <Hero hero={section} isLanding={isLandingPage} />
  ),
  logoSalad: (section: LogoSaladObject) => <LogoSalad logoSalad={section} />,
  article: (section: ArticleObject) => <Article article={section} />,
  callout: (section: CalloutObject) => <Callout callout={section} />,
  quote: (section: QuoteObject) => <Quote quote={section} />,
  ctaSection: (section: CallToActionObject) => (
    <CallToAction callToAction={section} />
  ),
  resources: (section: ResourcesObject) => <Resources resources={section} />,
  contactSection: (section: ContactObject) => <Contact contact={section} />,
  testimonials: (section: TestimonialsObject) => (
    <Testimonials testimonials={section} />
  ),
  features: (section: FeaturesObject) => <Features features={section} />,
  imageSection: (section: ImageObject) => <ImageSection section={section} />,
  grid: (section: GridObject) => <Grid grid={section} />,
};

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
      {renderSection(section, {
        isLandingPage,
      })}
    </section>
  );
};

export default SectionRenderer;
