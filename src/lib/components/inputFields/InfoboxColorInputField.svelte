<script lang="ts">
  import { _ } from "svelte-i18n";
  import { preventDefault } from "../../utils/utils";

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
    <div class="join w-full md:w-72">
      <input
        id="infobox-bg-color"
        type="text"
        class="input input-bordered"
        placeholder="black"
        defaultValue="black"
        bind:value={backgroundColor}
        onkeypress={preventDefault}
      />
      <div
        id="infobox-bg-color-picker"
        class="join-item border-base-200 flex flex-col justify-center border pr-2 pl-2"
      >
        <input
          type="color"
          defaultValue="#000000"
          bind:value={backgroundColor}
        />
      </div>
    </div>

    <!-- FG Input -->
    <div class="join w-full md:w-72">
      <input
        id="infobox-fg-color"
        type="text"
        class="input input-bordered"
        placeholder="white"
        defaultValue="white"
        bind:value={color}
        onkeypress={preventDefault}
      />
      <div
        id="infobox-fg-color-picker"
        class="join-item border-base-200 flex flex-col justify-center border pr-2 pl-2"
      >
        <input
          type="color"
          defaultValue="#ffffff"
          bind:value={color}
        />
      </div>
    </div>
  </div>
</div>