import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "virulence-feature-desk",
      display_name: "Virulence Feature Desk",
      port,
    }),
  );
});
