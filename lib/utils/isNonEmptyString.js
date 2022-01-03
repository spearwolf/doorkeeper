export const isNonEmptyString = (str) => typeof str === "string" && str.trim().length > 0;

export const isEmptyString = (str) => !isNonEmptyString(str);
