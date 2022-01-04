import config from "config";

const jwtConfig = config.get("jwt");

export default (sub) => ({ sub, iss: jwtConfig.get("iss") });
