export const normalize = (val: string) =>
  val.toLowerCase().replace(/[\s\-_.]/g, "");
