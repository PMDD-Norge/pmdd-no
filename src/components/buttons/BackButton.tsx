"use client";
import React from "react";
import styles from "./button.module.css";
import { useRouter } from "next/navigation";

type ButtonSize = "large" | "small";

interface IButton {
  size?: ButtonSize;
}

const sizeClassMap: { [key in ButtonSize]: string } = {
  large: styles.large,
  small: styles.small,
};

// // Storybook version: No router logic
// const BackButtonForStory = ({ size = "small" }: IButton) => {
//   const className = `${styles.button} ${sizeClassMap[size]} ${styles.back}`;

//   return (
//     <button className={className} onClick={() => {}}>
//       Back
//     </button>
//   );
// };

// Application version: With router logic
const BackButton = ({ size = "small" }: IButton) => {
  const router = useRouter();
  const className = `${styles.button} ${sizeClassMap[size]} ${styles.back}`;

  const handleClick = () => {
    if (router) {
      router.back();
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      Back
    </button>
  );
};

// // Conditional export based on environment
// const isStorybook = typeof window !== "undefined" && !!window.STORYBOOK_ENV;

// export default isStorybook ? BackButtonForStory : BackButton;

export default BackButton;
