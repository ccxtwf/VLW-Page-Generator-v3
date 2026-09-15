function serializeFetchResponseAsBlob(blob: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function getImageAsDataBlob(
  url: string,
  fetchOptions?: RequestInit,
): Promise<string | ArrayBuffer | null> {
  try {
    const res = await fetch(url, {
      referrer: "",
      referrerPolicy: "no-referrer",
      mode: "cors",
      ...fetchOptions,
    });
    const content = await res.blob();
    const base64 = await serializeFetchResponseAsBlob(content);
    return base64;
  } catch (err) {
    console.error(`[getImageAsDataBlob] Failed to fetch data from ${url}`, err);
    throw err;
  }
}