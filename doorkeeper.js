import config from "config";
import fs from "fs";
import app from "./lib/app.js";
import { sayHello } from "./lib/utils/sayHello.js";

const packageJson = JSON.parse(fs.readFileSync("./package.json"));

const PORT = config.get("port");

app.listen(PORT);

sayHello(packageJson.name, `http://localhost:${PORT}/`);
