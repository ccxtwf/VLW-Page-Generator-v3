<script lang="ts">
  import { _ } from "svelte-i18n";
  import SimpleTextInput from "../components/inputFields/SimpleTextInput.svelte";
  import SimpleCheckbox from "../components/inputFields/SimpleCheckbox.svelte";
  import Tooltip from "../components/reusables/Tooltip.svelte";
  import Divider from "../components/reusables/Divider.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";

  let { forwardGeneratedResults }: { forwardGeneratedResults: (results: string) => void } =
    $props();

  function handleSubmit(e: Event) {
    e.preventDefault();
    forwardGeneratedResults("RESULTS!!");
  }
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
    />
  </div>

  <div class="col-span-full h-32 w-full"></div>

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
    />
    <div class="flex flex-nowrap items-center gap-2">
      <SimpleCheckbox
        id="is-official-translation"
        textClass="text-xs"
        label={$_("lyricsEditor.fields.translator.isOfficialCheckboxLabel")}
      />
      <Tooltip>
        {@html $_("lyricsEditor.fields.translator.isOfficialTooltip")}
      </Tooltip>
    </div>
  </div>

  <Divider />

  <Divider />

  <div class="md:join col-span-full w-full">
    {let sharedGroupStyle = "md:join-item col-span-full w-full sm:join border-none md:border-none"}
    {let sharedButtonStyle = "sm:join-item btn btn-accent sm:w-1/2 sm:h-16 max-sm:w-full"}
    <div class={sharedGroupStyle}>
      <button
        class={sharedButtonStyle}
        type="button"
      >
        {$_("lyricsEditor.fields.actions.decapitalize")}
      </button>
      <button
        class={[sharedButtonStyle, "md:rounded-r-none"]}
        type="button"
      >
        {$_("lyricsEditor.fields.actions.consolidateFormatting")}
      </button>
    </div>
    <div class={sharedGroupStyle}>
      <button
        class={[sharedButtonStyle, "md:rounded-l-none"]}
        type="button"
      >
        {$_("lyricsEditor.fields.actions.standardizeRomanization")}
      </button>
      <button
        class={sharedButtonStyle}
        type="button"
      >
        {$_("lyricsEditor.fields.actions.removePinyinTones")}
      </button>
    </div>
  </div>

  <GenerateButton class="btn-block col-span-full" />
</form>