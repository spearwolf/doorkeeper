import { destroyAllTokens } from "./store/index.js";

export default function (_req, res) {
  // TODO check more permissions!?

  destroyAllTokens()
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400));
}
