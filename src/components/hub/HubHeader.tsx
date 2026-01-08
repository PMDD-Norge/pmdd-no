import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import { PortableTextBlock } from "@portabletext/react";
import SanityNextImage from "@/components/image/sanityImage";
import { SanityImageData } from "@/sanity/lib/interfaces/media";
import styles from "./hubHeader.module.css";

interface HubHeaderProps {
  title?: string;
  description?: string | PortableTextBlock[];
  image?: SanityImageData;
}

/**
 * HubHeader component - displays the header/hero section for collection hubs
 */
export default function HubHeader({ title, description, image }: HubHeaderProps) {
  return (
    <div className={`sectionWrapperColumn ${styles.header}`}>
      {title && <Text type="h1">{title}</Text>}
      {description && (
        typeof description === 'string'
          ? <Text>{description}</Text>
          : <RichText value={description} />
      )}
      {image && (
        <SanityNextImage
          image={image}
        />
      )}
    </div>
  );
}
