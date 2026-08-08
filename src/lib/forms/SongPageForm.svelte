<script lang="ts">
  import { _ } from "svelte-i18n";

  import FlexRow from "../components/reusables/FlexRow.svelte";
  import Divider from "../components/reusables/Divider.svelte";

  import PreloadFromVocaDBInput from "../components/reusables/PreloadFromVocaDBInput.svelte";
  import LanguageMultiSelect from "../components/inputFields/LanguageMultiSelect.svelte";
  import InfoboxColorInputField from "../components/inputFields/InfoboxColorInputField.svelte";
  import Glossary from "../components/reusables/Glossary.svelte";
  import LyricsTable from "../components/handsontables/LyricsTable.svelte";
  import ExternalLinksTable from "../components/handsontables/ExternalLinksTable.svelte";
  import BroadcastLinksTable from "../components/handsontables/BroadcastLinksTable.svelte";
  import ValidationResultsAlert from "../components/reusables/ValidationResultsAlert.svelte";
  import SimpleTextInput from "../components/inputFields/SimpleTextInput.svelte";
  import SimpleTextFieldBox from "../components/inputFields/SimpleTextFieldBox.svelte";
  import SimpleDateInput from "../components/inputFields/SimpleDateInput.svelte";
  import SimpleCheckbox from "../components/inputFields/SimpleCheckbox.svelte";
  import Tooltip from "../components/reusables/Tooltip.svelte";
  import AutoloadCategoriesButton from "../components/buttons/AutoloadCategoriesButton.svelte";
  import ResetFormButton from "../components/buttons/ResetFormButton.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";
  import type { SvelteComponent } from "svelte";

  import { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES } from "../models/enums";

  import { generatePage, autoloadCategories, fetchDataFromVocaDb } from "../logic/songs.svelte";

  import Song from "../models/Song.svelte";
  import { formSubmitHandler, formResetHandler } from "../logic";
  import { ExternalWebServiceError, VocaDBInvalidUrlError } from "../logic/exceptions";
  
  let formData: Song = new Song();
  let ignoreErrors: boolean = $state(false);

  let warningsElement: SvelteComponent | null = null;
  let broadcastLinksHotTable: SvelteComponent | null = null;
  let extLinksHotTable: SvelteComponent | null = null;
  let lyricsHotTable: SvelteComponent | null = null;

  let { ongenerate }: { ongenerate: (output: string) => void } = $props();

  const handleFetchVocaDb = async (url: string) => {
    if (window.confirm($_("confirmClear"))) {
      const __a = { "1": "VocaDB" };
      try {
        const fetched = await fetchDataFromVocaDb(url);
        formData.updateState(fetched);
        window.alert($_("fetch.success", { values: __a }));
      } catch (err) {
        console.error(err);
        if (err instanceof VocaDBInvalidUrlError) {
          window.alert($_("fetch.invalidVdb", { values: { "1": "S/1501" } }));
        } else if (err instanceof ExternalWebServiceError) {
          window.alert($_("fetch.errorFetch", { values: __a }));
        } else {
          window.alert($_("fetch.errorUnhandled", { values: __a }));
        }
      }
    }
  };
  const handleSubmit = formSubmitHandler<Song>({
    fetchLatestSnapshot() {
      formData.playLinks = broadcastLinksHotTable!.getLatestData();
      formData.lyrics = lyricsHotTable!.getLatestData();
      formData.extLinks = extLinksHotTable!.getLatestData();
      return [$state.snapshot(ignoreErrors), formData];
    },
    generate(formData) {
      const output = generatePage(formData);
      ongenerate(output);
    },
    displayWarningsAndErrors(errors, warnings, autoloadCategories) {
      warningsElement!.updateState({ errors, warnings, autoloadCategories });
    },
  });
  const handleReset = formResetHandler(function () {
    warningsElement!.resetState();
  });
  const handleAutoloadCategories = () => {
    const categories = autoloadCategories(formData);
    formData.categoriesRaw = categories.join("\n");
  };
