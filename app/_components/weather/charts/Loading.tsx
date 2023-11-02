import Card from "../../ui/card/Card";
import Loading from "../../ui/loading/Loading";

const ChartLoading = () => {
  const size = { width: 32, height: 32 };
  return (
    <Card>
      <div
        style={{
          height: "180px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading size={size} />
      </div>
    </Card>
  );
};

export default ChartLoading;
