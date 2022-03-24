import axios from "axios";
import * as csv from "csv-parse/sync";
import * as encoding from "encoding-japanese";

import { format, isAfter, parse } from "date-fns";

const fetchHolidayCSV = () =>
  axios(process.env.HOLIDAY_CSV_URL ?? "", {
    method: "GET",
    responseType: "arraybuffer", // 指定しないとutf-8でdecodeされる
    transformResponse: (data) =>
      // SJISからUNICODEへ変換
      encoding.codeToString(encoding.convert(data, "UNICODE", "SJIS")),
  }).then(({ data }) => data);

const refDate = new Date();

export const createJapaneseHoliday = async (startAt: Date) => {
  const rows = await fetchHolidayCSV().then(
    (data) => csv.parse(data) as [string, string][]
  );
  const records = rows
    .map(
      ([date, name]) =>
        // 日付のデータを変換する
        [parse(date, "yyyy/MM/dd", refDate), name] as [Date, string]
    )
    .filter(
      ([date], index) =>
        // ヘッダー行と引数以降の日付を除く
        index !== 0 && isAfter(date, startAt)
    )
    .reduce(
      (acc, [date, name]) => ({
        ...acc,
        [format(date, "yyyy-MM-dd")]: { jp: name, en: "" },
      }),
      {} as Record<string, { jp: string; en: string }>
    );
  return records;
};
