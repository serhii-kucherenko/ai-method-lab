import { writeFileSync } from "node:fs";
import { GOLDENS } from "../src/goldens.ts";

writeFileSync("test/goldens.generated.json", JSON.stringify(GOLDENS, null, 2));
console.log(`Wrote ${GOLDENS.length} service credit goldens`);
