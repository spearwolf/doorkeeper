// maybe a little too simple - but for now that's enough :)
export default (login, password) =>
  typeof login === "string" &&
  typeof password === "string" &&
  login.length > 2 &&
  password.length &&
  password.indexOf(login) !== -1;
