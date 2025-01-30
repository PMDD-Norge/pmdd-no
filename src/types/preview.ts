import { QueryResponseInitial } from "@sanity/react-loader";
import { PageDocument } from "src/studio/lib/interfaces/pages";

export interface PreviewProps {
  initialData: QueryResponseInitial<PageDocument>;
  sectionIndex: number;
}
