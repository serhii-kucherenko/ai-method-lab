import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.14613",
  title: "Heart Rhythm Desk Contrastive Learning for Long-Tailed Electrocardiogram Arrhythmia Diagnosis",
  codeUrl: "https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG",
  buildClaim: "The AG-SCL framework offers a novel approach to address the long-tailed distribution problem in medical imaging, combining advanced contrastive learning with adaptive label adjustments and tailored data augmentation, which could be adapted for similar challenges in other domains.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Heart Rhythm Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Heart Rhythm Desk listening on ${port}`);
});
