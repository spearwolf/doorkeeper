import { PUBLIC_KEY } from "./keys.js";

const PEM_MIME_TYPE = "application/x-pem-file";

export default function (req, res) {
  res.setHeader("Content-Type", PEM_MIME_TYPE);
  res.send(PUBLIC_KEY);
}
