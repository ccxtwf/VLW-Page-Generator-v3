<script lang="ts">
  import { _ } from "svelte-i18n";

  import FlexRow from "../components/reusables/FlexRow.svelte";
  import Divider from "../components/reusables/Divider.svelte";

  import PreloadFromVocaDBInput from "../components/reusables/PreloadFromVocaDBInput.svelte";
  import SimpleTextInput from "../components/inputFields/SimpleTextInput.svelte";
  import SimpleTextFieldBox from "../components/inputFields/SimpleTextFieldBox.svelte";
  import SimpleCheckbox from "../components/inputFields/SimpleCheckbox.svelte";
  import ResetFormButton from "../components/buttons/ResetFormButton.svelte";
  import GenerateButton from "../components/buttons/GenerateButton.svelte";

  import type { ProducerPageFormData } from "../../schemas/form";
  import Tooltip from "../components/reusables/Tooltip.svelte";
  import SynthsMultiSelect from "../components/inputFields/SynthsMultiSelect.svelte";
  import LanguageMultiSelect from "../components/inputFields/LanguageMultiSelect.svelte";
  import SimpleToggle from "../components/inputFields/SimpleToggle.svelte";

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
  });
  let ignoreErrors: boolean = $state(false);
</script>

<form
  name="producer-generator"
  class="grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-[200px_1fr]"
  onsubmit={(e) => e.preventDefault()}
>
  <FlexRow
    labelForHtmlId="vocadb-preload-url"
    labelI18nKey="producerGenForm.preloadVocaDb.label"
    tooltipI18nKey="producerGenForm.preloadVocaDb.tooltip"
  >
    <PreloadFromVocaDBInput
      handleFetch={() => {
        console.log(formData);
      }}
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
        <div class="join-item border-gray-600">
          <button
            type="button"
            class="btn btn-neutral"
            onclick={() => {}}
          >
            {$_("producerGenForm.mainProducerCategory.fetchFromLiveWikiButtonText")}
          </button>
        </div>
      </div>
      <div class="flex-item w-full">
        <SimpleToggle
          label={$_("producerGenForm.mainProducerCategory.splitAlbumTableToggleText")}
          textClass="label-text text-gray-200 text-sm"
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
    <div></div>
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
    <h2 class="mb-6 text-xl font-bold text-white">
      {$_("producerGenForm.externalLinks.label")}
      <Tooltip required={true}>
        {@html $_("producerGenForm.externalLinks.tooltip")}
      </Tooltip>
    </h2>
  </div>

  <Divider />

  <FlexRow
    labelForHtmlId="discography-songs"
    labelI18nKey="producerGenForm.discographySongs.label"
    tooltipI18nKey="producerGenForm.discographySongs.tooltip"
    required={true}
  >
    <div></div>
  </FlexRow>

  <FlexRow
    labelForHtmlId="discography-albums"
    labelI18nKey="producerGenForm.discographyAlbums.label"
    tooltipI18nKey="producerGenForm.discographyAlbums.tooltip"
  >
    <div class="flex w-full flex-col gap-2">
      <div class="w-full"></div>
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
      checked={ignoreErrors}
      textClass="label-text text-gray-200 text-xs"
      label={$_("formActions.ignoreErrors")}
    />
  </div>
</form>