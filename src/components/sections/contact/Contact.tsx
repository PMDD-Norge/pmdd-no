import { ContactObject } from "@/sanity/lib/interfaces/pages";
import styles from "./contact.module.css";
import { ColorTheme } from "@/sanity/lib/interfaces/appearance";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";

interface ContactProps {
  contact: ContactObject;
}

const Contact = ({ contact }: ContactProps) => {
  const { appearance, title, richText, callToActions } = contact;

  const theme =
    appearance?.theme === ColorTheme.Dark
      ? "darkBackground"
      : "lightBackground";
  return (
    <article className={theme} id={contact._key}>
      <div className={`sectionWrapperColumn ${styles.content}`}>
        <div className={styles.textWrapper}>
          <Text type="h3">{title}</Text>
          {richText && <RichText value={richText} />}
        </div>
        <ul className={styles.list}>
          {callToActions?.map((cta, index) => (
            <li key={`cta-${index}`}>
              <LinkButton link={cta} type="secondary" />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default Contact;
