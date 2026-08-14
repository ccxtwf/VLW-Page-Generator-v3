<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { preventDefault } from "../../utils/utils";

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
  onkeypress={preventDefault}
  {...rest}
/>