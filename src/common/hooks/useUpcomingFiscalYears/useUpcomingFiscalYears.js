import { BATCH_ALLOCATIONS_SOURCE } from '../../const';
import { useGroupUpcomingFiscalYears } from '../useGroupUpcomingFiscalYears';
import { useLedgerUpcomingFiscalYears } from '../useLedgerUpcomingFiscalYears';

const SOURCE_HOOK_DICT = {
  [BATCH_ALLOCATIONS_SOURCE.group]: useGroupUpcomingFiscalYears,
  [BATCH_ALLOCATIONS_SOURCE.ledger]: useLedgerUpcomingFiscalYears,
};

export const useUpcomingFiscalYears = ({ sourceId, sourceType }, options = {}) => {
  const useFiscalYearsHook = (SOURCE_HOOK_DICT[sourceType] || useLedgerUpcomingFiscalYears).bind(null, sourceId);

  const data = useFiscalYearsHook(options);

  return data;
};
