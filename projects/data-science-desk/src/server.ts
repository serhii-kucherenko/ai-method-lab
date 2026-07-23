import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.15901",
  title: "DSWorld: A Data Science World Model for Efficient Autonomous Agents",
  codeUrl: null,
  buildClaim: "This framework offers a significant leap in efficiency for developing and deploying autonomous data science agents, potentially enabling more complex and faster automated data analysis workflows.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Data Science Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Data Science Desk listening on ${port}`);
});
