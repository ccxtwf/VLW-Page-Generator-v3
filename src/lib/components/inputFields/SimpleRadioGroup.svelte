<script lang="ts">
  import { keydownPreventDefault } from "../../utils/utils";

  interface SimpleRadioGroupProps {
    class?: string;
    labelClass?: string;
    id?: string;
    name: string;
    options: { label: string; value: string | number }[];
    selected: number;
  }

  let {
    class: cssClass,
    labelClass,
    id,
    name,
    options,
    selected = $bindable(0),
  }: SimpleRadioGroupProps = $props();
</script>

<div
  {id}
  class={[cssClass, "flex w-full flex-wrap items-center gap-y-2"]}
>
  {#each options as { label, value }}
    <label class={[labelClass, "cursor-pointer select-none"]}>
      <input
        type="radio"
        {name}
        {value}
        bind:group={selected}
        class="radio radio-sm"
        onkeypress={keydownPreventDefault}
      />
      <span class="label-text ms-1 text-sm">
        {label}
      </span>
    </label>
  {/each}
</div>