import * as path from "path";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import { parseISO } from "date-fns";
import * as dotenv from "dotenv";
dotenv.config();

import { createJapaneseHoliday } from "./holiday";

const main = async () => {
  try {
    if (!fs.existsSync("dist")) {
      await fsPromises.mkdir("dist");
    }

    const holiday = await createJapaneseHoliday(
      parseISO(process.env.HOLIDAY_START_AT ?? "2020-01-01")
    );
    await fsPromises.writeFile(
      path.join(process.cwd(), "dist", "jp-holiday.json"),
      JSON.stringify(holiday)
    );
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
