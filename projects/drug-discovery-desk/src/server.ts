import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.08404",
  title: "DrugGen 2: A disease-aware language model for enhancing drug discovery",
  codeUrl: "https://github.com/alimotahharynia/DrugGen-2",
  buildClaim: "DrugGen-2 advances the field of AI-assisted drug discovery by integrating disease-specific context into molecular generation, offering a powerful tool for de novo design and drug repurposing.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Drug Discovery Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Drug Discovery Desk listening on ${port}`);
});
