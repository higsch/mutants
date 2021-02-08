import { csv, timeParse } from 'd3';

const mutantDataPath = 'data/mutant_data.csv';
const shapePath = 'data/greater_london.geojson';

const parseDate = timeParse('%Y-%m-%d');

export const loadMutantData = async () => {
  let res = [];

  try {
    res = await csv(mutantDataPath, d => {
      return {
        ...d,
        prob: +d.prob,
        sample_date: parseDate(d.sample_date)
      };
    });
  } catch(err) {
    console.log(err);
  }

  const filteredRes = res.filter(d => d.nhs_name === 'London');

  return filteredRes;
};

export const loadShape = async () => {
  const res = await fetch(shapePath);
  const parsed = await res.json();

  return parsed;
};
