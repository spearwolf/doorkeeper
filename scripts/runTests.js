import { npmExec } from "./execUtils.js";
import "./setupProjectEnv.js";

export default async (nodeEnv = "test") => {
  process.env.NODE_ENV = nodeEnv;

  if (process.argv.length > 3) {
    const customArgs = Array.from(process.argv).slice(3);
    return npmExec("mocha", "--colors", ...customArgs);
  }

  return npmExec("mocha", "--colors", "test/*");
};
