import { createApp } from "./httpApp.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "joint-care-desk",
      display_name: "Joint Care Desk",
      port,
    }),
  );
});
