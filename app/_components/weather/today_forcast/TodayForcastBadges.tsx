import { DUST, RISESET, UV } from "../../../_types/types";
import DustBadge from "./badges/DustBadge";
import RisesetBadge from "./badges/RisesetBadge";
import UVBadge from "./badges/UVBadge";

interface Props {
  uv: UV;
  dust: DUST;
  riseset: RISESET[];
}

const TodayForcastBadges = ({ uv, dust, riseset }: Props) => {
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <UVBadge uv={uv} />
      <DustBadge dust={dust} />
      <RisesetBadge riseset={riseset} />
    </div>
  );
};

export default TodayForcastBadges;
