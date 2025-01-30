import { LinkType } from "@/sanity/lib/interfaces/siteSettings";
import styles from "./customErrorMessage.module.css";
import Image from "next/image";
import Text from "@/components/text/Text";
import CustomLink from "@/components/link/CustomLink";

export const homeLink = {
  _key: "return-home",
  _type: "link",
  title: "Ta meg til forsiden",
  type: LinkType.Internal,
  internalLink: {
    _ref: "/",
  },
};

const PMDDErrorMessage = () => {
  return (
    <section className={styles.sectionWrapperRow}>
      <div className={styles.imageWrapper}>
        <Image
          src={"/_assets/404.png"}
          alt={""}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          width={2400}
          height={1600}
        />
      </div>
      <div className={styles.PMDDError}>
        <Text type="display">Dette er litt flaut...</Text>
        <Text type="h3">Noe gikk visst galt!</Text>
        <Text>
          Siden du leter etter finnes ikke. Det kan være feil i URLen, eller
          siden kan være flyttet eller slettet.
        </Text>
        <div className={styles.buttonWrapper}>
          <CustomLink link={homeLink} />
        </div>
      </div>
    </section>
  );
};

export default PMDDErrorMessage;
