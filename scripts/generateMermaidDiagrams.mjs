#!/usr/bin/env zx
/* global $ */

import { userInfo } from "os";
import { projectDir } from "./setupProjectEnv.js";

const mermaid = (file) =>
  $`docker run -it -u ${
    userInfo().uid
  } -v ${projectDir}/docs:/data minlag/mermaid-cli -f -i /data/${file} -c /data/mermaid.json -b transparent`;

await Promise.all([mermaid("login-via-password.mmd"), mermaid("create-session-token.mmd")]);
