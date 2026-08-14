<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface SimpleCheckboxProps extends Omit<HTMLInputAttributes, "type"> {
    label: string;
    checked?: boolean;
    textClass?: string;
    isToggle?: boolean;
  }

  let {
    id,
    label,
    checked = $bindable(false),
    textClass = "text-xs sm:text-sm",
    isToggle = false,
    ...rest
  }: SimpleCheckboxProps = $props();

  function onkeypress(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key === "Enter") {
      (e.currentTarget as HTMLInputElement).checked = !(e.currentTarget as HTMLInputElement)
        .checked;
    }
  }
</script>

<label class="label flex cursor-pointer items-center gap-2 select-none">
  <input
    {id}
    type="checkbox"
    class={isToggle ? "toggle" : "checkbox"}
    bind:checked
    {onkeypress}
    {...rest}
  />
  <span class={["label-text", textClass]}>{label}</span>
</label>