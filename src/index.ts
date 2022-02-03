import * as path from "path";
import * as fs from "fs";
import * as fsPromises from "fs/promises";

import { createJapaneseHoliday } from "./holiday";

const main = async () => {
  try {
    if (!fs.existsSync("dist")) {
      await fsPromises.mkdir("dist");
    }

    const holiday = createJapaneseHoliday(new Date());
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
