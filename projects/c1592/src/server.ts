import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 8792);
const { server } = createApp();
server.listen(port, () => {
  console.log(JSON.stringify({ event: "listen", product: "c1592", port }));
});
