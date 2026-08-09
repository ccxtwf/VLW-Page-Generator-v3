<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface SimpleToggleProps extends Omit<HTMLInputAttributes, "type"> {
    label: string;
    checked?: boolean;
    textClass?: string;
  }

  let {
    id,
    label,
    checked = $bindable(false),
    textClass = "text-xs sm:text-base",
    ...rest
  }: SimpleToggleProps = $props();
</script>

<label class="label flex cursor-pointer items-center gap-2 select-none">
  <input
    {id}
    type="checkbox"
    bind:checked
    class="toggle"
    {...rest}
  />
  <span class={["label-text", textClass]}>{label}</span>
</label>