import SearchSection from "../../_components/searchWeather/SearchSection";
import Wrapper from "./Wrapper";
import TourWrapper from "../../_components/tour/TourWrapper";

const Page = () => {
  return (
    <>
      <Wrapper />
      <SearchSection />
      {/* @ts-expect-error Async Server Component */}
      <TourWrapper />
    </>
  );
};

export default Page;
