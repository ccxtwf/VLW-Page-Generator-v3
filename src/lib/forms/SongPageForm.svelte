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
  import ImageEmbed from "../components/reusables/ImageEmbed.svelte";
  import AutoloadCategoriesButton from "../components/buttons/AutoloadCategoriesButton.svelte";
  import ResetFormButton from "../components/buttons/ResetFormButton.svelte";
  import ResetWarningsButton from "../components/buttons/ResetWarningsButton.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";
  import type { SvelteComponent } from "svelte";

  import { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES, ENUM_SONG_TYPE } from "../models/enums";

  import {
    generatePage,
    autoloadCategories,
    fetchDataFromVocaDb,
    validate,
  } from "../logic/songs.svelte";

  import Song from "../models/Song.svelte";
  import { formSubmitHandler, resetFormWarnings } from "../logic";
  import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../config";
  import { ExternalWebServiceError, VocaDBInvalidUrlError } from "../logic/exceptions";

  import { resetRadioInputGroup } from "../utils/utils";
  import { getLanguageMetadata } from "../utils/lyricsUtils";
  import SimpleRadioGroup from "../components/inputFields/SimpleRadioGroup.svelte";
  import type { SongPageValidationErrorType } from "../validationErrors/types";

  let formData: Song = new Song();
  let ignoreErrors: boolean = $state(false);

  let warningsElement: SvelteComponent | null = null;
  let broadcastLinksHotTable: SvelteComponent | null = null;
  let extLinksHotTable: SvelteComponent | null = null;
  let lyricsHotTable: SvelteComponent | null = null;

  let languageMetadata = $derived(getLanguageMetadata(formData.languages));

  let { ongenerate }: { ongenerate: (output: string, title: string) => void } = $props();

  const resetWarnings = () => {
    resetFormWarnings(document.querySelector('form[name="song-generator"]')!);
    warningsElement!.resetState();
  };

  const handleFetchVocaDb = async (url: string) => {
    if (window.confirm($_("confirmClear"))) {
      resetWarnings();
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
  const handleFormSubmit = formSubmitHandler<Song, SongPageValidationErrorType>({
    resetWarnings,
    validate,
    fetchLatestSnapshot() {
      formData.playLinks = broadcastLinksHotTable!.getLatestData();
      formData.lyrics = lyricsHotTable!.getLatestData();
      formData.extLinks = extLinksHotTable!.getLatestData();
      return [$state.snapshot(ignoreErrors), formData];
    },
    generate(formData) {
      const [output, title] = generatePage(formData);
      ongenerate(output, title);
    },
    displayWarningsAndErrors(errors, warnings, autoloadCategories) {
      warningsElement!.updateState({ errors, warnings, autoloadCategories });
    },
  });
  const handleFormReset = () => {
    resetWarnings();
    formData.updateState({
      altChIsTraditional: true,
      songType: ENUM_SONG_TYPE.original,
      images: [],
      languages: [],
    });
    setTimeout(() => {
      resetRadioInputGroup("song-page-type", ENUM_SONG_TYPE.original);
    }, 0);
    formData.resetHotTables();
  };
  const handleAutoloadCategories = () => {
    const categories = autoloadCategories(formData);
    formData.categoriesRaw = categories.join("\n");
  };
</script>

<form
  name="song-generator"
  class="mt-8 mb-4 grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={handleFormSubmit}
  onreset={handleFormReset}
>
  <FlexRow
    labelForHtmlId="vocadb-preload-url"
    labelI18nKey="preloadVocaDb.label"
    tooltipI18nKey="preloadVocaDb.tooltip"
    tooltipI18nParams={{
      type: "song page",
      slug: "S/1501",
      caption: $_("songGenForm.vdbPlaceholder"),
    }}
  >
    <PreloadFromVocaDBInput
      onfetch={handleFetchVocaDb}
      placeholder="https://vocadb.net/S/..."
    />
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="song-page-type"
    labelI18nKey="songGenForm.songTypes.label"
    tooltipI18nKey="songGenForm.songTypes.tooltip"
    tooltipI18nParams={{ domain: VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT }}
  >
    <SimpleRadioGroup
      class="col-span-full px-2 py-3 text-xs sm:text-base"
      labelClass="w-full sm:basis-1/3"
      id="song-page-type"
      name="song-page-type"
      options={[
        { label: $_("songGenForm.songTypes.original"), value: ENUM_SONG_TYPE.original },
        { label: $_("songGenForm.songTypes.cover"), value: ENUM_SONG_TYPE.cover },
        { label: $_("songGenForm.songTypes.spinoff"), value: ENUM_SONG_TYPE.spinOff },
      ]}
      bind:selected={formData.songType}
    />
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="gen-ai-warning"
    labelI18nKey="songGenForm.genAiWarning.label"
    tooltipI18nKey="songGenForm.genAiWarning.tooltip"
  >
    <div class="flex w-full flex-col gap-y-2">
      <div class="sm:join block w-full">
        <select
          id="gen-ai-warning"
          class="select select-bordered sm:join-item w-full sm:w-48"
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
          class="input input-bordered sm:join-item w-full flex-1"
          disabled={formData.aiCwState === ENUM_AI_WARNING_TYPE.none}
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
      <div class="sm:join flex-item block w-full">
        <select
          id="content-warning"
          class="select select-bordered sm:join-item w-full sm:w-48"
          bind:value={formData.cwState}
        >
          {const genAiDropdownOptions = [
            { value: ENUM_CW_STATES.noWarnings, i18nKey: "none" },
            { value: ENUM_CW_STATES.questionable, i18nKey: "hasWarning" },
            { value: ENUM_CW_STATES.isNsfw, i18nKey: "nsfw" },
          ]}
          {#each genAiDropdownOptions as { value, i18nKey }}
            <option {value}>
              {$_(`songGenForm.contentWarning.dropdownOptions.${i18nKey}`)}
            </option>
          {/each}
        </select>
        <SimpleTextInput
          id="cw-text"
          class="input input-bordered sm:join-item w-full flex-1"
          disabled={formData.cwState === ENUM_CW_STATES.noWarnings}
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
  >
    <SimpleTextInput
      id="language-iso-code"
      class="input input-bordered w-full md:w-32"
      placeholder={$_("songGenForm.languageIsoCode.placeholder")}
      autocomplete="language"
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
  <FlexRow
    labelForHtmlId="alternative-chinese-title"
    labelI18nKey="songGenForm.altChineseTitle.label"
    labelI18nParams={{ mode }}
    tooltipI18nKey="songGenForm.altChineseTitle.tooltip"
    hidden={!languageMetadata.isChinese}
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
        class="join-item bg-neutral text-neutral-content flex flex-col justify-center border-none pr-2 pl-2"
      >
        <label class="swap">
          <input
            type="checkbox"
            bind:checked={formData.altChIsTraditional}
            onkeydown={(e) => {
              if (e.key === "Enter") {
                formData.altChIsTraditional = !formData.altChIsTraditional;
                e.preventDefault();
              }
            }}
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
    hidden={!languageMetadata.needsRomanization}
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
    hidden={!languageMetadata.needsTranslation}
  >
    <div class="sm:join block w-full">
      <SimpleTextInput
        id="english-title"
        placeholder={$_("songGenForm.englishTitle.placeholder")}
        bind:value={formData.engTitle}
      />
      <div class="sm:join-item block px-2 py-4 sm:py-2 [&]:border-none">
        <SimpleCheckbox
          id="is-official-translation"
          textClass="text-xs"
          label={$_("songGenForm.englishTitle.isOfficialCheckboxLabel")}
          bind:checked={formData.titleIsOfficiallyTranslated}
        />
      </div>
    </div>
  </FlexRow>

  <Divider />

  {#if formData.images.length}
    <div class="col-span-full flex flex-wrap items-center justify-center gap-3">
      {#each formData.images as image}
        <ImageEmbed {...image} />
      {/each}
    </div>

    <Divider />
  {/if}

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
    tooltipI18nParams={{ domain: VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT }}
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

  <div class="col-span-full flex flex-wrap gap-y-3 px-4 text-xs sm:text-base">
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
    <div class="basis-1/2">
      <SimpleCheckbox
        id="is-demonstration"
        bind:checked={formData.isDemonstration}
        label={$_("songGenForm.broadcastLinks.isDemonstration")}
      />
    </div>
  </div>

  <Divider />

  <FlexRow
    labelI18nKey="songGenForm.lyrics.label"
    tooltipI18nKey="songGenForm.lyrics.tooltip"
    required={true}
  />
  {let lyricsDataNorm = $derived(
    formData.lyrics.map(({ customStyle, original, romanized, english }) => [
      customStyle,
      original,
      romanized,
      english,
    ]),
  )}
  <LyricsTable
    id="lyrics"
    class="col-span-full"
    data={lyricsDataNorm}
    bind:languageMetadata
    bind:this={lyricsHotTable}
  />

  <FlexRow
    labelForHtmlId="translator"
    labelI18nKey="songGenForm.translator.label"
    tooltipI18nKey="songGenForm.translator.tooltip"
  >
    <div class="flex-item flex-grow">
      <SimpleTextInput
        id="translator"
        placeholder="John Doe"
        autocomplete="on"
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
        <Tooltip inline>
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
    labelI18nKey="externalLinks.label"
    tooltipI18nKey="externalLinks.tooltip"
  >
    <ExternalLinksTable
      id="external-links"
      class="w-full"
      data={formData.extLinks}
      bind:this={extLinksHotTable}
    />
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
    <ResetWarningsButton onclick={resetWarnings} />
  </div>
  <div class="flex w-full flex-col gap-3 sm:flex-row">
    <GenerateButton />
    <SimpleCheckbox
      id="ignore-errors"
      bind:checked={ignoreErrors}
      textClass="text-xs"
      label={$_("formActions.ignoreErrors")}
    />
    <ResetFormButton />
  </div>
</form>

<Divider />

<ValidationResultsAlert bind:this={warningsElement} />