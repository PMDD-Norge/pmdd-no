import SanityNextImage from "@/components/image/sanityImage";
import styles from "./logoSalad.module.css";
import { LogoSaladObject } from "@/sanity/lib/interfaces/pages";

const LogoSalad = ({ logoSalad }: { logoSalad: LogoSaladObject }) => {
  return (
    <article className={styles.wrapper}>
      <div className={styles.logoList}>
        {logoSalad.logos && (
          <ul className={styles.logoWrapper}>
            {logoSalad.logos.map(
              (logo) =>
                logo && (
                  <li key={logo._key}>
                    <SanityNextImage image={logo} />
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    </article>
  );
};

export default LogoSalad;
