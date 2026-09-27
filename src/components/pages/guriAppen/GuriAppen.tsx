import styles from "./guriAppen.module.css";
import Text from "@/components/text/Text";
import SanityNextImage from "@/components/image/sanityImage";
import { RichText } from "@/components/richText/RichText";
import { GuriAppenDocument } from "@/sanity/lib/interfaces/guriAppen";

interface GuriAppenProps {
  document: GuriAppenDocument;
}

const GuriAppen = ({ document }: GuriAppenProps) => {
  const {
    title,
    ingress,
    heroImage,
    googlePlayUrl,
    appStoreUrl,
    about,
    argumentsTitle,
    arguments: argumentList,
    footerSection,
  } = document;

  return (
    <>
      {/* HERO */}
      <div className={`sectionWrapperColumn ${styles.hero}`}>
        <div className={styles.heroContent}>
          {heroImage?.asset && (
            <div className={styles.heroImage}>
              <SanityNextImage
                image={heroImage}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          <div className={styles.heroText}>
            {title && <Text type="display">{title}</Text>}
            {ingress && <Text type="bodyLarge">{ingress}</Text>}
            {/* App-store-knappar kjem her seinare */}
            {(googlePlayUrl || appStoreUrl) && (
              <div className={styles.storeButtons}>
                {/* Placeholder — knappar leggast til seinare */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OM APPEN */}
      {about && about.length > 0 && (
        <div className={`sectionWrapperColumn ${styles.about}`}>
          <RichText value={about} paragraphType="bodyLarge" />
        </div>
      )}

      {/* ARGUMENTS */}
      {argumentList && argumentList.length > 0 && (
        <div className={`sectionWrapperColumn ${styles.arguments}`}>
          {argumentsTitle && <Text type="h2">{argumentsTitle}</Text>}
          <ul className={styles.argumentList}>
            {argumentList.map((arg) => (
              <li key={arg._key} className={styles.argument}>
                {arg.image?.asset && (
                  <div className={styles.argumentImage}>
                    <SanityNextImage image={arg.image} />
                  </div>
                )}
                {arg.title && <Text type="h3">{arg.title}</Text>}
                {arg.text && <RichText value={arg.text} />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FOOTER SECTION */}
      {footerSection && (
        <div className={`sectionWrapperColumn ${styles.footer}`}>
          {footerSection.image?.asset && (
            <div className={styles.footerImage}>
              <SanityNextImage image={footerSection.image} />
            </div>
          )}
          {footerSection.title && <Text type="h2">{footerSection.title}</Text>}
          {(footerSection.googlePlayUrl || footerSection.appStoreUrl) && (
            <div className={styles.storeButtons}>
              {/* Placeholder — knappar leggast til seinare */}
            </div>
          )}
          {footerSection.screenshots &&
            footerSection.screenshots.length > 0 && (
              <ul className={styles.screenshots}>
                {footerSection.screenshots.map((screenshot, idx) => (
                  <li key={idx} className={styles.screenshot}>
                    <SanityNextImage image={screenshot} />
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}
    </>
  );
};

export default GuriAppen;
