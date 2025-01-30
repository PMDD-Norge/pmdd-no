import { defineField } from "sanity";
import { linkWithDescriptionId } from "../link";
import { body, optionalTitle, richTextID, title } from "../../fields/text";
import { createAppearance } from "../../fields/appearance";

export const resourcesId = "resources";

// Helper function to safely get text from internationalized array
const getInternationalizedText = (array: any) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return "Untitled";
  }
  return array[0]?.value || "Untitled";
};

// Helper function to get text content from blocks
const getBlocksText = (blocks: any) => {
  if (!blocks || !Array.isArray(blocks)) {
    return "";
  }
  return blocks
    .filter((child: { _type: string }) => child._type === "span")
    .map((span: { text: string }) => span.text)
    .join("");
};

export const groupedResources = defineField({
  name: "groupedResources",
  type: "object",
  fields: [
    optionalTitle,
    {
      name: "links",
      title: "List of Resources",
      description:
        "Add resources to this section. Each resource should have a title and a URL. Use drag-and-drop to reorder the resources.",
      type: "array",
      of: [
        {
          type: linkWithDescriptionId,
        },
      ],
      options: {
        sortable: true,
      },
    },
  ],
  preview: {
    select: {
      title: "optionalTitle",
      links: "links",
    },
    prepare(selection) {
      const { title, links } = selection;
      const linkCount = Array.isArray(links) ? links.length : 0;

      return {
        title: getInternationalizedText(title),
        subtitle: `${linkCount} Resource${linkCount === 1 ? "" : "s"}`,
      };
    },
  },
});

export const resources = defineField({
  name: resourcesId,
  title: "Resources",
  type: "object",
  fields: [
    {
      ...title,
      description:
        "This will be the title of the resources section. Make it engaging to capture attention (e.g., 'Recommended Reading for PMDD').",
    },
    {
      ...body,
      description:
        "Provide an introductory text for this section to explain the importance of these resources.",
    },
    {
      name: "groupedLinks",
      title: "Grouped lists of Resources",
      type: "array",
      of: [{ type: "groupedResources" }],
    },
    createAppearance({
      includeLink: false,
      includeImage: false,
      includeLayout: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      groupedLinks: "groupedLinks",
      blocks: `${richTextID}[0].value.0.children`,
    },
    prepare(selection) {
      const { title, groupedLinks, blocks } = selection;
      const groups = groupedLinks || [];

      const totalLinks = groups.reduce(
        (sum: number, group: { links: any[] }) =>
          sum + (Array.isArray(group.links) ? group.links.length : 0),
        0
      );

      const groupCount = groups.length;
      const hasText = blocks && Array.isArray(blocks) && blocks.length > 0;

      let subtitle = "";
      if (groupCount === 0) {
        subtitle = "No resource groups";
      } else {
        subtitle = `${totalLinks} Resource${totalLinks === 1 ? "" : "s"} in ${groupCount} group${groupCount === 1 ? "" : "s"}`;
        if (hasText) {
          subtitle += " with description";
        }
      }

      const titleText = getInternationalizedText(title);
      const bodyText = hasText ? getBlocksText(blocks) : "";

      return {
        title: titleText || bodyText || "Untitled",
        subtitle,
      };
    },
  },
});

export default resources;
