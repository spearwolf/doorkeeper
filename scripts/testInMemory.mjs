#!/usr/bin/env zx

import "./setupProjectEnv.js";
import { npmExec } from "./execUtils.js";

process.env.NODE_ENV = "test";

await npmExec("mocha", "--colors", "test/*");
