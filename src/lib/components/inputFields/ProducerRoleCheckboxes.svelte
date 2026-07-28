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

<div class="grid w-full grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-3">
  {#each fields as field}
    <SimpleCheckbox
      id={`role-${field}`}
      label={$_(`${ns}${field}`)}
      bind:checked={(value as unknown as Record<string, boolean>)[field]}
    />
  {/each}
</div>