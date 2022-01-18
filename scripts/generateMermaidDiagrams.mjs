#!/usr/bin/env zx

import { userInfo } from "os";
import { projectDir } from "./setupProjectEnv.js";

const mermaid = (file) =>
  $`docker run -it -u ${userInfo().uid} -v ${projectDir}/docs:/data minlag/mermaid-cli -i /data/${file}`;

await Promise.all([
  mermaid('login-via-password.mmd')
]);
