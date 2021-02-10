import { ascending, stack, stackOffsetSilhouette, extent, range as d3range } from 'd3';

export const stackData = (data) => {
  if (data.length === 0) return [];

  const dateNums = [...new Set(data.map(d => +d.sample_date_num))].sort((a, b) => ascending(a, b));
  const keys = [...new Set(data.map(d => d.variant))].sort((a, b) => ascending(a, b));

  let input = [];
  dateNums.forEach(dateNum => {
    let obj = {};
    keys.forEach(key => {
      obj = {...obj, [key]: data.find(d => +d.sample_date_num === dateNum && d.variant === key)};
    });
    input = [...input, obj];
  });

  // stack layout#
  const stream = stack()
    .keys(keys)
    .value((d, key) => d[key].prob)
    .offset(stackOffsetSilhouette)
    (input);
  
  return stream;
};
