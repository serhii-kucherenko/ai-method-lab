import { createServer } from "node:http";
import { DISPLAY_NAME, PAPER_URL } from "./claim.ts";

const port = Number(process.env.PORT || 3852);
createServer((_req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true, display_name: DISPLAY_NAME, paper: PAPER_URL }));
}).listen(port, () => console.log(`${DISPLAY_NAME} smoke on :${port}`));
