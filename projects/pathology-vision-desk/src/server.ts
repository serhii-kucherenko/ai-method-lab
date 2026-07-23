import { createApp } from "./httpApp.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "pathology-vision-desk",
      display_name: "Pathology Vision Desk",
      port,
    }),
  );
});
