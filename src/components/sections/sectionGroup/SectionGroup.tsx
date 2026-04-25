import { ReactNode } from "react";
import styles from "./sectionGroup.module.css";
import { SectionGroupObject } from "@/sanity/lib/interfaces/pages";
import { getThemeClassFromAppearance } from "@/utils/themeUtils";

type Props = {
  group: SectionGroupObject;
  children: ReactNode;
};

const SectionGroup = ({ group, children }: Props) => {
  const theme = getThemeClassFromAppearance(group.appearance);
  return (
    <div className={`${styles.group} ${theme}`}>
      {children}
    </div>
  );
};

export default SectionGroup;
