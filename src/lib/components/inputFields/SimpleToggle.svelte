<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface SimpleToggleProps extends Omit<HTMLInputAttributes, "type"> {
    label: string;
    checked?: boolean;
  }

  let { id, label, checked = $bindable(false), ...rest }: SimpleToggleProps = $props();
</script>

<label class="label flex cursor-pointer items-center gap-2 select-none">
  <input
    {id}
    type="checkbox"
    bind:checked
    class="toggle"
    {...rest}
  />
  <span class="label-text text-gray-200">{label}</span>
</label>