import styles from "./Button.module.css";
type ButtonVariant = "primary" | "secondary" | "success" | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  text?: string;
  disabled?: boolean;
  chilren?: React.ReactNode;
  name?: string;
}

const Button = (props: ButtonProps) => {
  const { variant, size, text, disabled, children, name } = props;
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]}`;

  return (
    <button name={name} disabled={disabled} className={buttonClass} {...props}>
      {text ? text : children}
    </button>
  );
};
export default Button;
