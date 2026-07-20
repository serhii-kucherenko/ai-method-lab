import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3001);
createApp().server.listen(port, () => {
  console.log(`Ledgerlite listening on http://127.0.0.1:${port}`);
});
