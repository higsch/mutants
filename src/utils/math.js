import { ascending, stack, stackOffsetSilhouette } from 'd3';

export const stackData = (data) => {
  if (data.length === 0) return [];

  const nums = [...new Set(data.map(d => d.sample_date_num))].sort((a, b) => ascending(a, b));
  const keys = [...new Set(data.map(d => d.variant))].sort((a, b) => ascending(a, b));

  let input = [];
  nums.forEach(num => {
    let obj = {};
    keys.forEach(key => {
      obj = {
        ...obj,
        [key]: data.find(d => d.sample_date_num === num && d.variant === key),
        sampleDateNum: num,
      };
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
