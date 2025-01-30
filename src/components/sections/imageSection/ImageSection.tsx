import { ImageObject } from "@/sanity/lib/interfaces/pages";
import styles from "./imageSection.module.css";
import Text from "@/components/text/Text";
import SanityNextImage from "@/components/image/sanityImage";

const ImageSection = ({ section }: { section: ImageObject }) => {
  return (
    <article className={styles.article}>
      <Text type="h2">{section.title}</Text>
      {section.image && (
        <div className={styles.image}>
          <SanityNextImage image={section.image} />
        </div>
      )}
    </article>
  );
};

export default ImageSection;
