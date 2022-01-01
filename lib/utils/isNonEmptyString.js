export function isNonEmptyString(str) {
  return typeof str === "string" && str.trim().length;
}
