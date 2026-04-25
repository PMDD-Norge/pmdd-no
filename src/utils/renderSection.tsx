import { ReactElement, lazy, Suspense } from "react";

// Critical sections - load immediately
import Hero from "@/components/sections/hero/Hero";
import Article from "@/components/sections/article/Article";
import Callout from "@/components/sections/callout/Callout";
import CallToAction from "@/components/sections/callToAction/CallToAction";
import Contact from "@/components/sections/contact/Contact";
import ImageSection from "@/components/sections/imageSection/ImageSection";

// Heavy sections - lazy load
const Features = lazy(() => import("@/components/sections/features/Features"));
const Grid = lazy(() => import("@/components/sections/grid/Grid").then(m => ({ default: m.Grid })));
const LogoSalad = lazy(() => import("@/components/sections/logoSalad/LogoSalad"));
const Quote = lazy(() => import("@/components/sections/quote/Quote"));
const Resources = lazy(() => import("@/components/sections/resources/Resources"));
const Testimonials = lazy(() => import("@/components/sections/testimonials/Testimonials"));
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
  SectionGroupObject,
  TestimonialsObject,
} from "@/sanity/lib/interfaces/pages";
import { Appearance } from "@/sanity/lib/interfaces/appearance";
import { getThemeClassFromAppearance } from "@/utils/themeUtils";

// Import optimized loading component
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Enhanced loading boundary for sections
const SectionLoading = ({ sectionType }: { sectionType?: string }) => (
  <div className="min-h-[200px] flex items-center justify-center">
    <LoadingSpinner
      size="md"
      text={`Loading ${sectionType || 'content'}...`}
    />
  </div>
);

const sectionRenderers: Record<
  string,
  (
    section: Section,
    props: { isLandingPage: boolean; language?: string }
  ) => ReactElement
> = {
  // Critical sections - no suspense needed
  hero: (section, { isLandingPage }) => (
    <Hero hero={section as HeroObject} isLanding={isLandingPage} />
  ),
  articleSection: (section) => <Article article={section as ArticleObject} />,
  callout: (section) => <Callout callout={section as CalloutObject} />,
  ctaSection: (section) => (
    <CallToAction callToAction={section as CallToActionObject} />
  ),
  contactSection: (section) => <Contact contact={section as ContactObject} />,
  imageSection: (section) => <ImageSection section={section as ImageObject} />,

  // Heavy sections - with suspense
  logoSalad: (section) => (
    <Suspense fallback={<SectionLoading sectionType="logo section" />}>
      <LogoSalad logoSalad={section as LogoSaladObject} />
    </Suspense>
  ),
  quote: (section) => (
    <Suspense fallback={<SectionLoading sectionType="quote" />}>
      <Quote quote={section as QuoteObject} />
    </Suspense>
  ),
  resources: (section) => (
    <Suspense fallback={<SectionLoading sectionType="resources" />}>
      <Resources resources={section as ResourcesObject} />
    </Suspense>
  ),
  testimonials: (section) => (
    <Suspense fallback={<SectionLoading sectionType="testimonials" />}>
      <Testimonials testimonials={section as TestimonialsObject} />
    </Suspense>
  ),
  features: (section) => (
    <Suspense fallback={<SectionLoading sectionType="features" />}>
      <Features features={section as FeaturesObject} />
    </Suspense>
  ),
  grid: (section) => (
    <Suspense fallback={<SectionLoading sectionType="content grid" />}>
      <Grid grid={section as GridObject} />
    </Suspense>
  ),
};

import { logger } from "@/utils/logger";

const SectionRenderer = ({
  section,
  isLandingPage = false,
  language,
}: {
  section: Section;
  isLandingPage?: boolean;
  language?: string;
}): ReactElement | null => {
  if (section._type === "sectionGroup") {
    const group = section as SectionGroupObject;
    const theme = getThemeClassFromAppearance(group.appearance);
    const groupTheme = group.appearance?.theme;
    return (
      <section
        data-section-type="sectionGroup"
        className={theme}
      >
        {group.sections?.map((innerSection) => {
          const s = innerSection as unknown as Section;
          const innerRender = sectionRenderers[s._type];
          if (!innerRender) return null;
          const sWithTheme = groupTheme
            ? { ...s, appearance: { ...(s as { appearance?: Appearance }).appearance, theme: groupTheme } as Appearance }
            : s;
          return (
            <SectionRenderer
              key={s._key}
              section={sWithTheme as Section}
              isLandingPage={isLandingPage}
              language={language}
            />
          );
        })}
      </section>
    );
  }

  const renderFn = sectionRenderers[section._type];

  if (!renderFn) {
    logger.warn(`No renderer found for section type: ${section._type}`, {
      sectionType: section._type,
      sectionKey: section._key
    });
    return null;
  }

  return (
    <section data-section-type={section._type}>
      {renderFn(section, { isLandingPage, language })}
    </section>
  );
};

export default SectionRenderer;
