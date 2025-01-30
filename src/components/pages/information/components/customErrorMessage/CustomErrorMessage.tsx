import { LinkType, SanityLink } from "@/sanity/lib/interfaces/siteSettings";
import styles from "./customErrorMessage.module.css";
import Text from "@/components/text/Text";
import Button from "@/components/buttons/Button";
import LinkButton from "@/components/linkButton/LinkButton";

export const homeLink = {
  _key: "return-home",
  _type: "link",
  title: "Return to home",
  type: LinkType.Internal,
  internalLink: {
    _ref: "/",
  },
};

export const studioLink = {
  _key: "go-to-studio",
  _type: "link",
  title: "Go to studio",
  type: LinkType.Internal,
  internalLink: { _ref: "/studio" },
};

interface CustomErrorMessageProps {
  title: string;
  body: string;
  button?: {
    label: string;
    onClick: () => void;
  };
  link?: SanityLink;
  loading?: boolean;
}

const CustomErrorMessage = ({
  title,
  body,
  button,
  link,
  loading,
}: CustomErrorMessageProps) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.error}>
        <Text type="h3">{title}</Text>
        <Text>{body}</Text>
        <div className={styles.buttonWrapper}>
          {button && (
            <Button onClick={button.onClick} loading={loading}>
              {button.label}
            </Button>
          )}
          {link?.title && <LinkButton type="secondary" link={link} />}
        </div>
      </div>
    </section>
  );
};

export default CustomErrorMessage;
