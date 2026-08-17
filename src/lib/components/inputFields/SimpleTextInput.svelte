<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { keydownPreventDefault } from "../../utils/utils";

  interface Props extends Omit<HTMLInputAttributes, "type"> {
    value?: string;
  }

  let { placeholder, id, value = $bindable(""), ...rest }: Props = $props();
</script>

<input
  {id}
  type="text"
  class="input input-bordered w-full"
  {placeholder}
  bind:value
  onkeydown={keydownPreventDefault}
  {...rest}
/>
