import styles from "./Badge.module.css";

interface BadgeProps {
  onClick: () => void;
  value: string;
  selected: boolean;
}

const Badge = ({ onClick, value, selected }: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${selected && styles.selected}`} onClick={onClick}>
      {value}
    </span>
  );
};

export default Badge;
