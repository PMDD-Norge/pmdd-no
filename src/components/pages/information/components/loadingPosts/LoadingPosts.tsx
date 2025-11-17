import Text from "@/components/text/Text";
import styles from "./loadingPosts.module.css";
import { getCustomTranslations } from "@/utils/translations";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";

const LoadingPosts = async () => {
  const { t } = await getCustomTranslations();

  return (
    <div className={styles.wrapper}>
      <Text className={styles.loading}>
        {t(GlobalTranslationKey.loading) || "Loading"}...
      </Text>
    </div>
  );
};

export default LoadingPosts;
