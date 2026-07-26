<script lang="ts">
  import { _ } from "svelte-i18n";

  import SongPageForm from "../forms/SongPageForm.svelte";

  import Divider from "../components/reusables/Divider.svelte";
  import FirstTimeEditingNotice from "../components/reusables/FirstTimeEditingNotice.svelte";
</script>

<div class="page-container mx-auto max-w-4xl p-4">
  <h1 class="mb-6 text-2xl font-bold text-white">Song Generator</h1>

  <SongPageForm />

  <Divider />

  <FirstTimeEditingNotice />
</div>