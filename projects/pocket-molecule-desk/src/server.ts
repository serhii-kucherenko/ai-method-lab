import { createApp } from "./httpApp.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "pocket-molecule-desk",
      display_name: "Pocket Molecule Desk",
      port,
    }),
  );
});
