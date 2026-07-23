import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 8765);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "filing-penalty-desk",
      display_name: "Filing Penalty Desk",
      port,
    }),
  );
});
