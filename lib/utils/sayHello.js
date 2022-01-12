import config from "config";
import colors from "colors";
import logger from "../logger.js";

const logPretty = config.get("log.pretty");

export function sayHello(name, url) {
  if (logPretty) {
    console.log(
      `${colors.bold("\nBootstrap {{{")} ${colors.bold.red(name)} ${colors.bold("}}} service")}`,
    );
    console.log(colors.gray("o---(===========-====---==---=-=------- ---  --   -"));
    console.log(colors.bold(" URL:"), colors.blue(url));
    console.log(colors.gray("o---(===========-====---==---=---=------ ---  ---  - -"));
  } else {
    logger.info("bootstrap doorkeeper service, url: %s", url);
  }
}
