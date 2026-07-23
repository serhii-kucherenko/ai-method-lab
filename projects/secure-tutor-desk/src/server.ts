import { createApp } from "./httpApp.js";

const port = Number(process.env.PORT ?? 3847);
const { server } = createApp();
server.listen(port, () => {
  console.log(
    JSON.stringify({
      event: "listen",
      product: "secure-tutor-desk",
      display_name: "Secure Tutor Desk",
      port,
    }),
  );
});
