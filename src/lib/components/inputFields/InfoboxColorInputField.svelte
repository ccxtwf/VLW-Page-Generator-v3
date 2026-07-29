<script lang="ts">
  import { _ } from "svelte-i18n";

  interface InfoboxColorInputFieldProps {
    backgroundColor: string;
    color: string;
  }

  let { backgroundColor = $bindable(""), color = $bindable("") }: InfoboxColorInputFieldProps =
    $props();
</script>

<div class="flex w-full flex-col gap-4">
  <div class="flex-item w-full">
    <!-- Preview box -->
    <div
      class="rounded-3xl border-2 border-solid p-1 text-center font-bold"
      style:background-color={backgroundColor}
      style:color
      style:border-color={color}
    >
      {$_("infoboxColors.preview")}
    </div>
  </div>
  <div class="flex w-full flex-wrap items-center justify-start gap-x-15 gap-y-2">
    <!-- BG Input -->
    <div class="join">
      <input
        id="infobox-bg-color"
        type="text"
        class="input input-bordered"
        placeholder="black"
        bind:value={backgroundColor}
      />
      <div class="join-item border-base-200 flex flex-col justify-center border pr-2 pl-2">
        <input
          id="infobox-bg-color-picker"
          type="color"
          bind:value={backgroundColor}
        />
      </div>
    </div>

    <!-- FG Input -->
    <div class="join">
      <input
        id="infobox-fg-color"
        type="text"
        class="input input-bordered"
        placeholder="white"
        bind:value={color}
      />
      <div class="join-item border-base-200 flex flex-col justify-center border pr-2 pl-2">
        <input
          id="infobox-fg-color-picker"
          type="color"
          bind:value={color}
        />
      </div>
    </div>
  </div>
</div>