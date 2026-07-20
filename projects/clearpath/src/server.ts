import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const { server } = createApp();
server.listen(port, () => {
  console.log(`Clearpath listening on http://127.0.0.1:${port}`);
});
