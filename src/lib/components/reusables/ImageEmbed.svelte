<script lang="ts">
  import { ENUM_IMAGE_EMBED_SOURCE_TYPE } from "../../models/enums";
  import type { IImageEmbed } from "../../models/schema";

  let { type, src, alt = "", ...rest }: IImageEmbed = $props();

  function onLoadYT(
    e: Event & {
      target: EventTarget & HTMLImageElement;
      currentTarget: EventTarget & HTMLImageElement;
    },
  ) {
    if (e.target.naturalHeight >= 200) {
      e.target.onload = null;
      return;
    }
    const curSrc = e.target.src || "";
    if (curSrc.endsWith("maxresdefault.jpg")) {
      e.target.src = `https://i.ytimg.com/vi/${e.target.getAttribute("data-ytid")}/hqdefault.jpg`;
    } else if (curSrc.endsWith("hqdefault.jpg")) {
      e.target.src = `https://i.ytimg.com/vi/${e.target.getAttribute("data-ytid")}/default.jpg`;
      e.target.onload = null;
    }
  }

  function onErrorNN(
    e: Event & {
      target: EventTarget & HTMLImageElement;
      currentTarget: EventTarget & HTMLImageElement;
    },
  ) {
    e.target.src = e.target.getAttribute("data-thumburl") || "";
    e.target.onerror = null;
  }
</script>

<img
  {src}
  {alt}
  class="w-full md:w-sm"
  //@ts-ignore
  onload={type === ENUM_IMAGE_EMBED_SOURCE_TYPE.yt ? onLoadYT : null}
  onerror={type === ENUM_IMAGE_EMBED_SOURCE_TYPE.nn ? onErrorNN : null}
  {...rest}
/>