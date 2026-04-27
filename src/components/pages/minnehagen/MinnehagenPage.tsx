import { Suspense } from "react";
import { VippsDonasjoner, ContactObject } from "@/sanity/lib/interfaces/pages";
import styles from "./minnehagen.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import { PortableTextBlock } from "next-sanity";
import { SanityImageData } from "@/sanity/lib/interfaces/media";
import PlantBlomstKnapp from "./PlantBlomstKnapp";
import MinnehagenBlomster from "./MinnehagenBlomster";
import Contact from "@/components/sections/contact/Contact";

interface MinnehagenHubData {
  title?: string;
  richText?: PortableTextBlock[];
  image?: SanityImageData;
  contactSection?: ContactObject;
  vippsDonasjoner?: VippsDonasjoner;
}

const MinnehagenPage = ({ document }: { document: MinnehagenHubData }) => {
  const { title, image, richText, contactSection } = document;

  return (
    <>
      <div className={`sectionWrapperColumn ${styles.hero}`}>
        {image?.asset && (
          <div className={styles.heroImage}>
            <SanityNextImage image={image} />
          </div>
        )}
        <div className={styles.intro}>
          <div className={styles.introContent}>
            {title && <Text type="h1">{title}</Text>}
            {richText && <RichText value={richText} />}
          </div>
          <div>
            <PlantBlomstKnapp />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <MinnehagenBlomster />
      </Suspense>

      {contactSection && <Contact contact={contactSection} />}
    </>
  );
};

export default MinnehagenPage;
