import { getCustomTranslations } from "@/utils/translations";
import styles from "./skipToMain.module.css";
import { GlobalTranslationKey } from "@/utils/constants/globalTranslationKeys";

const SkipToMain = async ({ language }: { language: string }) => {
  const { t } = await getCustomTranslations(language);
  return (
    <a href="#main" className={styles.skipLink}>
      {t(GlobalTranslationKey.skipToMain)}
    </a>
  );
};

export default SkipToMain;
