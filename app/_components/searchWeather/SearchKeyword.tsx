"use client"

import styles from "./SearchKeyword.module.css";

interface SearchKeywordProps {
  region: string;
  keywordClickHandler: (keyword: string) => {}
}

const SearchKeyword = ({ region, keywordClickHandler }: SearchKeywordProps) => {
  return (
    <span className={styles.keyword} onClick={() => keywordClickHandler(region)}>
      {region}
    </span>
  );
};

export default SearchKeyword;
