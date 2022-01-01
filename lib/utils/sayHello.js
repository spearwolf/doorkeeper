import colors from "colors";

export function sayHello(name, url) {
  console.log(`${colors.bold("\nBootstrap {{{")} ${colors.bold.red(name)} ${colors.bold("}}} service")}`);
  console.log(colors.gray("o---(===========-====---==---=-=------- ---  --   -"));
  console.log(colors.bold(" URL:"), colors.blue(url));
  console.log(colors.gray("o---(===========-====---==---=---=------ ---  ---  - -"));
}
