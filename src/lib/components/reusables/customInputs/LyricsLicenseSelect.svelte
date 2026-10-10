<script lang="ts">
  import { _ } from "svelte-i18n";
  import SimpleTextInput from "../base/SimpleTextInput.svelte";
  import {
    lyricsLicenseMenuGroups,
    lyricsLicenses,
    type LyricsLicenseKey,
  } from "../../../../constants/lyrics-licenses";

  interface LyricsLicenseSelectProps {
    value: LyricsLicenseKey;
    customLicense: string;
  }

  let { value = $bindable(""), customLicense = $bindable("") }: LyricsLicenseSelectProps = $props();

  function unsafelyRenderHtml(licenseKey: LyricsLicenseKey): string {
    let { desc, url, linkCaption } = lyricsLicenses[licenseKey];
    if (licenseKey === "custom") {
      return customLicense ? customLicense.replaceAll(/</g, "&lt;") : desc;
    }
    if (!url || !linkCaption) {
      return desc;
    }
    return desc
      .replaceAll(/</g, "&lt;")
      .replace("$1", `<a href="${url}" class="link link-accent">${linkCaption}</a>`);
  }
</script>

<select
  id="lyrics-license"
  class="select w-full"
  bind:value
  defaultValue={"fairuse"}
>
  {#each lyricsLicenseMenuGroups as { group, items }}
    <optgroup label={$_("songGenForm.license.groups." + group)}>
      {#each items as item}
        <option value={item}>{lyricsLicenses[item].label}</option>
      {/each}
    </optgroup>
  {/each}
</select>
<SimpleTextInput
  id="lyrics-custom-license"
  placeholder={$_("songGenForm.license.customLicensePlaceholder")}
  bind:value={customLicense}
  disabled={value !== "custom"}
/>

{#if value}
  <div class="w-full">
    <div class="rounded-sm border-x-4 border-y-1 px-4 py-2 text-center text-xs italic">
      {@html unsafelyRenderHtml(value as LyricsLicenseKey)}
    </div>
  </div>
{/if}