import { use } from "react";

export function unwrapParams<T>(params: T | Promise<T>) {
  return typeof (params as Promise<T>)?.then === "function"
    ? use(params as Promise<T>)
    : (params as T);
}
