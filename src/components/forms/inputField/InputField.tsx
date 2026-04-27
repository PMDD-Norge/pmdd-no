import { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react";
import textStyles from "@/components/text/text.module.css";
import styles from "./inputField.module.css";

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  error?: string;
  required?: boolean;
}

const InputField = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  disabled,
  autoComplete,
  error,
  required,
}: InputFieldProps) => {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={textStyles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
