<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";

  interface Props extends HTMLTextareaAttributes {
    value?: string;
  }

  let { placeholder, id, value = $bindable(""), ...rest }: Props = $props();
</script>

<textarea
  {id}
  class="textarea textarea-bordered w-full"
  {placeholder}
  bind:value
  {...rest}></textarea>