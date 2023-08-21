"use client"

import styles from "./SearchKeyword.module.css";

interface SearchKeywordProps {
  region: string;
  onClick: (event: React.MouseEvent, keyword: string) => void
}

const SearchKeyword = ({ region, onClick }: SearchKeywordProps) => {
  return (
    <span className={styles.keyword} onClick={(event) => onClick(event, region)}>
      {region}
    </span>
  );
};

export default SearchKeyword;
