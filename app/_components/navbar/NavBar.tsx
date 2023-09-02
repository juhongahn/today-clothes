"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./NavBar.module.css";
import SearchBar from "../searchWeather/SearchBar";

const NavBar = () => {
  const pathname  = usePathname();
  const isWeatherPage = pathname === "/weather";

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <p>오늘의 옷</p>
        </Link>
        <div className={styles.search}>
          {isWeatherPage && <SearchBar />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
