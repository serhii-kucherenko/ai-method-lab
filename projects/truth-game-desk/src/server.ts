import { createApp } from "./httpApp.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "truth-game-desk",
      display_name: "Truth Game Desk",
      port,
    }),
  );
});
