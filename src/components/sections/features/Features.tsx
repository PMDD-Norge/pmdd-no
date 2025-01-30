import { ColorTheme } from "@/sanity/schemaTypes/fields/appearance";
import styles from "./features.module.css";
import { FeaturesObject } from "@/sanity/lib/interfaces/pages";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import LinkButton from "@/components/linkButton/LinkButton";

export const Features = ({ features }: { features: FeaturesObject }) => {
  const { appearance } = features;
  const theme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";

  return (
    <article id={features._key} className={theme}>
      <div className={styles.sectionWrapperRow}>
        <div className={styles.leftColumn}>
          <div className={styles.intro}>
            <Text type="h2">{features.title}</Text>
            <RichText value={features.richText} />
          </div>
          {appearance?.image && (
            <div className={styles.image}>
              <SanityNextImage image={appearance?.image} />
            </div>
          )}
        </div>
        <div className={styles.rightColumn}>
          <ul className={styles.list}>
            {features.list?.map((feature) => (
              <li className={styles.item} key={feature._key}>
                <Text type="h3">{feature.title}</Text>
                {feature.richText && <RichText value={feature.richText} />}
              </li>
            ))}
          </ul>
          <div>
            <LinkButton link={features.link} type="secondary" />
          </div>
        </div>
      </div>
    </article>
  );
};
