import CustomLink from "@/components/link/CustomLink";
import Text from "@/components/text/Text";
import { PostDocument } from "@/sanity/lib/interfaces/pages";
import { LinkType } from "@/sanity/lib/interfaces/siteSettings";
import { truncateText } from "@/utils/textUtils";

export const PostCard = async ({
  post,
  slug,
}: {
  post: PostDocument;
  slug: string;
}) => {
  const postLink = `${slug}/${post.slug.current}`;
  const truncatedLead = truncateText(post.lead, 250); // Adjust the length as needed

  const link = {
    _key: postLink,
    _type: "link",
    title: "Les mer",
    type: LinkType.Internal,
    internalLink: {
      _ref: post._id || "",
      _type: post._type,
      slug: {
        current: postLink,
      },
    },
  };

  return (
    <div>
      {post.title && <Text type="h4">{post.title}</Text>}
      {post.lead && <Text>{truncatedLead}</Text>}
      {postLink && (
        <div>
          <CustomLink link={link} />
        </div>
      )}
    </div>
  );
};
