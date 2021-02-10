<script>
  import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
  import { range } from 'd3';
  import { drawFlowPart, getProjection } from '../utils/flow';

  export let data = [];
  export let shape;
  export let xScale;
  export let yScale;
  export let colors;

  const { register, deregister, invalidate } = getContext('canvas');

  function getCoordinates(d) {
    if (!d) return;

    const { 0: yPos0, 1: yPos1, data } = d;
    const { sample_date: sampleDate } = Object.values(data)[0];
    const y0 = yScale(yPos0);
    const y1 = yScale(yPos1);
    const x = xScale(sampleDate);

    return {
      x, y0, y1
    };
  }

  function draw(ctx) {
    if (!data || !data.length) return;

    const xIndices = range([...new Set(data.map(d => d.length))]).reverse();
    xIndices.forEach(xIndex => {
      data.slice(-1).forEach(flow => {
        const current = getCoordinates(flow[xIndex]);
        const next = getCoordinates(flow[xIndex + 1]);
        
        drawFlowPart(ctx, projection, shape, current, next);
      });
    });
  }

  onMount(() => {
    invalidate();
    register(draw);

    return () => {
      deregister(draw);
    };
  });

	afterUpdate(invalidate);
	onDestroy(invalidate);

  $: projection = getProjection(shape);
</script>
