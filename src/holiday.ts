import * as holidayJp from "@holiday-jp/holiday_jp";
import { startOfYear, addYears, endOfYear, format } from "date-fns";

export const createJapaneseHoliday = (targetDate: Date) => {
  const start = startOfYear(targetDate);
  const end = endOfYear(addYears(start, 5));
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
