<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface SimpleCheckboxProps extends Omit<HTMLInputAttributes, "type"> {
    label: string;
    checked?: boolean;
    textClass?: string;
    toggle?: boolean;
  }

  let {
    id,
    label,
    checked = $bindable(false),
    textClass = "text-xs sm:text-sm",
    toggle = false,
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

<label class="label cursor-pointer pe-2 select-none">
  <input
    {id}
    type="checkbox"
    class={toggle ? "toggle" : "checkbox"}
    bind:checked
    {onkeypress}
    {...rest}
  />
  <span class={["label-text", textClass]}>{label}</span>
</label>