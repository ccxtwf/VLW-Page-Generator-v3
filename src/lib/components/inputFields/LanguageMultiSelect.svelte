<script lang="ts">
  import { _ } from "svelte-i18n";
  import MultiSelect from "svelte-multiselect";
  import { LANGUAGES } from "../../../constants";
  import type { Language } from "../../../constants/types";

  interface LanguageMultiSelectProps {
    placeholder?: string;
    selected?: { label: string; value: number }[];
  }

  let { selected = $bindable([]), placeholder }: LanguageMultiSelectProps = $props();
</script>

<MultiSelect
  id="languages"
  options={LANGUAGES.map(({ name }: Language, idx) => ({
    label: name,
    value: idx,
  }))}
  bind:selected
  {placeholder}
/>