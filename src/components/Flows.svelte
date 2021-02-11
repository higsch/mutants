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

    ctx.globalAlpha = 1.0;
    ctx.lineWidth = 1;
    ctx.fillStyle = '#FFFFFF';
    const sampleDateNums = [...new Set(data.map(flow => flow.map(d => d.data.sampleDateNum)).flat(2))];
    sampleDateNums.filter((_, i) => i % 30).forEach(sampleDateNum => {
      data.forEach(flow => {
        const { key } = flow;
        const d = flow.find(d => d.data.sampleDateNum === sampleDateNum);
        const dNext = flow.find(d => d.data.sampleDateNum === sampleDateNum + 1);
        const { color1, color2 } = colors.find(d => d.variant === key);
        const current = getCoordinates(d);
        const next = getCoordinates(dNext);
        drawFlowPart(ctx, projection, shape, current, next, color1, color2);
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
