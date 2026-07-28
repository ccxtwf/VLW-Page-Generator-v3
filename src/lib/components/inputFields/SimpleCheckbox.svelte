<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface SimpleCheckboxProps extends Omit<HTMLInputAttributes, "type"> {
    label: string;
    checked?: boolean;
    textClass?: string;
  }

  let {
    id,
    label,
    checked = $bindable(false),
    textClass = "",
    ...rest
  }: SimpleCheckboxProps = $props();
</script>

<label class="label flex cursor-pointer items-center gap-2 select-none">
  <input
    {id}
    type="checkbox"
    class="checkbox"
    bind:checked
    {...rest}
  />
  <span class={["label-text text-primary-content", textClass]}>{label}</span>
</label>