</script>

<form
  name="song-generator"
  class="mt-8 mb-4 grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={handleSubmit}
  onreset={handleReset}
>
  <FlexRow
    labelForHtmlId="vocadb-preload-url"
    labelI18nKey="songGenForm.preloadVocaDb.label"
    tooltipI18nKey="songGenForm.preloadVocaDb.tooltip"
  >
    <PreloadFromVocaDBInput
      onfetch={handleFetchVocaDb}
      placeholder="https://vocadb.net/S/..."
    />
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="gen-ai-warning"
    labelI18nKey="songGenForm.genAiWarning.label"
    tooltipI18nKey="songGenForm.genAiWarning.tooltip"
  >
    <div class="flex w-full flex-col gap-y-2">
      <div class="join w-full">
        <select
          id="gen-ai-warning"
          class="select select-bordered join-item sm:w-48"
          bind:value={formData.aiCwState}
        >
          {const genAiDropdownOptions = [
            { value: ENUM_AI_WARNING_TYPE.none, i18nKey: "none" },
            { value: ENUM_AI_WARNING_TYPE.verified, i18nKey: "verified" },
            { value: ENUM_AI_WARNING_TYPE.suspected, i18nKey: "suspected" },
          ]}
          {#each genAiDropdownOptions as { value, i18nKey }}
            <option {value}>
              {$_(`songGenForm.genAiWarning.dropdownOptions.${i18nKey}`)}
            </option>
          {/each}
        </select>
        <SimpleTextInput
          id="gen-ai-usage"
          class="input input-bordered join-item flex-1"
          placeholder={$_("songGenForm.genAiWarning.placeholder")}
          bind:value={formData.aiWarningText1}
        />
      </div>
      <div class="w-full">
        <SimpleTextInput
          id="gen-ai-source"
          disabled={formData.aiCwState === ENUM_AI_WARNING_TYPE.none}
          placeholder={$_("songGenForm.genAiWarning.sourcePlaceholder")}
          bind:value={formData.aiWarningText2}
        />
      </div>
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="content-warning"
    labelI18nKey="songGenForm.contentWarning.label"
    tooltipI18nKey="songGenForm.contentWarning.tooltip"
  >
    <div class="flex w-full flex-col gap-3">
      <div class="join flex-item w-full">
        <select
          id="content-warning"
          class="select select-bordered join-item sm:w-48"
          bind:value={formData.cwState}
        >
          {const genAiDropdownOptions = [
            { value: ENUM_CW_STATES.noWarnings, i18nKey: "none" },
            { value: ENUM_CW_STATES.questionable, i18nKey: "hasWarning" },
          ]}
          {#each genAiDropdownOptions as { value, i18nKey }}
            <option {value}>
              {$_(`songGenForm.contentWarning.dropdownOptions.${i18nKey}`)}
            </option>
          {/each}
        </select>
        <SimpleTextInput
          id="cw-text"
          class="input input-bordered join-item w-full flex-1"
          placeholder={$_("songGenForm.contentWarning.placeholder")}
          bind:value={formData.cwText}
        />
      </div>
      <div class="flex-item">
        <SimpleCheckbox
          id="has-epileptic-content"
          label={$_("songGenForm.contentWarning.epilepticWarningCheckboxLabel")}
          bind:checked={formData.hasEpilepsyWarning}
        />
      </div>
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="languages"
    labelI18nKey="songGenForm.songLanguage.label"
    tooltipI18nKey="songGenForm.songLanguage.tooltip"
    required={true}
  >
    <LanguageMultiSelect
      placeholder={$_("songGenForm.songLanguage.placeholder")}
      bind:selected={formData.languages}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="language-iso-code"
    labelI18nKey="songGenForm.languageIsoCode.label"
    tooltipI18nKey="songGenForm.languageIsoCode.tooltip"
    required={true}
  >
    <SimpleTextInput
      id="language-iso-code"
      class="input input-bordered w-full md:w-32"
      placeholder={$_("songGenForm.languageIsoCode.placeholder")}
      bind:value={formData.isoLangCode}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="original-title"
    labelI18nKey="songGenForm.originalTitle.label"
    tooltipI18nKey="songGenForm.originalTitle.tooltip"
    required={true}
  >
    <SimpleTextInput
      id="original-title"
      placeholder={$_("songGenForm.originalTitle.placeholder")}
      bind:value={formData.origTitle}
    />
  </FlexRow>

  {let mode = $derived(
    formData.altChIsTraditional
      ? $_("songGenForm.altChineseTitle.traditionalToggleOption")
      : $_("songGenForm.altChineseTitle.simplifiedToggleOption"),
  )}
  {let hideAltChRow = $derived(
    formData.languages.every(({ label }) => label !== "Mandarin" && label !== "Cantonese"),
  )}
  <FlexRow
    labelForHtmlId="alternative-chinese-title"
    labelI18nKey="songGenForm.altChineseTitle.label"
    labelI18nParams={{ mode }}
    tooltipI18nKey="songGenForm.altChineseTitle.tooltip"
    hidden={hideAltChRow}
  >
    {let altChPlaceholder = $derived(
      $_("songGenForm.altChineseTitle.placeholder", { values: { mode } }),
    )}
    <div class="join w-full">
      <SimpleTextInput
        id="alternative-chinese-title"
        class="input input-bordered join-item w-full flex-1"
        placeholder={altChPlaceholder}
        bind:value={formData.altChTitle}
      />
      <div
        class="join-item bg-neutral text-neutral-content flex flex-col justify-center border pr-2 pl-2"
      >
        <label class="swap">
          <input
            type="checkbox"
            bind:checked={formData.altChIsTraditional}
          />
          <div class="swap-on">
            <span
              lang="zh-Hans"
              class="cjk">繁⇔简</span
            >
          </div>
          <div class="swap-off">
            <span
              lang="zh-Hans"
              class="cjk">简⇔繁</span
            >
          </div>
        </label>
      </div>
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="romanized-title"
    labelI18nKey="songGenForm.romanizedTitle.label"
    tooltipI18nKey="songGenForm.romanizedTitle.tooltip"
  >
    <SimpleTextInput
      id="romanized-title"
      placeholder={$_("songGenForm.romanizedTitle.placeholder")}
      bind:value={formData.romTitle}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="english-title"
    labelI18nKey="songGenForm.englishTitle.label"
    tooltipI18nKey="songGenForm.englishTitle.tooltip"
  >
    <div class="join w-full">
      <SimpleTextInput
        id="english-title"
        placeholder={$_("songGenForm.englishTitle.placeholder")}
        bind:value={formData.engTitle}
      />
      <div class="join-item flex flex-col justify-center border-none pr-2 pl-2">
        <SimpleCheckbox
          id="is-official-translation"
          class="checkbox"
          textClass="text-xs"
          label={$_("songGenForm.englishTitle.isOfficialCheckboxLabel")}
          bind:checked={formData.titleIsOfficiallyTranslated}
        />
      </div>
    </div>
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="infobox-colors"
    labelI18nKey="infoboxColors.label"
    tooltipI18nKey="infoboxColors.tooltip"
    required={true}
  >
    <InfoboxColorInputField
      bind:backgroundColor={formData.bgColour}
      bind:color={formData.fgColour}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="upload-date"
    labelI18nKey="songGenForm.uploadDate.label"
    tooltipI18nKey="songGenForm.uploadDate.tooltip"
    required={true}
  >
    <SimpleDateInput
      id="upload-date"
      bind:value={formData.uploadDateRaw}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="singers"
    labelI18nKey="songGenForm.singers.label"
    tooltipI18nKey="songGenForm.singers.tooltip"
    required={true}
  >
    <SimpleTextFieldBox
      id="singers"
      bind:value={formData.singers}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="producers"
    labelI18nKey="songGenForm.producers.label"
    tooltipI18nKey="songGenForm.producers.tooltip"
    required={true}
  >
    <SimpleTextFieldBox
      id="producers"
      bind:value={formData.producers}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="description"
    labelI18nKey="songGenForm.description.label"
    tooltipI18nKey="songGenForm.description.tooltip"
  >
    <SimpleTextFieldBox
      id="description"
      bind:value={formData.description}
    />
  </FlexRow>

  <Divider />

  <FlexRow 
    labelForHtmlId="broadcast-links"
    labelI18nKey="songGenForm.broadcastLinks.label"
    tooltipI18nKey="songGenForm.broadcastLinks.tooltip"
    required={true}
  />

  <div class="col-span-full block">
    <BroadcastLinksTable 
      id="broadcast-links"
      class="w-full"
      data={formData.playLinks}
      bind:this={broadcastLinksHotTable}
    />
  </div>

  <div class="flex col-span-full flex-wrap px-4">
    <div class="basis-1/2">
      <SimpleCheckbox
        id="is-album-only"
        bind:checked={formData.isAlbumOnly}
        label={$_("songGenForm.broadcastLinks.isAlbumOnlyCheckboxLabel")}
      />
    </div>
    <div class="basis-1/2">
      <SimpleCheckbox
        id="is-unavailable"
        bind:checked={formData.isUnavailable}
        label={$_("songGenForm.broadcastLinks.isUnavailable")}
      />
    </div>
  </div>

  <Divider />

  <FlexRow 
    labelI18nKey="songGenForm.lyrics.label"
    tooltipI18nKey="songGenForm.lyrics.tooltip"
    required={true}
  />
  
  <LyricsTable id="lyrics" class="col-span-full" data={formData.lyrics} bind:languages={formData.languages} bind:this={lyricsHotTable} />

  <FlexRow
    labelForHtmlId="translator"
    labelI18nKey="songGenForm.translator.label"
    tooltipI18nKey="songGenForm.translator.tooltip"
  >
    <div class="flex-item flex-grow">
      <SimpleTextInput
        id="translator"
        placeholder="John Doe"
        bind:value={formData.translator}
      />
    </div>
    <div class="flex flex-row items-center gap-2">
      <SimpleCheckbox
        id="is-official-translation"
        bind:checked={formData.isOfficialTranslation}
        class="flex-item checkbox"
        textClass="text-xs"
        label={$_("songGenForm.translator.isOfficialCheckboxLabel")}
      />
      <div class="flex-item">
        <Tooltip>
          {@html $_("songGenForm.translator.isOfficialTooltip")}
        </Tooltip>
      </div>
    </div>
  </FlexRow>

  <Divider />

  <Glossary />

  <Divider />

  <FlexRow
    labelForHtmlId="external-links"
    labelI18nKey="songGenForm.externalLinks.label"
    tooltipI18nKey="songGenForm.externalLinks.tooltip"
  >
    <ExternalLinksTable id="external-links" class="w-full" data={formData.extLinks} bind:this={extLinksHotTable}/>
  </FlexRow>

  <FlexRow
    labelForHtmlId="categories"
    labelI18nKey="songGenForm.categories.label"
    tooltipI18nKey="songGenForm.categories.tooltip"
  >
    {#snippet showUnderLabel()}
      <AutoloadCategoriesButton onclick={handleAutoloadCategories} />
    {/snippet}
    <SimpleTextFieldBox
      id="categories"
      bind:value={formData.categoriesRaw}
    />
  </FlexRow>

  <Divider />

  <div class="flex items-start gap-2">
    <ResetFormButton />
  </div>
  <div class="flex w-full flex-col gap-3 sm:flex-row">
    <GenerateButton />
    <SimpleCheckbox
      id="ignore-errors"
      bind:checked={ignoreErrors}
      textClass="text-xs"
      label={$_("formActions.ignoreErrors")}
    />
  </div>
</form>

<Divider />

<ValidationResultsAlert bind:this={warningsElement} />