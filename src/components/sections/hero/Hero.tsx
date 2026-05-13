import { HeroObject } from "@/sanity/lib/interfaces/pages";
import styles from "./hero.module.css";
import SanityNextImage from "@/components/image/sanityImage";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import LinkButton from "@/components/linkButton/LinkButton";
import { getDisplayText } from "@/utils/textUtils";

interface HeroProps {
  hero: HeroObject;
  isLanding: boolean;
}

const Hero = ({ hero, isLanding = false }: HeroProps) => {
  return (
    <div className="sectionWrapperRow">
      <div className={styles.hero}>
        <div
          className={`${styles.content} ${isLanding && hero.image?.asset ? "" : styles.imagePositionAlwaysLeftOnMobile}`}
        >
          {hero.image?.asset && (
            <div className={styles.image}>
              <SanityNextImage
                image={hero.image}
                priority
                className={styles.heroImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          <div className={styles.column}>
            <div className={styles.text}>
              {hero.title && (
                <Text type={isLanding ? "display" : "h1"}>
                  {getDisplayText(hero.title)}
                </Text>
              )}
              {hero.body && (
                <Text type="bodyLarge">{getDisplayText(hero.body)}</Text>
              )}
            </div>
            {hero.callToActions && hero.callToActions.length > 0 && (
              <ul className={styles.cta}>
                {hero.callToActions.map((cta: SanityLink, index) => (
                  <li key={cta._key || `cta-${index}`}>
                    <LinkButton
                      link={cta}
                      type={
                        hero.callToActions &&
                        hero.callToActions.length > 1 &&
                        index === 1
                          ? "secondary"
                          : "primary"
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
            {(hero.infoMessage?.tittel || hero.infoMessage?.tekst) && (
              <div className={styles.infoMessage}>
                {hero.infoMessage.tittel && (
                  <Text type="h4">{hero.infoMessage.tittel}</Text>
                )}
                {hero.infoMessage.tekst && (
                  <RichText value={hero.infoMessage.tekst} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
