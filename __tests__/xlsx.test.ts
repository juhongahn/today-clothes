import getRegId from "../app/_lib/getRegId";
import { getRegionCodeByRegionName } from "../app/_helpers/constants/midtermForcastRegionCode";

test("지역 코드 엑셀 파일에서, 시에 매칭되는 지역 코드를 반환하는 테스트", () => {
  expect(getRegId("부산광역시")).toBe("11H20201");
});

test("시 이름으로 지역 코드 찾는 메서드 테스트", () => {
  expect(getRegionCodeByRegionName("충청북도")).toBe("11C10000");
})