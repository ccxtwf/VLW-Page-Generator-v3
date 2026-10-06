<script lang="ts">
  import { _ } from "svelte-i18n";
  import MultiSelect from "svelte-multiselect";
  import { SYNTH_ENGINES } from "../../../constants";
  import type { Synth } from "../../../constants/types";

  interface SynthsMultiSelectProps {
    placeholder?: string;
    selected?: { label: string; value: number }[];
  }

  let { selected = $bindable([]), placeholder }: SynthsMultiSelectProps = $props();
</script>

<MultiSelect
  id="synths"
  options={SYNTH_ENGINES.map(({ id, name }: Synth) => ({
    label: name,
    value: id,
  }))}
  bind:selected
  {placeholder}
/>