const isDebug = process.env.BOT_ENV !== "production";

export interface Logger {
  print: (...args: any) => void;
  log: (...args: any) => void;
  warn: (...args: any) => void;
  error: (...args: any) => void;
}

const logTag = function (prefix: string): string {
  return `<${prefix}>`;
};

export const newLogger = function (prefix: string): Logger {
  const tag = prefix ? logTag(prefix) : "";
  return {
    print: function print(...args: any) {
      console.log(tag, ...args);
    },

    log: function log(...args: any) {
      if (isDebug) {
        this.print(...args);
      }
    },

    warn: function warn(...args: any) {
      if (isDebug) {
        console.warn(tag, ...args);
      }
    },

    error: function error(e, ...args: any) {
      if (isDebug) {
        console.error(tag, e, ...args);
      }
    },
  };
};
