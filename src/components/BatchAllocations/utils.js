import { BATCH_ALLOCATION_ROUTES_DICT } from '../../common/const';

export const resolveDefaultBackPathname = (sourceType, sourceId) => {
  const pathname = `${BATCH_ALLOCATION_ROUTES_DICT[sourceType]}/${sourceId}/view`;

  return pathname;
};
