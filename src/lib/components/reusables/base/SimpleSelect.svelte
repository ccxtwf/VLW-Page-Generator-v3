<script lang="ts">
  import type { HTMLSelectAttributes, HTMLOptionAttributes } from "svelte/elements";

  interface CustomOption extends HTMLOptionAttributes {
    contents?: string | HTMLElement;
  }
  interface Props extends HTMLSelectAttributes {
    placeholder?: string;
    options?: (string | CustomOption)[];
  }

  let {
    placeholder,
    options = [],
    value = $bindable(""),
    class: cssClass,
    ...rest
  }: Props = $props();

  function mapOption(opt: string | CustomOption): CustomOption {
    if (typeof opt === "string") {
      return { value: opt, contents: opt };
    } else {
      return opt;
    }
  }
</script>

<select
  class={["select", cssClass]}
  bind:value
  {...rest}
>
  {#if placeholder}
    <option
      disabled
      selected={!value}>{placeholder}</option
    >
  {/if}
  {#each options as o}
    {const { contents, ...option } = mapOption(o)}
    <option {...option}>{contents}</option>
  {/each}
</select>