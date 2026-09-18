<script lang="ts">
  import { ENUM_IMAGE_EMBED_SOURCE_TYPE } from "../../models/enums";
  import type { IImageEmbed } from "../../models/schema";

  import { getImageAsDataBlob } from "#src/lib/utils/fetchImageUtils.js";

  type ImgEvent = Event & { currentTarget: EventTarget & HTMLImageElement };

  let { type, src, alt = "", ...rest }: IImageEmbed = $props();
  let isDone: boolean = false;

  function onLoadYT(e: ImgEvent) {
    if (isDone) return;
    if (e.currentTarget.naturalHeight >= 200) {
      isDone = true;
      return;
    }
    const curSrc = e.currentTarget.src || "";
    if (curSrc.endsWith("maxresdefault.jpg")) {
      e.currentTarget.src = `https://i.ytimg.com/vi/${e.currentTarget.getAttribute("data-ytid")}/hqdefault.jpg`;
    } else if (curSrc.endsWith("hqdefault.jpg")) {
      e.currentTarget.src = `https://i.ytimg.com/vi/${e.currentTarget.getAttribute("data-ytid")}/default.jpg`;
      isDone = true;
    }
  }

  function onErrorBB(e: ImgEvent) {
    if (isDone) return;
    getImageAsDataBlob(e.currentTarget.src || "", { method: "GET" })
      .then((blob) => {
        e.currentTarget.src = blob ? blob.toString() : "";
      })
      .catch(console.error)
      .finally(() => {
        isDone = true;
      });
  }

  function onErrorNN(e: ImgEvent) {
    if (isDone) return;
    e.currentTarget.src = e.currentTarget.getAttribute("data-thumburl") || "";
    isDone = true;
  }
</script>

<img
  {src}
  {alt}
  class="w-full md:w-sm"
  //@ts-ignore
  onload={type === ENUM_IMAGE_EMBED_SOURCE_TYPE.yt ? onLoadYT : null}
  onerror={type === ENUM_IMAGE_EMBED_SOURCE_TYPE.nn
    ? onErrorNN
    : type === ENUM_IMAGE_EMBED_SOURCE_TYPE.bb
      ? onErrorBB
      : null}
  {...rest}
/>