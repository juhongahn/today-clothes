import { DUST } from "../../../../_types/types";
import Badge from "../../../ui/badge/Badge";

interface Props {
  dust: DUST;
}

const DustBadge = ({ dust }: Props) => {
  return (
    <>
      {Object.keys(dust.components).map((key) => {
        if (key === "pm10" || key === "pm2_5" || key === "o3")
          return (
            <Badge
              key={key}
              title={switchTitle(key)}
              value={dust.components[key].grade}
              grade={dust.components[key].grade}
            />
          );
      })}
    </>
  );
};

export default DustBadge;

const switchTitle = (key: string) => {
  switch (key) {
    case "pm10":
      return "미세먼지";
    case "pm2_5":
      return "초미세먼지";
    case "o3":
      return "오존";
    case "uv":
      return "자외선";
    default:
      return "";
  }
};
