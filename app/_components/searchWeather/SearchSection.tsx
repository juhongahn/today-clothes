"use client";

import styles from "./SearchSection.module.css";
import SearchBar from "./SearchBar";
import KeywordsBox from "./KeywordsBox";

const SearchSection = () => {
  return (
    <div className={styles.searchSection}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>날씨 검색</h3>
        </div>
        <SearchBar />
      </div>
      <div className={styles.body}>
        <KeywordsBox />
      </div>
    </div>
  );
};

export default SearchSection;
