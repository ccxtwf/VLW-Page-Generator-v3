<script lang="ts">
  import { _ } from 'svelte-i18n';
</script>

<div class="page-container">
  <h1>{$_('error.notFound.header')}</h1>
  <p class="subtitle">{$_('error.notFound.body')}</p>
</div>

<style>
  .page-container {
    padding: 1rem 0;
  }
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #ffffff;
  }
  .subtitle {
    color: #a1a1aa;
    font-size: 1rem;
  }
</style>
