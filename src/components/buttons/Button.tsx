import React from "react";
import styles from "./button.module.css";

type ButtonType = "primary" | "secondary";
type ButtonSize = "large" | "small";

interface IButton {
  size?: ButtonSize;
  type?: ButtonType;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  ariaDisabled?: boolean;
  ariaBusy?: boolean;
  showChevron?: boolean;
}

const sizeClassMap: { [key in ButtonSize]: string } = {
  large: styles.large,
  small: styles.small,
};

const typeClassMap: { [key in ButtonType]: string } = {
  primary: styles.primary,
  secondary: styles.secondary,
};

const Button = ({
  size = "large",
  type = "primary",
  onClick,
  children,
  disabled,
  loading,
  ariaDisabled,
  ariaBusy,
  showChevron = false,
}: IButton) => {
  const className = `${styles.button} ${sizeClassMap[size]} ${typeClassMap[type]} ${loading ? styles.loading : ""} ${showChevron ? styles.chevron : ""}`;

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      aria-busy={ariaBusy}
    >
      {children}
    </button>
  );
};

export default Button;
