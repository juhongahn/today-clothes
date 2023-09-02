import { useSearch } from "./SearchBar";
import SearchKeyword from "./SearchKeyword";
import styles from "./SearchSection.module.css";

const mock = [
  "서울 날씨",
  "제주 날씨",
  "대구 날씨",
  "부산 날씨",
  "강원 날씨",
  "속초 날씨",
  "의령 날씨",
];

const KeywordsBox = () => {
  const [, , handleSubmit] = useSearch();
  const keywordClickHandler = (
    event: React.MouseEvent<Element, MouseEvent>,
    keyword: string
  ) => {
    handleSubmit(event, keyword);
  };

  return (
    <div className={styles.keywords}>
      {mock.map((keyword, idx) => (
        <SearchKeyword
          key={idx}
          region={keyword}
          onClick={keywordClickHandler}
        />
      ))}
    </div>
  );
};

export default KeywordsBox;