/**
 * Written by Claude under the following prompt:
 * ```write me an equality matcher for the following Svelte class:```
 */

import { expect } from "vite-plus/test";

/** All own + inherited (non-Object.prototype) property names, including accessors */
function getAllPropertyNames(obj: object): string[] {
  const names = new Set<string>();
  let current: object | null = obj;
  while (current && current !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(current)) {
      if (key !== "constructor") names.add(key);
    }
    current = Object.getPrototypeOf(current);
  }
  return [...names];
}

/** Recursively convert a class instance (incl. $state accessors) into a plain object */
function toPlain(value: unknown, seen = new WeakMap<object, unknown>()): unknown {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return value.getTime();
  if (Array.isArray(value)) return value.map((v) => toPlain(v, seen));

  if (seen.has(value)) return seen.get(value);
  const plain: Record<string, unknown> = {};
  seen.set(value, plain);

  for (const key of getAllPropertyNames(value)) {
    let v: unknown;
    try {
      v = (value as Record<string, unknown>)[key];
    } catch {
      continue; // write-only accessor, etc.
    }
    if (typeof v === "function") continue;
    plain[key] = toPlain(v, seen);
  }
  return plain;
}

expect.extend({
  toEqualState(received: unknown, expected: unknown) {
    const receivedPlain = toPlain(received);
    const expectedPlain = toPlain(expected);
    const pass = this.equals(receivedPlain, expectedPlain);

    return {
      pass,
      message: () =>
        `${this.utils.matcherHint("toEqualState", undefined, undefined, {
          isNot: this.isNot,
        })}\n\n${this.utils.diff(expectedPlain, receivedPlain)}`,
    };
  },
});

interface CustomMatchers<R = unknown> {
  toEqualState(expected: unknown): R;
}

declare module "vitest" {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}