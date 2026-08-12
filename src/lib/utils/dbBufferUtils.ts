/**
 * Loads synths.db as a data buffer.
 *
 * @returns
 */
export async function getDbBuffer(): Promise<ArrayBuffer> {
  const res = await fetch("/synths.db");
  if (!res.ok) {
    throw new Error(`Got unexpected response from server: ${res.status} ${res.statusText}`);
  }
  const buffer = await res.arrayBuffer();
  return buffer;
}