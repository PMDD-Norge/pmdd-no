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
    <div className={`sectionWrapperColumn ${styles.fjernBottomPadding}`}>
      <div className={styles.guriHero}>
        {heroImage?.asset && (
          <SanityNextImage
            image={heroImage}
            priority
            className={styles.guriHeroBilde}
          />
        )}
        <div className={styles.guriHeroTekst}>
          {title && (
            <Text type="h1" className={styles.tittel}>
              {title}
            </Text>
          )}
          {ingress && <Text type="bodyLarge">{ingress}</Text>}
          {/* App-store-knappar kjem her seinare */}
          {(googlePlayUrl || appStoreUrl) && (
            <div>{/* Placeholder — knappar leggast til seinare */}</div>
          )}
        </div>
      </div>
      <div className={styles.guriBody}>
        {about && about.length > 0 && (
          <div className={styles.guriOmAppen}>
            <RichText value={about} paragraphType="bodyLarge" />
          </div>
        )}
        {argumentList && argumentList.length > 0 && (
          <div className={styles.guriArgumenter}>
            {argumentsTitle && <Text type="h2">{argumentsTitle}</Text>}
            <ul>
              {argumentList.map((arg) => (
                <li key={arg._key} className={styles.guriArgument}>
                  <div className={styles.guriArgumentTekst}>
                    {arg.title && <Text type="h3">{arg.title}</Text>}
                    {arg.text && <RichText value={arg.text} />}
                  </div>
                  {arg.image?.asset && (
                    <div className={styles.guriArgumentBilde}>
                      <SanityNextImage image={arg.image} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {footerSection && (
          <div className={styles.guriFooter}>
            {footerSection.image?.asset && (
              <SanityNextImage
                image={footerSection.image}
                className={styles.guriFooterBilde}
              />
            )}
            {footerSection.text && footerSection.text.length > 0 && (
              <RichText value={footerSection.text} paragraphType="h2" />
            )}
            {(googlePlayUrl || appStoreUrl) && (
              <div>{/* Placeholder — knappar leggast til seinare */}</div>
            )}
            {footerSection.screenshots &&
              footerSection.screenshots.length > 0 && (
                <div className={styles.guriSkjermbilder}>
                  {footerSection.screenshots.map((screenshot, idx) => (
                    <SanityNextImage
                      image={screenshot}
                      key={idx}
                      className={styles.guriSkjermbilde}
                    />
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuriAppen;
