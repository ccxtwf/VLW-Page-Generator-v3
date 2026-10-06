<script lang="ts">
  import type { HTMLSelectAttributes, HTMLOptionAttributes } from "svelte/elements";

  interface Props extends HTMLSelectAttributes {
    placeholder?: string;
    options?: (HTMLOptionAttributes & { contents?: string | HTMLElement })[];
  }

  let {
    placeholder,
    options = [],
    id,
    value = $bindable(""),
    class: cssClass,
    ...rest
  }: Props = $props();
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
  {#each options as { contents = '', ...option }}
    <option {...option}>{contents}</option>
  {/each}
</select>