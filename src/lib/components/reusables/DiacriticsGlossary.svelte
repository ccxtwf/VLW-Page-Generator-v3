<script lang="ts">
  import ClosableCard from "./ClosableCard.svelte";

  let { onclose } = $props();
</script>

<ClosableCard {onclose}>
  {let chars = [
    ["ā", "á", "ǎ", "à"],
    ["Ā", "Á", "Ǎ", "À"],
    ["ī", "í", "ǐ", "ì"],
    ["Ī", "Í", "Ǐ", "Ì"],
    ["ū", "ú", "ǔ", "ù"],
    ["Ū", "Ú", "Ǔ", "Ù"],
    ["ǖ", "ǘ", "ǚ", "ǜ"],
    ["Ǖ", "Ǘ", "Ǚ", "Ǜ"],
    ["ē", "é", "ě", "è"],
    ["Ē", "É", "Ě", "È"],
    ["ō", "ó", "ǒ", "ò"],
    ["Ō", "Ó", "Ǒ", "Ò"],
  ]}
  <div class="chars grid w-full grid-cols-2 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
    {#each chars as charGroup}
      <div class="flex flex-row gap-x-2">
        {#each charGroup as char}
          <div
            class="bg-neutral text-neutral-content inline-block w-8 rounded px-1 py-1.5 text-center"
          >
            {char}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</ClosableCard>