<script lang="ts">
  import { _ } from "svelte-i18n";

  import FlexRow from "../components/reusables/FlexRow.svelte";
  import Divider from "../components/reusables/Divider.svelte";

  import PreloadFromVocaDBInput from "../components/reusables/PreloadFromVocaDBInput.svelte";
  import InfoboxColorInputField from "../components/inputFields/InfoboxColorInputField.svelte";
  import SynthsMultiSelect from "../components/inputFields/SynthsMultiSelect.svelte";
  import SimpleTextInput from "../components/inputFields/SimpleTextInput.svelte";
  import SimpleTextFieldBox from "../components/inputFields/SimpleTextFieldBox.svelte";
  import SimpleCheckbox from "../components/inputFields/SimpleCheckbox.svelte";
  import Tooltip from "../components/reusables/Tooltip.svelte";
  import AutoloadCategoriesButton from "../components/buttons/AutoloadCategoriesButton.svelte";
  import ResetFormButton from "../components/buttons/ResetFormButton.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";
  import type { SvelteComponent } from "svelte";

  import { validate, generatePage } from "../logic/albums";

  import type { AlbumPageFormData } from "../../schemas/form";
  import { formSubmitHandler, formResetHandler } from "../logic";
  import type { AlbumPageValidationErrorType } from "../logic/enums";
  import ValidationResultsAlert from "../components/reusables/ValidationResultsAlert.svelte";

  let formData: AlbumPageFormData = $state<AlbumPageFormData>({
    origTitle: "",
    romTitle: "",
    engTitle: "",
    bgColour: "black",
    fgColour: "white",
    label: "",
    description: "",
    isCompilationAlbum: false,
    publishedYear: "",
    publishedMonth: "",
    publishedDay: "",
    engines: [],
    vdbAlbumId: "",
    vocaWikiPage: "",
    categoriesRaw: "",
  });
  let ignoreErrors: boolean = $state(false);

  let warningsElement: SvelteComponent; // oxlint-disable-line no-unassigned-vars

  let { ongenerate }: { ongenerate: (output: string) => void } = $props();

  const handleSubmit = formSubmitHandler<AlbumPageFormData, AlbumPageValidationErrorType>({
    fetchLatestSnapshot() {
      return [$state.snapshot(ignoreErrors), $state.snapshot(formData)];
    },
    validate,
    generate(formData) {
      const output = generatePage(formData);
      ongenerate(output);
    },
    displayWarningsAndErrors(errors, warnings, autoloadCategories) {
      warningsElement.updateState({ errors, warnings, autoloadCategories });
    },
  });
  const handleReset = formResetHandler(function () {
    warningsElement.resetState();
  });
</script>

<form
  name="album-generator"
  class="mt-8 mb-4 grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={handleSubmit}
  onreset={handleReset}
