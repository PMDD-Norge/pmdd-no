import styles from "./information.module.css";
import PostPreviewGrid from "./components/postPreviewGrid/PostPreviewGrid";
import CategoryNavigation from "./components/categoryNavigation/CategoryNavigation";
import PMDDErrorMessage from "./components/customErrorMessage/PMDDErrorMessage";
import {
  Category,
  InformationDocument,
  PostDocument,
} from "@/sanity/lib/interfaces/pages";
import { getCustomTranslations } from "@/utils/translations";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import Contact from "@/components/sections/contact/Contact";

interface InformationProps {
  information: InformationDocument;
  categories: Category[];
  initialPosts: PostDocument[];
  slug: string;
  language: string;
  postCount: number;
  currentPage: number;
  selectedCategoryName?: string;
}

export async function Information({
  information,
  initialPosts,
  slug,
  language,
  categories,
  postCount,
  currentPage,
  selectedCategoryName,
}: InformationProps) {
  const { title, richText, contactSection } = information;
  const { t } = await getCustomTranslations(language);
  const allString = t(GlobalTranslationKey.all) || "All";

  const categoriesToShow = [
    {
      _id: "all",
      _type: "category",
      name: `${allString} ${information?.allPostsLabel}`,
    },
    ...(categories || []),
  ];

  const readMoreTitle = selectedCategoryName
    ? `${categories.find((c) => c._id === selectedCategoryName)?.name} ${information.allPostsLabel}`
    : `All ${information.allPostsLabel}`;

  if (!initialPosts) {
    return <PMDDErrorMessage />;
  }

  return (
    <>
      <div className={`sectionWrapperColumn ${styles.maxWidth}`}>
        {title && <Text type="h1">{title}</Text>}
        {richText && <RichText value={richText} />}
        <div className={styles.message}>
          <Text type="h4">Info: Under utvikling</Text>
          <Text>
            Vi bygger kontinuerlig ut vår kunnskapsbase med nye artikler for å
            gi deg en grundig forståelse av PMDD. Her vil du finne informasjon
            om alt fra symptomer og diagnose til behandlingsmuligheter og
            mestringsstrategier. Følg med mens vi utvider med mer innhold for å
            støtte deg på best mulig måte.
          </Text>
        </div>
      </div>
      <div className="darkBackground">
        <div className="sectionWrapperColumn">
          <CategoryNavigation
            categories={categoriesToShow}
            selectedCategory={selectedCategoryName}
            language={language}
            slug={slug}
          />
          <section aria-live="polite" role="region">
            <PostPreviewGrid
              title={readMoreTitle}
              posts={initialPosts}
              numberOfPosts={postCount}
              initialLoading={false}
              slug={slug}
              language={language}
              currentPage={currentPage}
            />
          </section>
        </div>
      </div>
      <Contact contact={contactSection} />
    </>
  );
}
