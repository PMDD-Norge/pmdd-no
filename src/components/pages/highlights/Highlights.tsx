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
  events: EventDocument[];
  availablePositions: AvailablePositionDocument[];
}

export async function Highlights({
  highlights,
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
            grid={{
              _type: "grid",
              _key: "events-grid",
              title: eventsSection?.title,
              richText: eventsSection?.richText,
              lists: [
                {
                  _type: "gridList",
                  _key: "events-list",
                  title: eventsSection?.title,
                  contentType: "event",
                  items: events,
                },
              ],
            }}
          />
        )}
        {availablePositions.length > 0 && (
          <Grid
            grid={{
              _type: "grid",
              _key: "positions-grid",
              title: availablePositionsSection?.title,
              richText: availablePositionsSection?.richText,
              lists: [
                {
                  _type: "gridList",
                  _key: "positions-list",
                  title: availablePositionsSection?.title,
                  contentType: "availablePosition",
                  items: availablePositions,
                },
              ],
            }}
          />
        )}
      </div>
    </>
  );
}
