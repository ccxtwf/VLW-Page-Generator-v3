<script lang="ts">
  import { _ } from "svelte-i18n";
  import MultiSelect from "svelte-multiselect";
  import SYNTHS from "../../../constants/synths.json";
  import type { Synth } from "../../../constants/types";

  interface SynthsMultiSelectProps {
    placeholder?: string;
    selected?: { label: string; value: number }[];
  }

  let { selected, placeholder }: SynthsMultiSelectProps = $props();
</script>

<MultiSelect
  options={SYNTHS.map(({ id, name }: Synth) => ({ label: name, value: id }))}
  bind:selected
  {placeholder}
  required={true}
/>