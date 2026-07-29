<script lang="ts">
  import { _ } from "svelte-i18n";
  import ClosableCard from "./ClosableCard.svelte";
  import Divider from "./Divider.svelte";

  let { onclose } = $props();
</script>

<ClosableCard {onclose}>
  <div class="grid w-full grid-cols-1 items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_1fr]">
    {let baseFmts = [
      { l: "bold", n: 3 },
      { l: "italic", n: 2 },
      { l: "boldAndItalic", n: 5 },
    ]}
    {#each baseFmts as { l: fmt, n }}
      <div>{$_(`syntaxGuide.fmt.${fmt}`)}:</div>
      <div>
        <code>{"".padStart(n, "'")}{$_(`syntaxGuide.fmt.${fmt}Example`)}{"".padStart(n, "'")}</code>
      </div>
    {/each}

    <Divider />

    <div>
      {$_("syntaxGuide.fmt.strikethrough")}
    </div>
    <div>
      <code>
        &lt;s&gt;{$_("syntaxGuide.fmt.strikethroughExample")}&lt;/s&gt;
      </code>
    </div>

    <div>
      {$_("syntaxGuide.fmt.superscript")}
    </div>
    <div>
      <code>1&lt;sup&gt;st&lt;/sup&gt;</code>
      (1<sup>st</sup>)
    </div>

    <div>
      {$_("syntaxGuide.fmt.small")}
    </div>
    <div>
      <code>
        &lt;small&gt;{$_("syntaxGuide.fmt.smallExample")}&lt;/small&gt;
      </code>
      (<small>{$_("syntaxGuide.fmt.smallExample")}</small>)
    </div>

    <div>
      {$_("syntaxGuide.fmt.underline")}
    </div>
    <div>
      <code>
        &lt;u&gt;{$_("syntaxGuide.fmt.underlineExample")}&lt;/u&gt;
      </code>
    </div>

    <div>
      {$_("syntaxGuide.fmt.subscript")}
    </div>
    <div>
      <code>O&lt;sub&gt;2&lt;sub&gt;</code>
      (O<sub>2</sub>)
    </div>

    <div>
      {$_("syntaxGuide.fmt.big")}
    </div>
    <div>
      <code>
        &lt;big&gt;{$_("syntaxGuide.fmt.bigExample")}&lt;big&gt;
      </code>
      (<big>{$_("syntaxGuide.fmt.bigExample")}</big>)
    </div>

    <div>
      {$_("syntaxGuide.fmt.inlineStyle")}
    </div>
    <div>
      <code>
        &lt;span style="color:#000000"&gt;{$_("syntaxGuide.fmt.inlineStyleExample")}&lt;/span&gt;
      </code>
    </div>

    <Divider />

    {let interwikiGroups = [
      "internal",
      "external",
      "wikipedia",
      "hmWiki",
      "vocadb",
      "sekaipedia",
      "proseka",
      "utaite",
      "vtuber",
      "miraheze",
      "fandom",
    ]}
    {#each interwikiGroups as group}
      <div>
        {$_(`syntaxGuide.${group}.label`)}
      </div>
      <div>
        <code>{$_(`syntaxGuide.${group}.example`)}</code>
      </div>
    {/each}
  </div>
</ClosableCard>

<style>
  code {
    padding: 2px 4px;
    border-radius: 4px;
    background-color: var(--color-neutral);
    color: var(--color-secondary);
  }
</style>