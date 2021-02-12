<script>
  import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
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
    const { sampleDateNum } = data;
    const y0 = yScale(yPos0);
    const y1 = yScale(yPos1);
    const x = xScale(sampleDateNum);

    return {
      x, y0, y1
    };
  }

  function draw(ctx) {
    if (!data || !data.length) return;

    ctx.globalAlpha = 1;
    ctx.lineWidth = 0.1;
    ctx.fillStyle = '#EEEEEE';
    const sampleDateNums = [...new Set(data.map(flow => flow.map(d => d.data.sampleDateNum)).flat(2))];
    sampleDateNums.forEach(sampleDateNum => {
      data.forEach((flow, i, arr) => {
        const { key } = flow;
        const d = flow.find(d => d.data.sampleDateNum === sampleDateNum);
        const dNext = flow.find(d => d.data.sampleDateNum === sampleDateNum + 1);
        const { color1, color2 } = colors.find(d => d.variant === key);
        const current = getCoordinates(d);
        const next = getCoordinates(dNext);
        const progress = i / (arr.length - 1);
        drawFlowPart(ctx, projection, shape, current, next, color1, color2, progress);
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
