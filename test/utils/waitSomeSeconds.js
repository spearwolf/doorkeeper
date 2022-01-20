export default (seconds) =>
  new Promise((resolve) => setTimeout(resolve, Math.round(seconds * 1000)));
