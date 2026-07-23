import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.15865",
  title: "An MLIR-Based Compilation Method for Large Language Models",
  codeUrl: "https://github.com/sophgo/tpu-mlir",
  buildClaim: "This method can contribute to the development of more efficient and scalable large language models, which can advance the field of artificial intelligence and natural language processing.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Model Compiler Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Model Compiler Desk listening on ${port}`);
});

