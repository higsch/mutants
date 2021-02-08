<script>
  import { onDestroy, setContext } from 'svelte';
  import { setupCanvas } from '../utils/canvas';

  export let width = 0;
  export let height = 0;
  export let pixelRatio = window.devicePixelRatio || 1;
  export let contextName = 'canvas';

  const drawFunctions = [];

  let canvas;
  let ctx;
  let pendingInvalidation = false;
  let frameId;

  $: setContext(contextName, {
    register(fn) {
      drawFunctions.push(fn);
    },
    deregister(fn) {
      drawFunctions.splice(drawFunctions.indexOf(fn), 1);
    },
    invalidate() {
      if (pendingInvalidation) return;
      pendingInvalidation = true;
      frameId = requestAnimationFrame(update);
    },
  });

  function update() {
    if (!ctx) return;

    // ctx.clearRect(0, 0, width, height);

    drawFunctions.forEach((fn) => {
      ctx.save();
      fn(ctx);
      ctx.restore();
    });

    pendingInvalidation = false;
  }

  onDestroy(() => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
  });

  $: ctx = setupCanvas(canvas, width, height, pixelRatio);
</script>

<canvas
  bind:this={canvas}
/>
<slot />
