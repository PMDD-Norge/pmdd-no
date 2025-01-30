import {
  AvailablePositionDocument,
  EventDocument,
  HightlightsDocument,
} from "@/sanity/lib/interfaces/pages";
import styles from "./highlights.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import HighlightsGrid from "@/components/sections/grid/HighlightsGrid";

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
          <HighlightsGrid
            title={eventsSection.title}
            richText={eventsSection.richText}
            items={events}
            slug={slug}
            language={language}
          />
        )}
        {availablePositions.length > 0 && (
          <HighlightsGrid
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
