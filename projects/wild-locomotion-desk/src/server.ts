import { createApp } from "./httpApp.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "wild-locomotion-desk",
      display_name: "Wild Locomotion Desk",
      port,
    }),
  );
});
