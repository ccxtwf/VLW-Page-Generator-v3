<script lang="ts">
  import { _ } from "svelte-i18n";

  import FlexRow from "../components/reusables/FlexRow.svelte";
  import Divider from "../components/reusables/Divider.svelte";

  import PreloadFromVocaDBInput from "../components/reusables/PreloadFromVocaDBInput.svelte";
  import SynthsMultiSelect from "../components/inputFields/SynthsMultiSelect.svelte";
  import LanguageMultiSelect from "../components/inputFields/LanguageMultiSelect.svelte";
  import ValidationResultsAlert from "../components/reusables/ValidationResultsAlert.svelte";
  import ProducerRoleCheckboxes from "../components/inputFields/ProducerRoleCheckboxes.svelte";
  import ProducerDiscographyTable from "../components/handsontables/ProducerDiscographyTable.svelte";
  import ExternalLinksTable from "../components/handsontables/ExternalLinksTable.svelte";
  import SimpleTextInput from "../components/inputFields/SimpleTextInput.svelte";
  import SimpleTextFieldBox from "../components/inputFields/SimpleTextFieldBox.svelte";
  import SimpleCheckbox from "../components/inputFields/SimpleCheckbox.svelte";
  import ResetFormButton from "../components/buttons/ResetFormButton.svelte";
  import ResetWarningsButton from "../components/buttons/ResetWarningsButton.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";
  import type { SvelteComponent } from "svelte";

  import {
    generatePage,
    fetchDataFromVocaDb,
    fetchDiscographyFromVlw,
  } from "../logic/producers.svelte";

  import Producer from "../models/Producer.svelte";
  import { formSubmitHandler, resetFormWarnings } from "../logic";
  import {
    ExternalWebServiceError,
    VocaDBInvalidUrlError,
    VLWInvalidUrlError,
    GotZeroPagesInResponseError,
  } from "../logic/exceptions";

  let formData = new Producer();
  let ignoreErrors: boolean = $state(false);

  let form: HTMLFormElement;
  let warningsElement: SvelteComponent | undefined = $state();
  let extLintsHotTable: SvelteComponent | undefined = $state();
  let songListHotTable: SvelteComponent | undefined = $state();
  let albumListHotTable: SvelteComponent | undefined = $state();

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
          window.alert($_("fetch.invalidVdb", { values: { "1": "Ar/28" } }));
        } else if (err instanceof ExternalWebServiceError) {
          window.alert($_("fetch.errorFetch", { values: __a }));
        } else {
          window.alert($_("fetch.errorUnhandled", { values: __a }));
        }
      }
    }
  };
  const handleDiscographyLoading = async () => {
    if (window.confirm($_("confirmClearDiscog"))) {
      const __a = { "1": "Vocaloid Lyrics Wiki" };
      try {
        const { songs, albums, recommendToSplitAlbum } = await fetchDiscographyFromVlw(
          formData.prodCategory || "",
        );
        formData.songs = songs;
        formData.albums = albums;
        formData.splitAlbum = recommendToSplitAlbum;
        window.alert($_("fetch.success", { values: __a }));
      } catch (err) {
        console.error(err);
        if (err instanceof VLWInvalidUrlError) {
          window.alert($_("fetch.invalidVlw"));
        } else if (err instanceof GotZeroPagesInResponseError) {
          window.alert($_("fetch.emptyResponseVlw"));
        } else if (err instanceof ExternalWebServiceError) {
          window.alert($_("fetch.errorFetch", { values: __a }));
        } else {
          window.alert($_("fetch.errorUnhandled", { values: __a }));
        }
      }
    }
  };
  const handleFormSubmit = formSubmitHandler<Producer>({
    fetchLatestSnapshot() {
      formData.extLinks = extLintsHotTable!.getLatestData();
      formData.songs = songListHotTable!.getLatestData();
      formData.albums = albumListHotTable!.getLatestData();
      return [$state.snapshot(ignoreErrors), formData];
    },
    generate(formData) {
      const output = generatePage(formData);
      const title = formData.prodCategory;
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
</script>

<form
  name="producer-generator"
  class="mt-8 mb-4 grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={handleFormSubmit}
  onreset={handleFormReset}
  bind:this={form}
>
  <FlexRow
    labelForHtmlId="vocadb-preload-url"
    labelI18nKey="producerGenForm.preloadVocaDb.label"
    tooltipI18nKey="producerGenForm.preloadVocaDb.tooltip"
  >
    <PreloadFromVocaDBInput
      onfetch={handleFetchVocaDb}
      placeholder="https://vocadb.net/Ar/..."
    />
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="producer-category"
    labelI18nKey="producerGenForm.mainProducerCategory.label"
    tooltipI18nKey="producerGenForm.mainProducerCategory.tooltip"
    required={true}
  >
    <div class="flex w-full flex-col gap-2">
      <div class="sm:join flex-item block w-full">
        <SimpleTextInput
          id="producer-category"
          placeholder={$_("producerGenForm.mainProducerCategory.placeholder")}
          bind:value={formData.prodCategory}
          onkeydown={function (e) {
            e.preventDefault();
            if (e.key === "Enter") {
              document.getElementById("fetch-vlw-button")?.click();
            }
          }}
        />
        <div class="sm:join-item block [&]:border-none">
          <button
            id="fetch-vlw-button"
            type="button"
            class="btn btn-neutral w-full text-xs sm:w-48"
            onclick={handleDiscographyLoading}
          >
            {$_("producerGenForm.mainProducerCategory.fetchFromLiveWikiButtonText")}
          </button>
        </div>
      </div>
      <div class="flex-item w-full">
        <SimpleCheckbox
          label={$_("producerGenForm.mainProducerCategory.splitAlbumTableToggleText")}
          textClass="text-sm"
          isToggle={true}
          bind:checked={formData.splitAlbum}
        />
      </div>
    </div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="producer-aliases"
    labelI18nKey="producerGenForm.producerMiscAlias.label"
    tooltipI18nKey="producerGenForm.producerMiscAlias.tooltip"
  >
    <SimpleTextInput
      id="producer-aliases"
      placeholder={$_("producerGenForm.producerMiscAlias.placeholder")}
      bind:value={formData.prodAliases}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="affiliations"
    labelI18nKey="producerGenForm.affiliations.label"
    tooltipI18nKey="producerGenForm.affiliations.tooltip"
  >
    <SimpleTextFieldBox
      id="affiliations"
      rows={3}
      bind:value={formData.affiliations}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="labels"
    labelI18nKey="producerGenForm.labels.label"
    tooltipI18nKey="producerGenForm.labels.tooltip"
  >
    <SimpleTextFieldBox
      id="labels"
      rows={3}
      bind:value={formData.labels}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="languages"
    labelI18nKey="producerGenForm.languages.label"
    tooltipI18nKey="producerGenForm.languages.tooltip"
  >
    <LanguageMultiSelect
      placeholder={$_("producerGenForm.languages.placeholder")}
      bind:selected={formData.languages}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="synths"
    labelI18nKey="producerGenForm.usesSynths.label"
    tooltipI18nKey="producerGenForm.usesSynths.tooltip"
  >
    <SynthsMultiSelect
      placeholder={$_("producerGenForm.usesSynths.placeholder")}
      bind:selected={formData.engines}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="producer-roles"
    labelI18nKey="producerGenForm.producerRoles.label"
    tooltipI18nKey="producerGenForm.producerRoles.tooltip"
  >
    <ProducerRoleCheckboxes bind:value={formData.roles} />
  </FlexRow>

  <FlexRow
    labelForHtmlId="description"
    labelI18nKey="producerGenForm.description.label"
    tooltipI18nKey="producerGenForm.description.tooltip"
  >
    <SimpleTextFieldBox
      id="description"
      rows={3}
      bind:value={formData.description}
    />
  </FlexRow>

  <Divider />

  <FlexRow
    labelForHtmlId="external-links"
    labelI18nKey="producerGenForm.externalLinks.label"
    tooltipI18nKey="producerGenForm.externalLinks.tooltip"
    required={true}
  />

  <ExternalLinksTable
    id="external-links"
    class="col-span-full w-full"
    data={formData.extLinks}
    bind:this={extLintsHotTable}
    forProducerPage={true}
  />

  <Divider />

  <FlexRow
    labelForHtmlId="discography-songs"
    labelI18nKey="producerGenForm.discographySongs.label"
    tooltipI18nKey="producerGenForm.discographySongs.tooltip"
    required={true}
  />
  <ProducerDiscographyTable
    id="discography-songs"
    class="col-span-full"
    data={formData.songs}
    bind:this={songListHotTable}
  />

  <FlexRow
    labelForHtmlId="discography-albums"
    labelI18nKey="producerGenForm.discographyAlbums.label"
    tooltipI18nKey="producerGenForm.discographyAlbums.tooltip"
  />
  <div class="col-span-full flex flex-col gap-2">
    <ProducerDiscographyTable
      id="discography-albums"
      class="w-full"
      data={formData.albums}
      bind:this={albumListHotTable}
      forAlbums={true}
    />
    <div class="w-full text-xs">
      {@html $_("producerGenForm.discographyAlbums.fetchFromWikiNote")}
    </div>
  </div>

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