import config from "config";
import pino from "pino";

const logPretty = config.get("log.pretty");

export default pino({
  ...(logPretty
    ? {
        transport: {
          target: "pino-pretty",
        },
      }
    : undefined),
});
