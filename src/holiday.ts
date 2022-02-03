import * as holidayJp from "@holiday-jp/holiday_jp";
import { startOfYear, addYears, endOfYear, format, parseISO } from "date-fns";

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
