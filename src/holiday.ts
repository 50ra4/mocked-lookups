import * as holidayJp from "@holiday-jp/holiday_jp";
import axios from "axios";
import * as csv from "csv-parse/sync";
import * as encoding from "encoding-japanese";

import {
  startOfYear,
  addYears,
  endOfYear,
  format,
  parseISO,
  isAfter,
  parse,
} from "date-fns";

const fetchHolidayCSV = () =>
  axios(process.env.HOLIDAY_CSV_URL ?? "", {
    method: "GET",
    responseType: "arraybuffer", // 指定しないとutf-8でdecodeされる
    transformResponse: (data) =>
      // SJISからUNICODEへ変換
      encoding.codeToString(encoding.convert(data, "UNICODE", "SJIS")),
  }).then(({ data }) => data);

const refDate = new Date();

export const createJapaneseHoliday2 = async (startAt: Date) => {
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

export const createJapaneseHoliday = (targetDate: Date) => {
  const start = startOfYear(parseISO("2020-01-01"));
  const end = endOfYear(addYears(targetDate, 3));
  return holidayJp.between(start, end).reduce((acc, cur) => {
    const key = format(cur.date, "yyyy-MM-dd");
    return {
      ...acc,
      [key]: {
        jp: cur.name,
        en: cur.name_en,
      },
    };
  }, {} as Record<string, { jp: string; en: string }>);
};
