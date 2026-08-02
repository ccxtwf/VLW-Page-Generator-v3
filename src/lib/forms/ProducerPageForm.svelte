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
  import SimpleToggle from "../components/inputFields/SimpleToggle.svelte";
  import Tooltip from "../components/reusables/Tooltip.svelte";
  import ResetFormButton from "../components/buttons/ResetFormButton.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";
  import type { SvelteComponent } from "svelte";

  import {
    validate,
    generatePage,
    fetchDataFromVocaDb,
    fetchDiscographyFromVlw,
  } from "../logic/producers";

  import type { ProducerPageFormData } from "../../schemas/form";
  import { formSubmitHandler, formResetHandler } from "../logic";
  import type { ProducerPageValidationErrorType } from "../logic/enums";
  import {
    ExternalWebServiceError,
    VocaDBInvalidUrlError,
    VLWInvalidUrlError,
    GotZeroPagesInResponseError,
  } from "../logic/exceptions";
  import { createInitialData } from "../utils/utils";

  let formData: ProducerPageFormData = $state<ProducerPageFormData>({
    prodCategory: "",
    splitAlbum: false,
    prodAliases: "",
    affiliations: "",
    labels: "",
    languages: [],
    engines: [],
    description: "",
    roles: {
      composer: false,
      lyricist: false,
      tuner: false,
      illustrator: false,
      animator: false,
      arranger: false,
      instrumentalist: false,
      mixer: false,
      masterer: false,
    },
    songs: createInitialData({ page: "", additionalParameters: "" }, 5),
    albums: createInitialData({ page: "", additionalParameters: "", isCompilation: false }, 5),
    extLinks: createInitialData(
      {
        url: "",
        description: "",
        isOfficial: false,
        isMedia: false,
        isInactive: false,
      },
      5,
    ),
  });
  let ignoreErrors: boolean = $state(false);

  let warningsElement: SvelteComponent; // oxlint-disable-line no-unassigned-vars

  let { ongenerate }: { ongenerate: (output: string) => void } = $props();

  const handleFetchVocaDb = async (url: string) => {
    if (window.confirm($_("confirmClear"))) {
      const __a = { "1": "VocaDB" };
      try {
        const __fetched = await fetchDataFromVocaDb(url);
        formData = {
          ...formData,
          ...__fetched,
        };
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
  const handleSubmit = formSubmitHandler<ProducerPageFormData, ProducerPageValidationErrorType>({
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
  name="producer-generator"
  class="mt-8 mb-4 grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={handleSubmit}
  onreset={handleReset}
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
      <div class="join flex-item w-full">
        <SimpleTextInput
          id="producer-category"
          placeholder={$_("producerGenForm.mainProducerCategory.placeholder")}
          bind:value={formData.prodCategory}
        />
        <div class="join-item border-none">
          <button
            type="button"
            class="btn btn-neutral text-xs"
            onclick={handleDiscographyLoading}
          >
            {$_("producerGenForm.mainProducerCategory.fetchFromLiveWikiButtonText")}
          </button>
        </div>
      </div>
      <div class="flex-item w-full">
        <SimpleToggle
          label={$_("producerGenForm.mainProducerCategory.splitAlbumTableToggleText")}
          textClass="text-sm"
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
      id="romanized-title"
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

  <div class="col-span-full w-full">
    <h2 class="mb-6 text-xl font-bold">
      {$_("producerGenForm.externalLinks.label")}
      <Tooltip required={true}>
        {@html $_("producerGenForm.externalLinks.tooltip")}
      </Tooltip>
    </h2>
  </div>

  <ExternalLinksTable
    id="external-links"
    class="col-span-full w-full"
    bind:data={formData.extLinks}
    forProducerPage={true}
  />

  <Divider />

  <FlexRow
    labelForHtmlId="discography-songs"
    labelI18nKey="producerGenForm.discographySongs.label"
    tooltipI18nKey="producerGenForm.discographySongs.tooltip"
    required={true}
  >
    <ProducerDiscographyTable
      id="discography-songs"
      class="w-full"
      bind:data={formData.songs}
    />
  </FlexRow>

  <FlexRow
    labelForHtmlId="discography-albums"
    labelI18nKey="producerGenForm.discographyAlbums.label"
    tooltipI18nKey="producerGenForm.discographyAlbums.tooltip"
  >
    <div class="flex w-full flex-col gap-2">
      <ProducerDiscographyTable
        id="discography-albums"
        class="w-full"
        bind:data={formData.albums}
        forAlbums={true}
      />
      <div class="w-full text-xs">
        {@html $_("producerGenForm.discographyAlbums.fetchFromWikiNote")}
      </div>
    </div>
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