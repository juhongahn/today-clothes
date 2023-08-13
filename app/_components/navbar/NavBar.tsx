import Link from "next/link";
import styles from "./NavBar.module.css";

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <p>오늘의 옷</p>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
