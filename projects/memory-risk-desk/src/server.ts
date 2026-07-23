import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.11656",
  title: "Imputation-free transformer learning enables robust Alzheimer's disease prediction and calibrated uncertainty quantification across heterogeneous clinical cohorts",
  codeUrl: null,
  buildClaim: "NITROGEN's imputation-free approach could be useful for other machine learning applications where missing data is a problem",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Imputation Free Transformer", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Imputation Free Transformer listening on ${port}`);
});
