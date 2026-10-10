<script lang="ts">
  import { _ } from "svelte-i18n";

  import {
    FlexRow,
    Divider,
    SimpleTextInput,
    SimpleTextFieldBox,
    SimpleCheckbox,
    ImageEmbed,
    InfoboxColorInputField,
    SynthsMultiSelect,
    AlbumOfficialLinksFieldCollection,
    ResetFormButton,
    ResetWarningsButton,
    GenerateButton,
    AutoloadCategoriesButton,
    ValidationResultsAlert,
    PreloadFromVocaDBInput,
  } from "../../components/reusables";
  import { Tracklist, ExternalLinksTable } from "../../components/handsontables";

  import type { SvelteComponent } from "svelte";

  import {
    generatePage,
    autoloadCategories,
    fetchDataFromVocaDb,
    validate,
  } from "../../logic/albums.svelte";

  import Album from "../../models/Album.svelte";
  import { formSubmitHandler, resetFormWarnings } from "../../logic";
  import { ExternalWebServiceError, VocaDBInvalidUrlError } from "../../logic/exceptions";
  import { MONTHS } from "../../../constants";
  import type { AlbumPageValidationErrorType } from "../../validationErrors/types";

  let formData: Album = new Album();
  let ignoreErrors: boolean = $state(false);

  let warningsElement: SvelteComponent | null = null;
  let tracklistHotTable: SvelteComponent | null = null;
  let extLinksHotTable: SvelteComponent | null = null;

  let { ongenerate }: { ongenerate: (output: string, title: string) => void } = $props();

  const resetWarnings = () => {
    resetFormWarnings(document.querySelector('form[name="album-generator"]')!);
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
          window.alert($_("fetch.invalidVdb", { values: { "1": "Al/21149" } }));
        } else if (err instanceof ExternalWebServiceError) {
          window.alert($_("fetch.errorFetch", { values: __a }));
        } else {
          window.alert($_("fetch.errorUnhandled", { values: __a }));
        }
      }
    }
  };
  const handleFormSubmit = formSubmitHandler<Album, AlbumPageValidationErrorType>({
    resetWarnings,
    fetchLatestSnapshot() {
      formData.tracklist = tracklistHotTable!.getLatestData();
      formData.extLinks = extLinksHotTable!.getLatestData();
      return [$state.snapshot(ignoreErrors), formData];
    },
    validate,
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
      image: null,
      engines: [],
    });
    formData.resetHotTables();
  };
  const handleAutoloadCategories = () => {
    formData.tracklist = tracklistHotTable!.getLatestData();
    const categories = autoloadCategories(formData);
    formData.categoriesRaw = categories.join("\n");
  };
</script>

<form
  name="album-generator"
  class="mt-8 mb-4 grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={handleFormSubmit}
  onreset={handleFormReset}
>
  <FlexRow
    labelForHtmlId="vocadb-preload-url"
    labelI18nKey="preloadVocaDb.label"
    labelI18nParams={{
      type: $_("albumGenForm.vdbPageType"),
    }}
    tooltipI18nKey="preloadVocaDb.tooltip"
    tooltipI18nParams={{
      type: $_("albumGenForm.vdbPageType"),
      slug: "Al/21149",
      caption: $_("albumGenForm.vdbPlaceholder"),
    }}
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
    required
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
    <SimpleTextInput
      id="english-title"
      placeholder={$_("albumGenForm.englishTitle.placeholder")}
      bind:value={formData.engTitle}
    />
  </FlexRow>

  <Divider />

  {#if formData.image}
    <div class="col-span-full m-auto">
      <ImageEmbed {...formData.image} />
    </div>

    <Divider />
  {/if}

  <FlexRow
    labelForHtmlId="infobox-colors"
    labelI18nKey="infoboxColors.label"
    tooltipI18nKey="infoboxColors.tooltip"
    required
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
    <SimpleTextInput
      id="album-label"
      placeholder={$_("albumGenForm.label.placeholder")}
      bind:value={formData.label}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="description"
    labelI18nKey="albumGenForm.description.label"
    tooltipI18nKey="albumGenForm.description.tooltip"
    required
    column
  >
    <SimpleTextInput
      id="description"
      placeholder={$_("albumGenForm.description.placeholder")}
      bind:value={formData.description}
    />
    <div>
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
    required
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
    required
  >
    <SynthsMultiSelect
      placeholder={$_("albumGenForm.synths.placeholder")}
      bind:selected={formData.engines}
    />
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="tracklist"
    labelI18nKey="albumGenForm.tracklist.label"
    tooltipI18nKey="albumGenForm.tracklist.tooltip"
    required
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
    <SimpleTextInput
      id="vocadb-album-id"
      placeholder={$_("albumGenForm.vdbAlbumPageId.placeholder")}
      bind:value={formData.vdbAlbumId}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="vocaloid-wiki-page"
    labelI18nKey="albumGenForm.vocaloidWikiPage.label"
    tooltipI18nKey="albumGenForm.vocaloidWikiPage.tooltip"
  >
    <SimpleTextInput
      id="vocaloid-wiki-page"
      placeholder={$_("albumGenForm.vocaloidWikiPage.placeholder")}
      bind:value={formData.vocaWikiPage}
    />
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