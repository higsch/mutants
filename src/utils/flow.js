import { geoMercator, geoPath } from 'd3';

export const getProjection = () => {
  return geoMercator();
};

export const drawFlowPart = (ctx, projection, shape, current, next) => {
  const width = Math.abs(current.y0 - current.y1) / 2;
  const scaledProjection = projection.fitSize([width, width], shape);
  const gPath = geoPath()
    .projection(scaledProjection)
    .context(ctx);

  ctx.translate(current.x - width, current.y0 - width);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  gPath(shape);
  ctx.stroke();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
};
