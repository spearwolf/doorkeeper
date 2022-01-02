import path from "path";
import "zx/globals";

process.on("uncaughtException", () => process.exit(1));

export const projectDir = path.join(__dirname, "..");

cd(projectDir);
