import { defineField } from "sanity";
import { linkID } from "../link";
import { body, title } from "../../fields/text";
import { createAppearance } from "../../fields/appearance";
import { meta } from "../../fields/media";

export const articleID = "article";

export const article = defineField({
  name: articleID,
  title: "Article",
  type: "object",
  fields: [
    {
      name: "tag",
      title: "Tag",
      type: "internationalizedArrayString",
    },
    title,
    body,
    {
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Iframe", value: "iframe" },
        ],
        layout: "radio",
      },
      initialValue: "image",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true, collapsible: true, collapsed: false },
      fields: [...meta],
      hidden: ({ parent }) => parent?.mediaType !== "image",
    },
    {
      name: "iframeUrl",
      title: "Iframe URL",
      type: "url",
      description: "URL for embedded content (e.g., YouTube videos, external widgets)",
      hidden: ({ parent }) => parent?.mediaType !== "iframe",
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as any;
        if (parent?.mediaType === "iframe" && !value) {
          return "Iframe URL is required when iframe media type is selected";
        }
        return true;
      }),
    },
    {
      name: "callToActions",
      title: "Call to Actions",
      type: "array",
      of: [{ type: linkID }],
    },
    createAppearance({
      includeImage: false,
      includeLayout: true,
      includeTheme: true,
      includeLink: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      tag: "tag",
      media: "image",
      mediaType: "mediaType",
      iframeUrl: "iframeUrl",
      linkText: "appearance.link.text",
      body: "richText",
    },
    prepare(selection) {
      const { title, tag, linkText, body, media, mediaType, iframeUrl } = selection;
      // Fallback chain for title
      const displayTitle =
        (title && title[0]?.value) || // First try title
        (tag && tag[0]?.value) || // Then try tag
        (linkText && linkText[0]?.value) || // Then try link text
        (body && body[0]?.value?.[0]?.children?.[0]?.text) || // Then try first text block
        "Untitled Article"; // Final fallback

      const subtitle = mediaType === "iframe" && iframeUrl ? 
        `Article (Iframe: ${new URL(iframeUrl).hostname})` : 
        "Article";

      return {
        title: displayTitle,
        subtitle,
        media: mediaType === "image" ? media : undefined,
      };
    },
  },
});

export default article;
