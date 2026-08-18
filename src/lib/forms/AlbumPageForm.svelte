<script lang="ts">
  import { _ } from "svelte-i18n";

  import FlexRow from "../components/reusables/FlexRow.svelte";
  import Divider from "../components/reusables/Divider.svelte";

  import PreloadFromVocaDBInput from "../components/reusables/PreloadFromVocaDBInput.svelte";
  import InfoboxColorInputField from "../components/inputFields/InfoboxColorInputField.svelte";
  import ValidationResultsAlert from "../components/reusables/ValidationResultsAlert.svelte";
  import Tracklist from "../components/handsontables/Tracklist.svelte";
  import AlbumOfficialLinksFieldCollection from "../components/inputFields/AlbumOfficialLinksFieldCollection.svelte";
  import ExternalLinksTable from "../components/handsontables/ExternalLinksTable.svelte";
  import SynthsMultiSelect from "../components/inputFields/SynthsMultiSelect.svelte";
  import SimpleTextInput from "../components/inputFields/SimpleTextInput.svelte";
  import SimpleTextFieldBox from "../components/inputFields/SimpleTextFieldBox.svelte";
  import SimpleCheckbox from "../components/inputFields/SimpleCheckbox.svelte";
  import AutoloadCategoriesButton from "../components/buttons/AutoloadCategoriesButton.svelte";
  import ResetFormButton from "../components/buttons/ResetFormButton.svelte";
  import ResetWarningsButton from "../components/buttons/ResetWarningsButton.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";
  import type { SvelteComponent } from "svelte";

  import { generatePage, autoloadCategories, fetchDataFromVocaDb } from "../logic/albums.svelte";

  import Album from "../models/Album.svelte";
  import { formSubmitHandler, resetFormWarnings } from "../logic";
  import { ExternalWebServiceError, VocaDBInvalidUrlError } from "../logic/exceptions";
  import { MONTHS } from "../../constants";

  let formData: Album = new Album();
  let ignoreErrors: boolean = $state(false);

  /* oxlint-disable no-unassigned-vars */
  let form: HTMLFormElement;
  let warningsElement: SvelteComponent;
  let tracklistHotTable: SvelteComponent;
  let extLinksHotTable: SvelteComponent;
  /* oxlint-enable no-unassigned-vars */

  let { ongenerate }: { ongenerate: (output: string, title: string) => void } = $props();

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
          window.alert($_("fetch.invalidVdb", { values: { "1": "Al/21149" } }));
        } else if (err instanceof ExternalWebServiceError) {
          window.alert($_("fetch.errorFetch", { values: __a }));
        } else {
          window.alert($_("fetch.errorUnhandled", { values: __a }));
        }
      }
    }
  };
  const handleFormSubmit = formSubmitHandler<Album>({
    fetchLatestSnapshot() {
      formData.tracklist = tracklistHotTable!.getLatestData();
      formData.extLinks = extLinksHotTable!.getLatestData();
      return [$state.snapshot(ignoreErrors), formData];
    },
    generate(formData) {
      const output = generatePage(formData);
      let title = formData.origTitle;
      if (formData.romTitle) {
        title += ` (${formData.romTitle})`;
      }
      ongenerate(output, title);
    },
    displayWarningsAndErrors(errors, warnings, autoloadCategories) {
      warningsElement!.updateState({ errors, warnings, autoloadCategories });
    },
  });
  const resetWarnings = () => {
    resetFormWarnings(form);
    warningsElement!.resetState();
  };
  const handleFormReset = () => {
    resetWarnings();
    formData.resetHotTables();
  };
  const handleAutoloadCategories = () => {
    const categories = autoloadCategories(formData);
    formData.categoriesRaw = categories.join("\n");
  };
</script>

<form
  name="album-generator"
  class="mt-8 mb-4 grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={handleFormSubmit}
  onreset={handleFormReset}
  bind:this={form}
>
  <FlexRow
    labelForHtmlId="vocadb-preload-url"
    labelI18nKey="albumGenForm.preloadVocaDb.label"
    tooltipI18nKey="albumGenForm.preloadVocaDb.tooltip"
  >
    <PreloadFromVocaDBInput
      onfetch={handleFetchVocaDb}
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
      <select
        class="select w-full"
        id="published-month"
        bind:value={formData.publishedMonth}
      >
        <option value="">
          {$_("albumGenForm.albumPublicationDate.monthPlaceholder")}
        </option>
        {#each MONTHS as month}
          <option value={month}>{month}</option>
        {/each}
      </select>
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

  <FlexRow
    labelForHtmlId="tracklist"
    labelI18nKey="albumGenForm.tracklist.label"
    tooltipI18nKey="albumGenForm.tracklist.tooltip"
    required={true}
  />

  <Tracklist
    id="tracklist"
    class="col-span-full w-full"
    data={formData.tracklist}
    bind:this={tracklistHotTable}
  />

  <Divider />

  <FlexRow
    labelForHtmlId="vocadb-album-id"
    labelI18nKey="albumGenForm.vdbAlbumPageId.label"
    tooltipI18nKey="albumGenForm.vdbAlbumPageId.tooltip"
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

  <Divider />

  <FlexRow
    labelForHtmlId="tracklist"
    labelI18nKey="albumGenForm.officialLinks.label"
    tooltipI18nKey="albumGenForm.officialLinks.tooltip"
  />

  <AlbumOfficialLinksFieldCollection bind:links={formData.broadcastLinks} />

  <Divider />

  <FlexRow
    labelForHtmlId="external-links"
    labelI18nKey="albumGenForm.externalLinks.label"
    tooltipI18nKey="albumGenForm.externalLinks.tooltip"
  >
    <div class="block w-full">
      <ExternalLinksTable
        id="external-links"
        class="w-full"
        data={formData.extLinks}
        bind:this={extLinksHotTable}
      />
    </div>
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="categories"
    labelI18nKey="albumGenForm.categories.label"
    tooltipI18nKey="albumGenForm.categories.tooltip"
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