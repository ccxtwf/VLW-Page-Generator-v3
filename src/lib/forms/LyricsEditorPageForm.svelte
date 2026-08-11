<script lang="ts">
  import { onDestroy, onMount, type SvelteComponent } from "svelte";
  import { _ } from "svelte-i18n";
  import SimpleTextInput from "../components/inputFields/SimpleTextInput.svelte";
  import SimpleCheckbox from "../components/inputFields/SimpleCheckbox.svelte";
  import Tooltip from "../components/reusables/Tooltip.svelte";
  import Divider from "../components/reusables/Divider.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";
  import Glossary from "../components/reusables/Glossary.svelte";
  import LyricsFreeEditTable from "../components/handsontables/LyricsFreeEditTable.svelte";

  import {
    consolidateCellInlineColourFormatting,
    decapitalizeRomanization,
    detonePinyinLyrics,
    standardizeHepburnRomanization,
  } from "../utils/lyricsEditFormActions";
  import { generateLyricsSegment } from "../utils/lyricsUtils";
  import type { LyricsParsePayload } from "../../schemas/events.d";

  let { ongenerate }: { ongenerate: (results: string) => void } = $props();

  let toggleText: string = $state("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
  let translator: string = $state("");
  let isOfficialTranslation: boolean = $state(false);

  let hot: SvelteComponent;

  function handleSubmit(e: Event) {
    e.preventDefault();
    const data = hot!.getData();
    const results = generateLyricsSegment(data, {
      needsRomanization: true,
      needsTranslation: true,
      showEnglishColumn: false,
      toggleElement: toggleText,
      translator,
      isOfficialTranslation,
    });
    ongenerate(results);
  }

  function handleFormAction(fn: (data: unknown[][]) => unknown[][]) {
    return () => {
      hot.editAction(fn);
    };
  }

  const cbEventListener = (e: CustomEvent<LyricsParsePayload>) => {
    const { toggleText: a, lyrics: b, translator: c, isOfficialTranslation: d } = e.detail;
    toggleText = a;
    hot!.loadData(b);
    translator = c;
    isOfficialTranslation = d;
  };
  onMount(() => {
    window.addEventListener("parsedLyrics", cbEventListener);
  });
  onDestroy(() => {
    window.removeEventListener("parsedLyrics", cbEventListener);
  });
</script>

<form
  name="lyrics-generator"
  class="mt-8 mb-4 grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={handleSubmit}
>
  <div class="w-full font-medium">
    <label
      class="w-full"
      for="lyrics-toggle-wikitext"
    >
      {$_("lyricsEditor.fields.lyricsToggleWikitext.label")}
    </label>
  </div>
  <div class="flex w-full flex-col gap-2 sm:flex-row">
    <SimpleTextInput
      id="lyrics-toggle-wikitext"
      placeholder={$_("lyricsEditor.fields.lyricsToggleWikitext.placeholder")}
      value={toggleText}
      onblur={(e: Event) => {
        //@ts-ignore
        toggleText = e.currentTarget?.value || "";
      }}
    />
  </div>

  <LyricsFreeEditTable
    id="lyrics"
    class="col-span-full"
    bind:this={hot}
    bind:toggleText
  />

  <div class="w-full font-medium">
    <label
      class="w-full"
      for="translator"
    >
      {$_("lyricsEditor.fields.translator.label")}
    </label>
  </div>
  <div class="flex w-full flex-col gap-2 sm:flex-row">
    <SimpleTextInput
      id="translator"
      placeholder={$_("lyricsEditor.fields.translator.placeholder")}
      bind:value={translator}
    />
    <div class="flex flex-nowrap items-center gap-2">
      <SimpleCheckbox
        id="is-official-translation"
        textClass="text-xs"
        label={$_("lyricsEditor.fields.translator.isOfficialCheckboxLabel")}
        bind:checked={isOfficialTranslation}
      />
      <Tooltip>
        {@html $_("lyricsEditor.fields.translator.isOfficialTooltip")}
      </Tooltip>
    </div>
  </div>

  <Divider />

  <Glossary />

  <Divider />

  <div class="md:join col-span-full w-full">
    {let sharedGroupStyle = "md:join-item col-span-full w-full sm:join border-none md:border-none"}
    {let sharedButtonStyle = "sm:join-item btn btn-accent sm:w-1/2 sm:h-16 max-sm:w-full"}
    <div class={sharedGroupStyle}>
      <button
        class={sharedButtonStyle}
        type="button"
        onclick={handleFormAction(decapitalizeRomanization)}
      >
        {$_("lyricsEditor.fields.actions.decapitalize")}
      </button>
      <button
        class={[sharedButtonStyle, "md:rounded-r-none"]}
        type="button"
        onclick={handleFormAction(consolidateCellInlineColourFormatting)}
      >
        {$_("lyricsEditor.fields.actions.consolidateFormatting")}
      </button>
    </div>
    <div class={sharedGroupStyle}>
      <button
        class={[sharedButtonStyle, "md:rounded-l-none"]}
        type="button"
        onclick={handleFormAction(standardizeHepburnRomanization)}
      >
        {$_("lyricsEditor.fields.actions.standardizeRomanization")}
      </button>
      <button
        class={sharedButtonStyle}
        type="button"
        onclick={handleFormAction(detonePinyinLyrics)}
      >
        {$_("lyricsEditor.fields.actions.removePinyinTones")}
      </button>
    </div>
  </div>

  <Divider />

  <GenerateButton class="btn-block col-span-full" />
</form>