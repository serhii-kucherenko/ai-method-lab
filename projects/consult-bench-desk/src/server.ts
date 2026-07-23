import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.09142",
  title: "MedRealMM: A Real-World Multimodal Benchmark for Chinese Online Medical Consultation",
  codeUrl: null,
  buildClaim: "Builders now have a realistic, multimodal benchmark and rubric to train and test LLMs for online consultation; the dataset is public on Hugging Face.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Medrealmm Real World", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Medrealmm Real World listening on ${port}`);
});
