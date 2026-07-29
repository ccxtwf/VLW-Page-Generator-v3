<script lang="ts">
  import { _ } from "svelte-i18n";

  import SimpleCheckbox from "./SimpleCheckbox.svelte";
  import type { ProducerRoles } from "../../../schemas/form";

  let ns = "producerGenForm.producerRoles.checkboxLabels.";
  let fields = [
    "composer",
    "lyricist",
    "tuner",
    "illustrator",
    "animator",
    "arranger",
    "instrumentalist",
    "mixer",
    "masterer",
  ];
  let {
    value = $bindable({
      composer: false,
      lyricist: false,
      tuner: false,
      illustrator: false,
      animator: false,
      arranger: false,
      instrumentalist: false,
      mixer: false,
      masterer: false,
    }),
  }: { value: ProducerRoles } = $props();
</script>

<div
  id="producer-roles"
  class="mt-3 mb-3 grid w-full grid-cols-1 gap-x-5 gap-y-3 rounded-sm p-4 sm:grid-cols-2 lg:grid-cols-3"
>
  {#each fields as field}
    <SimpleCheckbox
      id={`role-${field}`}
      label={$_(`${ns}${field}`)}
      bind:checked={(value as unknown as Record<string, boolean>)[field]}
    />
  {/each}
</div>