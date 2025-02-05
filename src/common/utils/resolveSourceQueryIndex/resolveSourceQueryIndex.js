import { BATCH_ALLOCATIONS_SOURCE } from '../../const';

const SOURCE_QUERY_INDEX_DICT = {
  [BATCH_ALLOCATIONS_SOURCE.group]: 'groupId',
  [BATCH_ALLOCATIONS_SOURCE.ledger]: 'ledgerId',
};

export const resolveSourceQueryIndex = (sourceType) => {
  return SOURCE_QUERY_INDEX_DICT[sourceType] || 'ledgerId';
};
