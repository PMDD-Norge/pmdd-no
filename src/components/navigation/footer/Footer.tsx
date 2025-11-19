import {
  Navigation,
  RichTextObject,
  SanityLink,
} from "@/sanity/lib/interfaces/siteSettings";
import CustomLink from "../../link/CustomLink";
import styles from "./footer.module.css";
import { SocialMediaLink } from "@/sanity/lib/interfaces/socialMedia";
import { RichText } from "@/components/richText/RichText";
import Text from "@/components/text/Text";
import SoMeLink from "@/components/link/SoMeLink";

interface FooterProps {
  navigationData: Navigation | undefined;
}

interface Section {
  sectionType: "content" | "socialMedia";
  sectionTitle: string;
  linksAndContent?: Array<SanityLink | RichTextObject>;
  _key: string;
}

const Footer = ({ navigationData }: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <SocialMediaSection navigationData={navigationData} />
        <ContentSections navigationData={navigationData} />
      </nav>
    </footer>
  );
};

// Type guard functions
const isLink = (item: SanityLink | RichTextObject): item is SanityLink => {
  return item._type === "link";
};

const isRichText = (
  item: SanityLink | RichTextObject
): item is RichTextObject => {
  return item._type === "richTextObject";
};

const renderContentItem = (item: SanityLink | RichTextObject) => {
  if (isLink(item)) {
    return <CustomLink link={item} type="footerLink" />;
  }
  if (isRichText(item)) {
    return <RichText value={item.richText} />;
  }
  return null;
};

const ContentSections = ({
  navigationData,
}: {
  navigationData: Navigation | undefined;
}) => {
  if (!navigationData) {
    return null;
  }

  const contentSections = filterSectionsByType(navigationData, "content");

  if (!contentSections || contentSections.length === 0) {
    return null;
  }

  return contentSections.map(({ linksAndContent, sectionTitle }, index) => {
    return (
      <div key={`${sectionTitle}-${index}`} className={styles.column}>
        <Text type="h4">{sectionTitle}</Text>
        <ul className={styles.list}>
          {linksAndContent && linksAndContent.length > 0 && linksAndContent.map((item) => (
            <li key={item._key}>{renderContentItem(item)}</li>
          ))}
        </ul>
      </div>
    );
  });
};

const SocialMediaSection = ({ navigationData }: { navigationData: Navigation | undefined }) => {
  const socialMediaSections = filterSectionsByType(
    navigationData,
    "socialMedia"
  );

  if (!socialMediaSections || socialMediaSections.length === 0) {
    return null;
  }

  // Get the first social media section
  const socialMediaSection = socialMediaSections[0];
  const profiles = socialMediaSection.socialMedia?.profiles;

  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <div className={styles.column}>
      <Text type="h4">{socialMediaSection.sectionTitle}</Text>
      <ul className={styles.list}>
        {profiles.map((link: SocialMediaLink) => (
          <li key={link._key}>
            <SoMeLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const filterSectionsByType = (
  data: Navigation | undefined,
  type: "content" | "socialMedia"
) => data?.footer?.filter((section: Section) => section.sectionType === type);

export default Footer;
