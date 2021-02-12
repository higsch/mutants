import { csv, timeParse } from 'd3';

const mutantDataPath = 'data/mutant_data.csv';
const shapePath = 'data/london.geojson';

const parseDate = timeParse('%Y-%m-%d');

export const loadMutantData = async () => {
  let res = [];

  try {
    res = await csv(mutantDataPath, d => {
      return {
        ...d,
        prob: +d.prob,
        sample_date: +d.sample_date.replace(/-/g, ''),
        sample_date_num: +d.sample_date_num
      };
    });
  } catch(err) {
    console.log(err);
  }

  const filteredRes = res.filter(d => d.nhs_name === 'London').filter(d => d.variant !== 'minority variants');

  return filteredRes;
};

export const loadShape = async () => {
  const res = await fetch(shapePath);
  const parsed = await res.json();
  const { features } = parsed;

  return features.find(d => d.properties.EER13NM === 'London');
};
