<script lang="ts">
  import { _ } from "svelte-i18n";
  import { ROUTES } from "../router";
  import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../config";

  const wikiGuidelinePages = [
    "Help:Basics_of_Editing",
    "Help:FAQ",
    "Help:Song_Article_Guideline",
    "Help:Album_Article_Guideline",
    "Help:Producer_Article_Guideline",
    "Help:Disambiguation_Article_Guideline",
    "Help:Warning_Templates_Guideline",
  ];
</script>

<footer class="bg-neutral text-neutral-content p-10">
  <div class="footer sm:footer-horizontal">
    <aside>
      <div>
        <div>{$_("metadata.author")}</div>
        <div class="mt-2 grid grid-flow-col gap-4">
          <a
            href={import.meta.env.VITE_GITHUB_REPO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost text-neutral-content"
            title={$_("repoLinks.tooltip", {
              values: { service: $_("repoLinks.github") },
            })}
          >
            <svg
              class="icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
            <span>{$_("repoLinks.github")}</span>
          </a>
          <a
            href={import.meta.env.VITE_GITLAB_REPO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost text-neutral-content"
            title={$_("repoLinks.tooltip", {
              values: { service: $_("repoLinks.gitlab") },
            })}
          >
            <svg
              class="icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path
                d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.92l2.36-7.25a.42.42 0 01.8-.04l2.45 7.51h10.68l2.45-7.51a.42.42 0 01.8.04l2.36 7.25a.84.84 0 01-.3.92z"
              />
            </svg>
            <span>{$_("repoLinks.gitlab")}</span>
          </a>
        </div>
      </div>
    </aside>
    <nav class="w-full">
      <h6 class="footer-title">{$_("metadata.linksHeader")}</h6>
      {#each ROUTES as route}
        <a
          href={`#${route.path}`}
          class="opacity-50 hover:opacity-70 sm:w-full">{$_(`pages.${route.labelKey}`)}</a
        >
      {/each}
    </nav>
    <nav class="w-full">
      <h6 class="footer-title">{$_("metadata.wikiGuidelinesHeader")}</h6>
      {#each wikiGuidelinePages as pageName}
        {let url = `${VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT}/${pageName}`}
        {let displayedPageName = pageName.slice(5).replaceAll(/_/g, " ")}
        <a
          href={url}
          target="_blank"
          class="opacity-50 hover:opacity-70 sm:w-full">{displayedPageName}</a
        >
      {/each}
    </nav>
  </div>
  <div class="mt-6 border-t-1 border-gray-800 pt-2 text-right">
    <p class="text-neutral-content text-xs opacity-30">
      Build code: {import.meta.env.VITE_BUILD_CODE}
    </p>
    <p class="text-neutral-content text-xs opacity-30">
      Build date: {import.meta.env.VITE_BUILD_DATE}
    </p>
  </div>
</footer>