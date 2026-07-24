import { createServer } from "node:http";
import { DISPLAY_NAME } from "./claim.ts";
const port = Number(process.env.PORT || 3855);
createServer((_req, res) => {
  res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  res.end(`${DISPLAY_NAME} scaffold\n`);
}).listen(port, () => console.log(`listening :${port}`));
