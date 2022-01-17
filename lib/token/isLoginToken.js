import { TOKEN_KEY_TYPE, TOKEN_TYPE_LOGIN } from "./generate/constants.js";

export default (decodedToken) => decodedToken[TOKEN_KEY_TYPE] === TOKEN_TYPE_LOGIN;
