import styles from "./postPreviewGrid.module.css";
import { PostCard } from "../postCard/PostCard";
import LoadingPosts from "../loadingPosts/LoadingPosts";
import { PostDocument } from "@/sanity/lib/interfaces/pages";
import LinkButton from "@/components/linkButton/LinkButton";
import { LinkType } from "@/sanity/lib/interfaces/siteSettings";

const PostPreviewGrid = async ({
  posts,
  numberOfPosts,
  title,
  slug,
  initialLoading = false,
  currentPage,
  category,
}: {
  posts: PostDocument[];
  numberOfPosts: number;
  title: string;
  slug: string;
  initialLoading: boolean;
  loading?: boolean;
  currentPage: number;
  category?: string;
}) => {
  const postsAlreadyRendered = posts.length;
  const remainingPosts = numberOfPosts - postsAlreadyRendered;
  const itemsPerLoad = 9;
  const isShowingLastBatch = remainingPosts <= itemsPerLoad;
  const loadMoreButtonText = isShowingLastBatch
    ? `Last siste ${remainingPosts}`
    : `Last ${itemsPerLoad} flere`;

  // Construct the URL for the next page
  const nextPageUrl = new URLSearchParams();
  nextPageUrl.set("page", String(currentPage + 1));

  if (category) {
    nextPageUrl.set("category", category);
  }

  if (initialLoading) {
    return <LoadingPosts />;
  }

  const link = {
    _key: "load-more-posts",
    _type: "link",
    title: loadMoreButtonText,
    type: LinkType.Internal,
    internalLink: { _ref: `?${nextPageUrl.toString()}` },
  };

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list} aria-label={title} aria-live="polite">
        {posts?.map((post) => (
          <li key={post._id}>
            <PostCard post={post} slug={slug} />
          </li>
        ))}
      </ul>
      {remainingPosts >= itemsPerLoad && (
        <div>
          <LinkButton link={link} type="secondary" isLoadMore />
        </div>
      )}
    </div>
  );
};

export default PostPreviewGrid;
