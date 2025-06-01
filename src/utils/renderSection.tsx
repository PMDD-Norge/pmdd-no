import { ReactElement } from "react";

import Hero from "@/components/sections/hero/Hero";
import Article from "@/components/sections/article/Article";
import Callout from "@/components/sections/callout/Callout";
import CallToAction from "@/components/sections/callToAction/CallToAction";
import Contact from "@/components/sections/contact/Contact";
import Features from "@/components/sections/features/Features";
import { Grid } from "@/components/sections/grid/Grid";
import ImageSection from "@/components/sections/imageSection/ImageSection";
import LogoSalad from "@/components/sections/logoSalad/LogoSalad";
import Quote from "@/components/sections/quote/Quote";
import Resources from "@/components/sections/resources/Resources";
import Testimonials from "@/components/sections/testimonials/Testimonials";
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

const sectionRenderers: Record<
  string,
  (section: Section, props: { isLandingPage: boolean; language?: string }) => ReactElement
> = {
  hero: (section, { isLandingPage }) => (
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
  grid: (section, { language }) => <Grid mode="full" grid={section as GridObject} language={language} />,
};

const SectionRenderer = ({
  section,
  isLandingPage = false,
  language,
}: {
  section: Section;
  isLandingPage?: boolean;
  language?: string;
}): ReactElement | null => {
  const renderSection = sectionRenderers[section._type];

  if (!renderSection) {
    console.warn(`No renderer found for section type: ${section._type}`);
    return null;
  }

  return (
    <section data-section-type={section._type}>
      {renderSection(section, { isLandingPage, language })}
    </section>
  );
};

export default SectionRenderer;
