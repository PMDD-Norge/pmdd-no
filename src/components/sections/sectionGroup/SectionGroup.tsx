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
  const groupTheme = group.appearance?.theme;
  return (
    <div className={`${styles.group} ${theme}`}>
      {group.sections?.map((section) => {
        const sectionWithTheme = groupTheme
          ? { ...section, appearance: { ...(section as any).appearance, theme: groupTheme } }
          : section;
        return (
          <SectionRenderer
            key={section._key}
            section={sectionWithTheme as Section}
            isLandingPage={isLandingPage}
          />
        );
      })}
    </div>
  );
};

export default SectionGroup;
