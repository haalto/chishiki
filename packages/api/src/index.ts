import { PORT } from "./config";
import server from "./server";

const fastify = server();

const start = async () => {
  try {
    await fastify.listen(PORT);
    console.log(`API running on port ${PORT}`);
  } catch (e) {
    fastify.log.error(e);
    console.error(e);
    process.exit(1);
  }
};
start();
