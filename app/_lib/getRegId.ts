import XLSX from "xlsx";
import path from "path";

const excelFilePath = path.join(
  process.cwd(),
  "public",
  "statics",
  "exel",
  "중기예보_중기기온예보구역코드.xlsx"
);

interface RegionData {
  지역: string;
  예보구역코드: string;
}

const getRegIdBySiName = (regionName: string): string => {
  const workbook: XLSX.WorkBook = XLSX.readFile(excelFilePath);
  const sheetName: string = workbook.SheetNames[0];
  const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
  const data: RegionData[] = XLSX.utils.sheet_to_json(worksheet);

  for (const { 지역, 예보구역코드 } of data) {
    if (regionName.includes(지역)) {
      return 예보구역코드;
    }
  }
  return "지점을 찾을 수 없음";
};

export default getRegIdBySiName;
