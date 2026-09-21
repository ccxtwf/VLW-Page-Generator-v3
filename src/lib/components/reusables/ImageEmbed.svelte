<script lang="ts">
  import { ENUM_IMAGE_EMBED_SOURCE_TYPE } from "../../models/enums";
  import type { IImageEmbed } from "../../models/schema";

  import { getImageAsDataBlob } from "#src/lib/utils/fetchImageUtils.js";

  type ImgEvent = Event & {
    target: EventTarget & HTMLImageElement;
    currentTarget: EventTarget & HTMLImageElement;
  };

  let { type, src, alt = "", ...rest }: IImageEmbed = $props();
  let isDone: boolean = false;

  function onLoadYT(e: ImgEvent) {
    if (isDone) return;
    if (e.target.naturalHeight >= 200) {
      isDone = true;
      return;
    }
    const curSrc = e.target.src || "";
    if (curSrc.endsWith("maxresdefault.jpg")) {
      e.target.src = `https://i.ytimg.com/vi/${e.target.getAttribute("data-ytid")}/hqdefault.jpg`;
    } else if (curSrc.endsWith("hqdefault.jpg")) {
      e.target.src = `https://i.ytimg.com/vi/${e.target.getAttribute("data-ytid")}/default.jpg`;
      isDone = true;
    }
  }

  function onErrorBB(e: ImgEvent) {
    if (isDone) return;
    getImageAsDataBlob(e.target.src || "", { method: "GET" })
      .then((blob) => {
        e.target.src = blob ? blob.toString() : "";
      })
      .catch(console.error)
      .finally(() => {
        isDone = true;
      });
  }

  function onErrorNN(e: ImgEvent) {
    if (isDone) return;
    e.target.src = e.target.getAttribute("data-thumburl") || "";
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