import config from "config";
import fs from "fs";

export const PUBLIC_KEY = fs.readFileSync(config.get("keyFile.public"));
export const PRIVATE_KEY = fs.readFileSync(config.get("keyFile.private"));
export const PRIVATE_KEY_PASSPHRASE = config.get("keyFile.passphrase");
