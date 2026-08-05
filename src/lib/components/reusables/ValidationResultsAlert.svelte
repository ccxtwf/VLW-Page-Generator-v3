<script lang="ts">
  import { _ } from "svelte-i18n";

  let errors: [string, string[] | undefined][] = $state([]);
  let warnings: [string, string[] | undefined][] = $state([]);
  let autoloadCategories: boolean = $state(false);

  export function updateState({
    errors: _errors,
    warnings: _warnings,
    autoloadCategories: _autoloadCategories = false,
  }: {
    errors: [string, string[] | undefined][];
    warnings: [string, string[] | undefined][];
    autoloadCategories?: boolean;
  }) {
    errors = _errors;
    warnings = _warnings;
    autoloadCategories = _autoloadCategories;
  }

  export function resetState() {
    updateState({ errors: [], warnings: [], autoloadCategories: false });
  }

  const i18nParamsReducer = (o: Record<any, any>, msg: string, idx: number) => {
    o[idx + 1] = msg;
    return o;
  };
</script>

<div class="mt-8 mb-8 flex flex-col gap-y-4">
  {#if errors.length}
    <div
      role="alert"
      id="validation-errors"
      class="alert alert-error alert-soft block w-full"
    >
      <div class="w-full text-xl font-bold">
        {$_("error.validationErrorsHeader")}
      </div>
      <div class="w-full">
        <ul class="list-inside list-disc">
          {#each errors as [i18nKey, i18nParams]}
            <li>
              {$_(i18nKey, {
                values: i18nParams?.reduce(i18nParamsReducer, {}),
              })}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}

  {#if warnings.length}
    <div
      role="alert"
      id="validation-warnings"
      class="alert alert-warning alert-soft block w-full"
    >
      <div class="w-full text-xl font-bold">
        {$_("error.validationWarningsHeader")}
      </div>
      <div class="w-full">
        <ul class="list-inside list-disc">
          {#each warnings as [i18nKey, i18nParams]}
            <li>
              {$_(i18nKey, {
                values: i18nParams?.reduce(i18nParamsReducer, {}),
              })}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}

  {#if autoloadCategories}
    <div
      role="alert"
      id="validation-autoload"
      class="alert alert-info alert-soft w-full"
    >
      {$_("error.autoloadCategories")}
    </div>
  {/if}
</div>
