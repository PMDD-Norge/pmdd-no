import { defineField } from "sanity";
import { link } from "../link";
import { body, title } from "../../fields/text";
import image from "../../fields/media";
import { colorTheme } from "../../fields/appearance";

// IDs
export const gridID = "grid";
export const gridItemID = "gridItem";
export const gridListID = "gridList";

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
      name: "items",
      title: "Grid Items",
      description: "Add and manage items to be displayed in this grid list",
      type: "array",
      of: [gridItem],
      validation: (Rule) =>
        Rule.required().min(1).error("At least one grid item is required."),
    },
  ],
  preview: {
    select: {
      title: "title",
      items: "items",
    },
    prepare(selection) {
      const { title, items = [] } = selection;
      return {
        title: title?.[0]?.value || "Untitled",
        subtitle: `Grid List with ${items.length} items`,
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
