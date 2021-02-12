<script>
  import { onMount } from 'svelte';
  import { scaleLinear, extent } from 'd3';
  import { loadMutantData, loadShape } from './utils/load';
  import { stackData } from './utils/math';
  import { variantColors } from './utils/colors';
  
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
  
  $: xScale = scaleLinear()
    .domain(extent(data, d => d.sample_date_num))
    .range([0, width]);

  $: stackedData = stackData(data);

  $: yScale = scaleLinear()
    .domain(extent(stackedData.map((d) => d.map((d) => [d[0], d[1]])).flat(2)))
    .range([height, 0]);
</script>

<div class="app-wrapper">
  <div
    class="draw-wrapper"
    bind:clientWidth={width}
    bind:clientHeight={height}
  >
    {#if (xScale && yScale && shape)}
      <Canvas
        width={width}
        height={height}
      >
        <Flows
          data={stackedData}
          xScale={xScale}
          yScale={yScale}
          shape={shape}
          colors={variantColors}
        />
      </Canvas>
    {/if}
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
