import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "10.1186/s40168-026-02467-w",
  title: "SEVA: structural and evolutionary feature integration for predicting virulence factors and antibiotic resistance genes",
  codeUrl: "https://github.com/kaiqili2/SEVA",
  buildClaim: "SEVA advances the field of bioinformatics by integrating protein language models with structural and evolutionary features, providing a more accurate and robust method for predicting virulence factors and antibiotic resistance genes than previous tools.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Virulence Feature Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Virulence Feature Desk listening on ${port}`);
});
