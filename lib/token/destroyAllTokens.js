import { destroyAllTokens } from "./store/index.js";

export default function (req, res) {
  // TODO check permissions!

  destroyAllTokens()
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400));
}
