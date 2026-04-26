type LogValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | LogValue[]
  | { [key: string]: LogValue };

type LogFields = Record<string, LogValue>;

function stringifyFields(fields?: LogFields): string {
  if (!fields || Object.keys(fields).length === 0) return "";

  try {
    const seen = new WeakSet<object>();
    return ` ${JSON.stringify(fields, (_key, value) => {
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack ?? null,
        };
      }

      if (typeof value === "bigint") {
        return value.toString();
      }

      if (typeof value === "function") {
        return `[Function ${value.name || "anonymous"}]`;
      }

      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);

        const ctorName = (value as { constructor?: { name?: string } }).constructor?.name;
        if (ctorName === "CryptoKey") {
          return "[CryptoKey]";
        }
        if (ctorName === "CryptoKeyPair") {
          return "[CryptoKeyPair]";
        }
      }

      return value;
    })}`;
  } catch {
    return ' {"logError":"failed to serialize fields"}';
  }
}

function writeLog(level: "log" | "error", scope: string, message: string, fields?: LogFields) {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${scope}] ${message}${stringifyFields(fields)}`);
}

export const logger = {
  info(_scope: string, _message: string, _fields?: LogFields) {},
  warn(_scope: string, _message: string, _fields?: LogFields) {},
  diagnostic(scope: string, message: string, fields?: LogFields) {
    writeLog("log", scope, message, fields);
  },
  error(scope: string, message: string, fields?: LogFields) {
    writeLog("error", scope, message, fields);
  },
};
