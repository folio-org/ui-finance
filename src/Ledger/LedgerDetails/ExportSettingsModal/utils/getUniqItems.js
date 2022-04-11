import {
  filter,
  flatten,
  flow,
  map,
  uniq,
} from 'lodash/fp';

export const getUniqItems = (dataObj, mapFn) => (
  flow(
    map(mapFn),
    flatten,
    filter(Boolean),
    uniq,
  )(Object.values(dataObj))
);
