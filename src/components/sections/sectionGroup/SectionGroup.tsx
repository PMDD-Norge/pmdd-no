import styles from "./sectionGroup.module.css";
import SectionRenderer from "@/utils/renderSection";
import { Section, SectionGroupObject } from "@/sanity/lib/interfaces/pages";
import { getThemeClassFromAppearance } from "@/utils/themeUtils";

type Props = {
  group: SectionGroupObject;
  isLandingPage?: boolean;
};

const SectionGroup = ({ group, isLandingPage = false }: Props) => {
  const theme = getThemeClassFromAppearance(group.appearance);
  return (
    <div className={`${styles.group} ${theme}`}>
      {group.sections?.map((section) => (
        <SectionRenderer
          key={section._key}
          section={section as Section}
          isLandingPage={isLandingPage}
        />
      ))}
    </div>
  );
};

export default SectionGroup;
