export default (res, token) => {
  res.setHeader("Content-Type", "application/jwt");
  res.send(token);
};