>
  <FlexRow
    labelForHtmlId="vocadb-preload-url"
    labelI18nKey="albumGenForm.preloadVocaDb.label"
    tooltipI18nKey="albumGenForm.preloadVocaDb.tooltip"
  >
    <PreloadFromVocaDBInput
      handleFetch={() => {
        console.log(formData);
      }}
      placeholder="https://vocadb.net/Al/..."
    />
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="original-title"
    labelI18nKey="albumGenForm.originalTitle.label"
    tooltipI18nKey="albumGenForm.originalTitle.tooltip"
    required={true}
  >
    <SimpleTextInput
      id="original-title"
      placeholder={$_("albumGenForm.originalTitle.placeholder")}
      bind:value={formData.origTitle}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="romanized-title"
    labelI18nKey="albumGenForm.romanizedTitle.label"
    tooltipI18nKey="albumGenForm.romanizedTitle.tooltip"
  >
    <SimpleTextInput
      id="romanized-title"
      placeholder={$_("albumGenForm.romanizedTitle.placeholder")}
      bind:value={formData.romTitle}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="english-title"
    labelI18nKey="albumGenForm.englishTitle.label"
    tooltipI18nKey="albumGenForm.englishTitle.tooltip"
  >
    <div class="join w-full">
      <SimpleTextInput
        id="english-title"
        placeholder={$_("albumGenForm.englishTitle.placeholder")}
        bind:value={formData.engTitle}
      />
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
    labelForHtmlId="album-label"
    labelI18nKey="albumGenForm.label.label"
    tooltipI18nKey="albumGenForm.label.tooltip"
  >
    <div class="join w-full">
      <SimpleTextInput
        id="album-label"
        placeholder={$_("albumGenForm.label.placeholder")}
        bind:value={formData.label}
      />
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="description"
    labelI18nKey="albumGenForm.description.label"
    tooltipI18nKey="albumGenForm.description.tooltip"
    required={true}
  >
    <div class="flex w-full flex-col gap-2">
      <SimpleTextInput
        id="description"
        placeholder={$_("albumGenForm.description.placeholder")}
        bind:value={formData.description}
      />
      <SimpleCheckbox
        id="is-compilation-album"
        label={$_("albumGenForm.description.isCompilationCheckboxLabel")}
        textClass="text-sm"
        bind:checked={formData.isCompilationAlbum}
      />
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="published-year"
    labelI18nKey="albumGenForm.albumPublicationDate.label"
    tooltipI18nKey="albumGenForm.albumPublicationDate.tooltip"
    required={true}
  >
    <div class="flex w-full gap-x-8 gap-y-2 max-sm:flex-col md:flex-row">
      <SimpleTextInput
        id="published-year"
        placeholder={$_("albumGenForm.albumPublicationDate.yearPlaceholder")}
        bind:value={formData.publishedYear}
      />
      <SimpleTextInput
        id="published-month"
        placeholder={$_("albumGenForm.albumPublicationDate.monthPlaceholder")}
        bind:value={formData.publishedMonth}
      />
      <SimpleTextInput
        id="published-day"
        placeholder={$_("albumGenForm.albumPublicationDate.dayPlaceholder")}
        bind:value={formData.publishedDay}
      />
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="synths"
    labelI18nKey="albumGenForm.synths.label"
    tooltipI18nKey="albumGenForm.synths.tooltip"
    required={true}
  >
    <div class="join w-full">
      <SynthsMultiSelect
        placeholder={$_("albumGenForm.synths.placeholder")}
        bind:selected={formData.engines}
      />
    </div>
  </FlexRow>

  <Divider />

  <div class="col-span-full w-full">
    <h2 class="mb-6 text-xl font-bold">
      {$_("albumGenForm.tracklist.label")}
      <Tooltip required={true}>
        {@html $_("albumGenForm.tracklist.tooltip")}
      </Tooltip>
    </h2>
  </div>

  <div
    id="tracklist"
    class="col-span-full h-32 w-full"
  ></div>

  <Divider />

  <FlexRow
    labelForHtmlId="vocadb-album-id"
    labelI18nKey="albumGenForm.vdbAlbumPageId.label"
    tooltipI18nKey="albumGenForm.vdbAlbumPageId.tooltip"
    required={true}
  >
    <div class="join w-full">
      <SimpleTextInput
        id="vocadb-album-id"
        placeholder={$_("albumGenForm.vdbAlbumPageId.placeholder")}
        bind:value={formData.vdbAlbumId}
      />
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="vocaloid-wiki-page"
    labelI18nKey="albumGenForm.vocaloidWikiPage.label"
    tooltipI18nKey="albumGenForm.vocaloidWikiPage.tooltip"
  >
    <div class="join w-full">
      <SimpleTextInput
        id="vocaloid-wiki-page"
        placeholder={$_("albumGenForm.vocaloidWikiPage.placeholder")}
        bind:value={formData.vocaWikiPage}
      />
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="official-links"
    labelI18nKey="albumGenForm.officialLinks.label"
    tooltipI18nKey="albumGenForm.officialLinks.tooltip"
  >
    <div class="block h-32 w-full">
      <div
        id="official-links"
        class="w-full"
      ></div>
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="external-links"
    labelI18nKey="albumGenForm.externalLinks.label"
    tooltipI18nKey="albumGenForm.externalLinks.tooltip"
  >
    <div class="block h-32 w-full">
      <div
        id="external-links"
        class="w-full"
      ></div>
    </div>
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="categories"
    labelI18nKey="albumGenForm.categories.label"
    tooltipI18nKey="albumGenForm.categories.tooltip"
  >
    {#snippet showUnderLabel()}
      <AutoloadCategoriesButton onclick={() => {}} />
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