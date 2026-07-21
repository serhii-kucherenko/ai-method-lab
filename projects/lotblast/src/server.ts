import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 8787);
const { server } = createApp();
server.listen(port, () => {
  console.log(JSON.stringify({ event: "listen", port }));
});
