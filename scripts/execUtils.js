import { spawn } from "child_process";
import { platform, stderr, stdout } from "process";
import "zx/globals";

export const exec = async (...args) => {
  const cmd = args.shift();

  return new Promise((resolve, reject) => {
    const childProcess = spawn(cmd, args);

    childProcess.stdout.pipe(stdout, { end: true });
    childProcess.stderr.pipe(stderr, { end: true });

    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });

    childProcess.on("error", (err) => {
      console.error("ERROR:", err);
      reject(`failed to start subprocess: ${cmd} ${args?.length > 0 && args.join(" ")}`);
    });
  });
};

export const NPM_CMD = platform.startsWith("win") ? "npm.cmd" : "npm";

export const npmRun = async (cmd, ...args) =>
  exec(NPM_CMD, "run", cmd, ...(args.length > 0 ? ["--", ...args] : []));
export const npmExec = async (cmd, ...args) =>
  exec(NPM_CMD, "exec", cmd, ...(args.length > 0 ? ["--", ...args] : []));
