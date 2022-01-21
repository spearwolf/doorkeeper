// eslint-disable-next-line import/no-unresolved
import chalk from "chalk";
import config from "config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import createHashFromSecret from "../lib/users/createHashFromSecret.js";

const projectDir = path.dirname(path.join(process.argv[1], ".."));

const userName = process.argv[2];
const userSecret = process.argv[3];

if (process.argv.length !== 4 || ["-h", "--help", "help"].includes(userName)) {
  console.error(`simple usage:
$ node ${path.basename(process.argv[1])} <username> <secret>

${chalk.underline(
  `Create or update an user <-> secret pair from the ${chalk.blue("users.json")} config`,
)}

This scripts loads the configuration from ${chalk.green(`${projectDir}/config/`)}
which depends on the environment variable ${chalk.red("NODE_ENV=")}${chalk.yellow(
    process.env.NODE_ENV ?? "<which is currently unset>",
  )}

So, for example if you want to change a secret from the "test" environment
you should set NODE_ENV=test before executing this script.
If you leave it empty, the "development" environment is used as default.

${chalk.italic("Thank you and have a nice day :)")}`);
  process.exit(1);
}

const usersFile = config.get("users.staticUsersFile");
console.log("loading users.json:", chalk.bold(usersFile));

const users = JSON.parse(fs.readFileSync(usersFile, { encoding: "utf8" }));
const secret = createHashFromSecret(userSecret);

if (users[userName]) {
  console.log("found", chalk.green(userName), "in existing users");
  if (users[userName].secret === secret) {
    console.log(chalk.italic("secret did not changed\nleaving users.json untouched"));
    process.exit(0);
  }
  console.log("updating secret; updated entry is now:");
  users[userName].secret = secret;
} else {
  console.log("creating new user:", chalk.red(userName));
  users[userName] = {
    secret,
    displayName: userName,
    roles: [],
    uid: crypto.randomUUID(),
  };
}
console.log(JSON.stringify(users[userName], null, 2));

console.log(chalk.italic("writing new content to users.json"));
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), { encoding: "utf8" });
