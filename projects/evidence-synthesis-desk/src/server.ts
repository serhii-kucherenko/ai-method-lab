import { createApp } from "./httpApp.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "evidence-synthesis-desk",
      display_name: "Evidence Synthesis Desk",
      port,
    }),
  );
});
