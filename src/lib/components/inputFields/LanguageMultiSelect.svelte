<script lang="ts">
  import { _ } from "svelte-i18n";
  import MultiSelect from "svelte-multiselect";
  import LANGUAGES from "../../../constants/languages.json";
  import type { Language } from "../../../constants/types";

  interface LanguageMultiSelectProps {
    placeholder?: string;
    selected?: { label: string; value: number }[];
  }

  let { selected = $bindable([]), placeholder }: LanguageMultiSelectProps = $props();
</script>

<MultiSelect
  bind:selected
  options={LANGUAGES.map(({ name }: Language, idx) => ({
    label: name,
    value: idx,
  }))}
  {placeholder}
  required={true}
/>