<script lang="ts">
  import { _ } from "svelte-i18n";

  let _errorMessageKeys: string[] = $state([]);
  let _autoloadCategories: boolean = $state(false);

  export function updateState({
    errors,
    autoloadCategories = false,
  }: {
    errors: string[];
    autoloadCategories?: boolean;
  }) {
    _errorMessageKeys = errors;
    _autoloadCategories = autoloadCategories;
  }

  export function resetState() {
    updateState({ errors: [], autoloadCategories: false });
  }
</script>

<div class="mt-8 mb-8 flex flex-col gap-y-4">
  {#if _errorMessageKeys.length}
    <div
      role="alert"
      id="validation-errors"
      class="alert alert-error alert-soft block w-full"
    >
      <div class="w-full text-lg font-bold">
        {$_("error.validationErrorsHeader")}
      </div>
      <div class="w-full">
        <ul>
          {#each _errorMessageKeys as i18nKey}
            <li>{$_(i18nKey)}</li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}

  {#if _autoloadCategories}
    <div
      role="alert"
      id="validation-warning"
      class="alert alert-warning alert-soft w-full"
    >
      {$_("error.autoloadCategories")}
    </div>
  {/if}
</div>