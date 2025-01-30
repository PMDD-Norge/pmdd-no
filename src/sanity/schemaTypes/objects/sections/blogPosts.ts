import { defineArrayMember, defineField } from "sanity";
import { optionalSubtitle, richText, title } from "../../fields/text";
import image from "../../fields/media";
import callToActionField from "../../fields/callToActionFields";

export const articleID = "informationPostsID";

export const informationPosts = defineField({
  name: articleID,
  title: "information Posts",
  type: "object",
  fields: [
    title,
    optionalSubtitle,
    richText,
    defineField({
      name: "posts",
      type: "array",
      of: [
        defineArrayMember({
          name: "informationPost",
          title: "information post",
          type: "object",
          fields: [title, optionalSubtitle, richText, image, callToActionField],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title,
        subtitle: "information Posts",
      };
    },
  },
});

export default informationPosts;
