import { defineField } from "sanity";
import { link } from "../link";
import { body, title } from "../../fields/text";
import image from "../../fields/media";
import { colorTheme } from "../../fields/appearance";

// IDs
export const gridID = "grid";
export const gridItemID = "gridItem";
export const gridListID = "gridList";
export const activitiesGridListID = "activitiesGridList";

// Field definitions
export const gridItem = defineField({
  name: gridItemID,
  title: "Grid Item",
  type: "object",
  fields: [
    {
      ...title,
      title: "Item Title",
      description: "Title of the grid item, such as the name of an employee.",
    },
    {
      ...body,
      title: "Description",
      description:
        "Description of the grid item, such as the role or bio of an employee.",
    },
    link,
    image,
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title?.[0]?.value || "Untitled",
        subtitle: "Grid Item",
        media,
      };
    },
  },
});

const gridList = defineField({
  name: gridListID,
  title: "Grid List",
  type: "object",
  fields: [
    {
      name: "title",
      type: "internationalizedArrayString",
      title: "List Title",
      description: "Title for this group of grid items",
    },
    {
      name: "contentType",
      title: "Content Type",
      type: "string",
      options: {
        list: [
          { title: "Manual Items", value: "manual" },
          { title: "Events (from Highlights)", value: "event" },
          { title: "Available Positions (from Highlights)", value: "availablePosition" },
          { title: "Posts (from Information)", value: "post" },
        ],
      },
      initialValue: "manual",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "items",
      title: "Grid Items",
      description: "Add and manage items to be displayed in this grid list",
      type: "array",
      of: [gridItem],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { contentType?: string };
          if (parent?.contentType === "manual" && (!value || (Array.isArray(value) && value.length === 0))) {
            return "At least one grid item is required for manual content.";
          }
          return true;
        }),
      hidden: ({ parent }) => parent?.contentType !== "manual",
    },
    {
      name: "maxItems",
      title: "Maximum Items to Display",
      type: "number",
      initialValue: 3,
      validation: (Rule) => Rule.required().min(1).max(6),
      description: "Number of items to display (max 6)",
      hidden: ({ parent }) => parent?.contentType === "manual",
    },
    {
      ...link,
      name: "ctaLink",
      title: "View More Link",
      description: "Link to view all items of this type",
      hidden: ({ parent }) => parent?.contentType === "manual",
    },
  ],
  preview: {
    select: {
      title: "title",
      items: "items",
      contentType: "contentType",
      maxItems: "maxItems",
    },
    prepare(selection) {
      const { title, items = [], contentType, maxItems } = selection;
      let subtitle = "";
      
      if (contentType === "manual") {
        subtitle = `Manual Grid List with ${items.length} items`;
      } else {
        subtitle = `Auto Grid List: ${contentType} (max ${maxItems})`;
      }
      
      return {
        title: title?.[0]?.value || "Untitled",
        subtitle,
      };
    },
  },
});

export const grid = defineField({
  name: gridID,
  title: "Content Grid",
  type: "object",
  fields: [
    title,
    body,
    {
      name: "appearance",
      title: "Visual Settings",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [colorTheme],
    },
    {
      name: "lists",
      title: "Grid Lists",
      type: "array",
      of: [gridList],
      validation: (Rule) =>
        Rule.required().min(1).error("At least one grid list is required."),
    },
  ],
  preview: {
    select: {
      title: "title",
      lists: "lists",
    },
    prepare(selection) {
      const { title, lists = [] } = selection;
      return {
        title: title?.[0]?.value || "Untitled",
        subtitle: `Content Grid with ${lists.length} lists`,
      };
    },
  },
});

// Need to export for schema registration
export const gridSchemaTypes = [gridItem, gridList, grid];
export default grid;
