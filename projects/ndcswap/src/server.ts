import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3848);
const { server } = createApp();
server.listen(port, () => {
  console.log(JSON.stringify({ event: "listen", port }));
});
