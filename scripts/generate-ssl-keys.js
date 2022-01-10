import crypto from "crypto";
import util from "util";
import fs from "fs";
import path from "path";

// ================================================================
// preamble
// ---
// - parse command line option
// - show help message
// - exit on bad args
// ================================================================
// {{{

const args = process.argv.slice(2);

let forceOverrideKeyFiles = false;
let noFailWithError = false;

function parseCliOptions() {
  while (args[0]?.startsWith("-")) {
    switch (args[0]) {
      case "-f":
        forceOverrideKeyFiles = true;
        break;

      case "--silent":
        noFailWithError = true;
        break;

      default:
        return;
    }
    args.shift();
  }
}

parseCliOptions();

if (args.length !== 3) {
  console.error(`simple usage:
  node ${process.argv[1]} [ -f ] <public-key-file> <private-key-file> <passphrase>

where the specification of -f causes that already existing key files are overwritten, which is of course not done otherwise.

have fun!`);
  process.exit(1);
}

function errorKeyFileExists(keyFile) {
  if (noFailWithError) {
    process.exit(0);
  } else {
    console.error("key file already exists:", keyFile);
    console.error("use the -f option if you want to override the file");
    process.exit(2);
  }
}

const [publicKeyFile, privateKeyFile, passphrase] = args;

if (!forceOverrideKeyFiles) {
  if (fs.existsSync(publicKeyFile)) {
    errorKeyFileExists(publicKeyFile);
  }
  if (fs.existsSync(privateKeyFile)) {
    errorKeyFileExists(privateKeyFile);
  }
}

// }}}

// ================================================================
// generate key pairs
// ---
// - configure key options
// - write to files
// ================================================================

const crypto_generateKeyPair = util.promisify(crypto.generateKeyPair);

const RSA = "rsa";

const options = {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase,
  },
};

const { publicKey, privateKey } = await crypto_generateKeyPair(RSA, options);

function saveKeyFile(keyFile, data, mode = 0o666) {
  if (keyFile !== "-") {
    fs.mkdirSync(path.dirname(keyFile), { recursive: true });
    fs.writeFileSync(keyFile, data, { mode, flag: "w", encoding: "utf8" });
  } else {
    process.stdout.write(data);
  }
}

saveKeyFile(publicKeyFile, publicKey);
saveKeyFile(privateKeyFile, privateKey, 0o600);
