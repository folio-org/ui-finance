import {
  useGroupUpcomingFiscalYears,
  useLedgerUpcomingFiscalYears,
} from '../../hooks';

export const useUpcomingFiscalYears = ({ groupId, ledgerId }, options = {}) => {
  const useFiscalYearsHook = groupId
    ? useGroupUpcomingFiscalYears.bind(null, groupId)
    : useLedgerUpcomingFiscalYears.bind(null, ledgerId);

  const data = useFiscalYearsHook(options);

  return data;
};
