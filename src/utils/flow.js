import { geoMercator, geoPath } from 'd3';

const steps = 10;

export const getProjection = () => {
  return geoMercator();
};

export const drawFlowPart = (ctx, projection, shape, current, next, color1, color2) => {
  if (!current || !next) return;

  const height = Math.abs(current.y0 - current.y1);
  const width = height;

  const heightNext = Math.abs(next.y0 - next.y1);
  const widthNext = heightNext;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.strokeStyle = gradient;
  
  for (let i = 0; i < steps; i++) {
    const interpolatedWidth = width + (i / steps) * (widthNext - width);
    const interpolatedHeight = height + (i / steps) * (heightNext - height);
    const interpolatedX = current.x + (i / steps) * (next.x - current.x);
    const interpolatedY1 = current.y1 + (i / steps) * (next.y1 - current.y1);

    const scaledProjection = projection.fitSize([interpolatedWidth, interpolatedHeight], shape);
    const gPath = geoPath()
      .projection(scaledProjection)
      .context(ctx);

    ctx.setTransform(1, Math.random() * 0.01, Math.random() * 0.01, 1, interpolatedX - interpolatedWidth / 2, interpolatedY1);

    ctx.beginPath();
    gPath(shape);
    ctx.fill();
    ctx.stroke();
  }
};
