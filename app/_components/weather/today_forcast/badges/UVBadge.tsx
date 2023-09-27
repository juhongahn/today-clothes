import { UV } from "../../../../_types/types";
import Badge from "../../../ui/badge/Badge";

interface Props {
  uv: UV;
}

const UVBadge = ({ uv }: Props) => {
  return (
    <Badge
      title={"자외선"}
      value={uv.components.uv.grade}
      grade={uv.components.uv.grade}
    />
  );
};

export default UVBadge;
