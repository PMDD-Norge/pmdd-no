import { EventDocument } from "@/sanity/lib/interfaces/pages";
import styles from "./event.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import SanityNextImage from "@/components/image/sanityImage";
import CustomLink from "@/components/link/CustomLink";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { OVERORDNEDE_SIDER } from "@/utils/breadcrumbs";

const EventPage = async ({
  event,
}: {
  event: EventDocument;
  currentSlug: string;
}) => {
  if (!event) {
    return null;
  }

  const { title, richText, body, image, link, startDate, endDate, location } =
    event;
  const content = richText || body;

  return (
    <>
      <div className={`sectionWrapperColumn ${styles.hero}`}>
        <Breadcrumbs
          items={[OVERORDNEDE_SIDER.aktuelt, { label: title ?? "Event" }]}
        />
        {title && <Text type="h1">{title}</Text>}

        {(startDate || endDate || location) && (
          <div className={styles.eventDetails}>
            {startDate && (
              <Text type="bodyLarge" className={styles.date}>
                {new Date(startDate).toLocaleDateString("nb-NO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {endDate &&
                  ` - ${new Date(endDate).toLocaleDateString("nb-NO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}`}
              </Text>
            )}
            {location && <Text type="bodyLarge">{location}</Text>}
          </div>
        )}

        {image?.asset?._ref && (
          <div className={styles.headerImage}>
            <SanityNextImage image={image} priority />
          </div>
        )}
      </div>

      <div className="darkBackground">
        <div className={`sectionWrapperColumn ${styles.body}`}>
          {content && <RichText value={content} />}

          {link && (
            <div className={styles.linkSection}>
              <CustomLink link={link} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventPage;
