import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3002);
createApp().server.listen(port, () => {
  console.log(`Signalboard listening on http://127.0.0.1:${port}`);
});
