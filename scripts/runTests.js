import { npmExec } from "./execUtils.js";
import "./setupProjectEnv.js";

export default async (nodeEnv = "test") => {
  process.env.NODE_ENV = nodeEnv;

  return npmExec("mocha", "--colors", "test/*");
};
