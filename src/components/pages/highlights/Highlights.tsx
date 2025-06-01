import {
  AvailablePositionDocument,
  EventDocument,
  HightlightsDocument,
} from "@/sanity/lib/interfaces/pages";
import styles from "./highlights.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import Grid from "@/components/sections/grid/Grid";

interface HighlightsProps {
  highlights: HightlightsDocument;
  slug: string;
  language: string;
  events: EventDocument[];
  availablePositions: AvailablePositionDocument[];
}

export async function Highlights({
  highlights,
  slug,
  language,
  availablePositions,
  events,
}: HighlightsProps) {
  const { title, richText, eventsSection, availablePositionsSection } =
    highlights;

  return (
    <>
      <div className={`sectionWrapperColumn ${styles.maxWidth}`}>
        {title && <Text type="h1">{title}</Text>}
        {richText && <RichText value={richText} />}
      </div>
      <div className="darkBackground">
        {events.length > 0 && (
          <Grid
            mode="simple"
            title={eventsSection.title}
            richText={eventsSection.richText}
            items={events}
            slug={slug}
            language={language}
          />
        )}
        {availablePositions.length > 0 && (
          <Grid
            mode="simple"
            title={availablePositionsSection.title}
            richText={availablePositionsSection.richText}
            items={availablePositions}
            slug={slug}
            language={language}
          />
        )}
      </div>
    </>
  );
}
