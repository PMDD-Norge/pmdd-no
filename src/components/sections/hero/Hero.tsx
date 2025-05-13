import { HeroObject } from "@/sanity/lib/interfaces/pages";
import styles from "./hero.module.css";
import SanityNextImage from "@/components/image/sanityImage";
import Text from "@/components/text/Text";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import LinkButton from "@/components/linkButton/LinkButton";

interface HeroProps {
  hero: HeroObject;
  isLanding: boolean;
}

const Hero = ({ hero, isLanding = false }: HeroProps) => {
  return (
    <div className={styles.sectionWrapperRow}>
      <div className={styles.hero}>
        <div
          className={`${styles.content} ${isLanding && hero.image ? "" : styles.imagePositionAlwaysLeftOnMobile}`}
        >
          {hero.image && (
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
                <Text type={isLanding ? "display" : "h1"}>{hero.title}</Text>
              )}
              {hero.body && <Text type="bodyLarge">{hero.body}</Text>}
            </div>
            {isLanding && (
              <ul className={styles.cta}>
                {hero.callToActions?.map((cta: SanityLink, index) => (
                  <li key={cta._key}>
                    <LinkButton
                      link={cta}
                      type={
                        hero.callToActions &&
                        hero.callToActions.length > 1 &&
                        index === 0
                          ? "secondary"
                          : "primary"
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
