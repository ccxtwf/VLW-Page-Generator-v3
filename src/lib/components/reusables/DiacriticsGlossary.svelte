<script lang="ts">
  import { _ } from "svelte-i18n";
  import ClosableCard from "./ClosableCard.svelte";

  let { onclose } = $props();

  let tooltip: HTMLDivElement; //oxlint-disable-line no-unassigned-vars

  async function copyDiacritic(e: Event) {
    try {
      const el = e.currentTarget as HTMLDivElement;
      const value = el.innerText;
      await navigator.clipboard.writeText(value);
      showSuccessfullyCopiedNotice(el);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  function showSuccessfullyCopiedNotice(el: HTMLDivElement) {
    const bound = el.parentNode!.parentElement!;
    const child = el.getBoundingClientRect();
    const parent = bound.getBoundingClientRect();
    const top = child.top - parent.top;
    const left = child.left - parent.left + child.width / 2;

    tooltip.style.cssText = `top:${top}px; left:${left}px;`;
    tooltip.classList.remove("hidden");

    setTimeout(() => {
      tooltip.classList.add("hidden");
    }, 1000);
  }
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
  <div class="chars relative grid w-full grid-cols-2 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
    {#each chars as charGroup}
      <div class="flex flex-row gap-x-2">
        {#each charGroup as char}
          <div
            class="bg-neutral text-neutral-content inline-block w-8 cursor-pointer rounded px-1 py-1.5 text-center"
            onclick={copyDiacritic}
          >
            {char}
          </div>
        {/each}
      </div>
    {/each}
    <div
      class="tooltip tooltip-open absolute hidden"
      data-tip={$_("formActions.copiedOutput")}
      bind:this={tooltip}
    ></div>
  </div>
</ClosableCard>