import styles from "./guriAppen.module.css";
import Text from "@/components/text/Text";
import SanityNextImage from "@/components/image/sanityImage";
import { RichText } from "@/components/richText/RichText";
import { GuriAppenDocument } from "@/sanity/lib/interfaces/guriAppen";
import Image from "next/image";

interface GuriAppenProps {
  document: GuriAppenDocument;
}

// Offisielle butikkbadger (norske versjoner) fra Apple og Google. Badgene skal
// brukes uendret, så de legges i public og vises som bilder.
const AppButikker = ({
  appStoreUrl,
  googlePlayUrl,
}: {
  appStoreUrl?: string;
  googlePlayUrl?: string;
}) => (
  <div className={styles.appKnapper}>
    {appStoreUrl && (
      <a
        className={`${styles.badge} ${styles.appStoreBadge}`}
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Last ned Guri-appen fra App Store"
      >
        <Image
          src="/_assets/badges/app-store-no.svg"
          alt=""
          width={120}
          height={40}
          unoptimized
        />
      </a>
    )}
    {googlePlayUrl && (
      <a
        className={`${styles.badge} ${styles.googlePlayBadge}`}
        href={googlePlayUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Last ned Guri-appen fra Google Play"
      >
        <Image
          src="/_assets/badges/google-play-no.png"
          alt=""
          width={646}
          height={250}
          unoptimized
        />
      </a>
    )}
  </div>
);

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
          {(googlePlayUrl || appStoreUrl) && (
            <AppButikker
              appStoreUrl={appStoreUrl}
              googlePlayUrl={googlePlayUrl}
            />
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
