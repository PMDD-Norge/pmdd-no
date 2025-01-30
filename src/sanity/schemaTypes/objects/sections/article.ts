import { defineField } from "sanity";
import { linkID } from "../link";
import { body, title } from "../../fields/text";
import { createAppearance } from "../../fields/appearance";

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
      name: "callToActions",
      title: "Call to Actions",
      type: "array",
      of: [{ type: linkID }],
    },
    createAppearance({
      includeImage: true,
      includeLayout: true,
      includeTheme: true,
      includeLink: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      tag: "tag",
      media: "appearance.image",
      linkText: "appearance.link.text",
      body: "richText",
    },
    prepare(selection) {
      const { title, tag, linkText, body, media } = selection;
      // Fallback chain for title
      const displayTitle =
        (title && title[0]?.value) || // First try title
        (tag && tag[0]?.value) || // Then try tag
        (linkText && linkText[0]?.value) || // Then try link text
        (body && body[0]?.value?.[0]?.children?.[0]?.text) || // Then try first text block
        "Untitled Article"; // Final fallback

      return {
        title: displayTitle,
        subtitle: "Article",
        media,
      };
    },
  },
});

export default article;
