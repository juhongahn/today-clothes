import { useAppSelector } from "../../../_hooks/redux_hooks";
import { selectLocal } from "../../../_reducers/localReducer";
import Loading from "../weeklyForcast/Loading";

const Local = () => {
  const local = useAppSelector(selectLocal);
  return (
    <>
      {local ? (
        <p>
          {local.address_name}
        </p>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Local;
