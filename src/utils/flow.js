import { geoMercator, geoPath } from 'd3';

const steps = 10;

export const getProjection = () => {
  return geoMercator();
};

export const drawFlowPart = (ctx, projection, shape, current, next, color1, color2, progress) => {
  if (!current || !next) return;

  const height = Math.abs(current.y0 - current.y1);
  const width = height;

  const heightNext = Math.abs(next.y0 - next.y1);
  const widthNext = heightNext;

  ctx.strokeStyle = color1;
  
  for (let i = 0; i < steps; i++) {
    const interpolatedWidth = width + (i / steps) * (widthNext - width);
    const interpolatedHeight = height + (i / steps) * (heightNext - height);
    const interpolatedX = current.x + (i / steps) * (next.x - current.x);
    const interpolatedY1 = current.y1 + (i / steps) * (next.y1 - current.y1);

    const scaledProjection = projection.fitSize([interpolatedWidth, interpolatedHeight], shape);
    const gPath = geoPath()
      .projection(scaledProjection)
      .context(ctx);

    ctx.setTransform(1, 0, 0, 1, interpolatedX, interpolatedY1);

    ctx.beginPath();
    ctx.lineTo(10, 10);
    gPath(shape);
    // ctx.arc(0, 0, interpolatedWidth / 2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
};
