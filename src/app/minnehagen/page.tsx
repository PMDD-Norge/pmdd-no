import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { MINNEHAGEN_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { VippsDonasjoner, ContactObject } from "@/sanity/lib/interfaces/pages";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import { SanityImageData } from "@/sanity/lib/interfaces/media";
import { PortableTextBlock } from "next-sanity";
import { generatePageMetadata } from "@/utils/metadata";
import PMDDErrorMessage from "@/components/pages/information/components/customErrorMessage/PMDDErrorMessage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import Contact from "@/components/sections/contact/Contact";
import PlantBlomstKnapp from "@/components/pages/minnehagen/PlantBlomstKnapp";
import MinnehagenBlomster from "@/components/pages/minnehagen/MinnehagenBlomster";
import styles from "./minnehagen.module.css";

export const revalidate = 86400;

// Slugen må samsvare med slug-feltet i Sanity, siden interne lenker og
// sitemap bygges fra den.
const SLUG = "minnehagen";

export async function generateMetadata() {
  return generatePageMetadata(SLUG);
}

interface MinnehagenData {
  title?: string;
  richText?: PortableTextBlock[];
  image?: SanityImageData;
  contactSection?: ContactObject;
  vippsDonasjoner?: VippsDonasjoner;
  callToAction?: SanityLink;
}

export default async function MinnehagenPage() {
  const { data } = await sanityFetch({
    query: MINNEHAGEN_BY_SLUG_QUERY,
    params: { slug: SLUG },
  });
  const document = data as MinnehagenData | null;

  if (!document) {
    return <PMDDErrorMessage />;
  }

  const { title, image, richText, contactSection, callToAction } = document;

  return (
    <>
      <div className={`sectionWrapperColumn ${styles.hero}`}>
        {image?.asset && (
          <div className={styles.heroImage}>
            <SanityNextImage image={image} priority />
          </div>
        )}
        <div className={styles.intro}>
          <div className={styles.introContent}>
            {title && <Text type="h1">{title}</Text>}
            {richText && <RichText value={richText} />}
          </div>
          <div>
            <PlantBlomstKnapp callToAction={callToAction} />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <MinnehagenBlomster />
      </Suspense>

      {contactSection && <Contact contact={contactSection} />}
    </>
  );
}
