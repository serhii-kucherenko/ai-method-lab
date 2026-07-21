import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3849);
const { server } = createApp();
server.listen(port, () => {
  console.log(JSON.stringify({ event: "listen", port }));
});
