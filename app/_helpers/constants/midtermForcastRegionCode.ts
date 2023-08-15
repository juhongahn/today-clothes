export const regionData = {
  "서울특별시, 인천광역시, 경기도": "11B00000",
  "강원특별자치도": "11D10000",
  "대전광역시, 세종특별자치시, 충청남도": "11C20000",
  "충청북도": "11C10000",
  "광주광역시, 전라남도": "11F20000",
  "전라북도": "11F10000",
  "대구광역시, 경상북도": "11H10000",
  "부산광역시, 울산광역시, 경상남도": "11H20000",
  "제주특별자치도": "11G00000",
};

export const getRegionCodeByRegionName = (region: string) => {
  const regionNames = Object.keys(regionData);
  const matchedRegionName = regionNames.find((regionName) =>
    regionName.includes(region)
  );
  return matchedRegionName ? regionData[matchedRegionName] : "Region not found";
};
