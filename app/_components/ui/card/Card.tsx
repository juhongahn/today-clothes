import { CSSProperties } from "react";

interface Props {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  styles?: CSSProperties;
}

const Card = ({ children, title, body, footer, className, styles }: Props) => {
  return (
    <div
      style={{
        borderRadius: "10px",
        backgroundColor: "white",
        boxShadow: "box-shadow: 0 0 0 1px #e3e5e8, 0 1px 2px 0 rgba(0,0,0,.04)",
        padding: "1rem",
        ...styles
      }}
      className={className}
    >
      {title && <h2 style={{ margin: "0 0 1rem 0" }}>{title}</h2>}
      {children ? children : body}
      {footer && <div style={{ marginTop: "1.5rem" }}>{footer}</div>}
    </div>
  );
};

export default Card;
