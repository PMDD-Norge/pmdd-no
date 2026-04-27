import textStyles from "@/components/text/text.module.css";
import styles from "./inputTextArea.module.css";

interface InputTextAreaProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

const InputTextArea = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 3,
  disabled,
  error,
  required,
}: InputTextAreaProps) => {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={textStyles.label}>
        {label}
      </label>
      <textarea
        id={id}
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        disabled={disabled}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <div className={styles.bunn}>
        {error && (
          <span id={`${id}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
        {maxLength && (
          <span className={styles.teller} aria-live="polite">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputTextArea;
