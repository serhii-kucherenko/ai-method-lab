import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.11287",
  title: "A Unified Framework for Comprehensive Cardiac CT Segmentation and Phenotyping: Human-in-the-Loop Data Annotation, Vision Foundation Model Development, Multicenter Evaluation and Clinical Validation",
  codeUrl: null,
  buildClaim: "This work provides a new approach to cardiac CT segmentation and phenotyping, and the release of the dataset and code can facilitate further research in this area.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Unified Framework Comprehensive", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Unified Framework Comprehensive listening on ${port}`);
});
