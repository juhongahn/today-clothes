import Button from "../ui/button/Button";
import Card from "../ui/card/Card";
import Header from "../ui/header/Header";

interface Props {
  onClickRetry: () => void;
}

const NetworkError = ({ onClickRetry }: Props) => {
  return (
    <Card styles={{ textAlign: "center" }}>
      <Header
        title="잠시후 다시 시도해 주세요"
        styles={{ margin: "0.5rem 0" }}
      />
      <p style={{ fontSize: "0.8rem", color: "#8f8f8f", marginBottom: "0.5rem" }}>요청사항을 처리하는데 실패했습니다.</p>
      <Button
        text="다시 시도"
        variant="danger"
        size="lg"
        onClick={onClickRetry}
        name="retry"
        style={{ width: "40%" }}
      />
    </Card>
  );
};

export default NetworkError;
