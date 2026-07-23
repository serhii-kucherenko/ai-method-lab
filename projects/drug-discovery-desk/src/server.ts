import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "drug-discovery-desk",
      display_name: "Drug Discovery Desk",
      port,
    }),
  );
});
