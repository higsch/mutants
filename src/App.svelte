<script>
  import { onMount } from 'svelte';
  import { loadMutantData, loadShape } from './utils/load';
  
  import Canvas from './components/Canvas.svelte';
  import Flows from './components/Flows.svelte';

  let width = 0;
  let height = 0;
  let data = [];
  let shape;

  onMount(async () => {
    data = await loadMutantData();
    shape = await loadShape();
  });

  $: renderedData = data;
</script>

<div class="app-wrapper">
  <div
    class="draw-wrapper"
    bind:clientWidth={width}
    bind:clientHeight={height}
  >
    <Canvas
      width={width}
      height={height}
    >
      <Flows
        data={renderedData}
        shape={shape}
      />
    </Canvas>
  </div>
</div>

<style>
  .app-wrapper {
    width: 100%;
    height: 100%;
  }

  .draw-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
