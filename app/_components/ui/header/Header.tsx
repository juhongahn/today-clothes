import { CSSProperties } from "react";

interface Props {
  title: string;
  styles?: CSSProperties;
}

const Header = ({ title, styles }: Props) => {
  return <h3 style={styles}>{title}</h3>;
};

export default Header;
