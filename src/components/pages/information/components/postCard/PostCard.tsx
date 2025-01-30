import CustomLink from "@/components/link/CustomLink";
import Text from "@/components/text/Text";
import { PostDocument } from "@/sanity/lib/interfaces/pages";
import { LinkType } from "@/sanity/lib/interfaces/siteSettings";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import { truncateText } from "@/utils/textUtils";
import { getCustomTranslations } from "@/utils/translations";

export const PostCard = async ({
  post,
  slug,
  language,
}: {
  post: PostDocument;
  slug: string;
  language: string;
}) => {
  const { t } = await getCustomTranslations(language);
  const postLink = `${slug}/${post.slug}`;
  const truncatedLead = truncateText(post.lead, 250); // Adjust the length as needed

  const link = {
    _key: postLink,
    _type: "link",
    title: t(GlobalTranslationKey.readMore),
    type: LinkType.Internal,
    internalLink: {
      _ref: postLink,
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
