<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLInputAttributes, "type"> {
    value?: string;
  }

  let { id, value = $bindable(""), ...rest }: Props = $props();
</script>

<input
  {id}
  type="date"
  class="input input-bordered w-full"
  bind:value
  {...rest}
/>