#!/usr/bin/env zx
/* global $ */

import { userInfo } from "os";
import { projectDir } from "./setupProjectEnv.js";

const mermaid = (...args) =>
  $`docker run -it -u ${userInfo().uid} -v ${projectDir}/docs:/data minlag/mermaid-cli ${args}`;

await mermaid(...process.argv.slice(2));
