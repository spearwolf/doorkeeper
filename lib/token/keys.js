import fs from "fs";

import config from "config";

export const PUBLIC_KEY = fs.readFileSync(config.get("keyFile.public"));
export const PRIVATE_KEY = fs.readFileSync(config.get("keyFile.private"));
