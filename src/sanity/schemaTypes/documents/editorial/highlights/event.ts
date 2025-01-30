import { gridItem } from "@/sanity/schemaTypes/objects/sections/grid";
import { defineType } from "sanity";

export const eventId = "event";

const event = defineType({
  name: eventId,
  type: "document",
  title: "Event",
  fields: gridItem.fields,
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title[0].value,
      };
    },
  },
});

export default event;
