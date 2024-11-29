import {
  useGroupUpcomingFiscalYears,
  useLedgerUpcomingFiscalYears,
} from '../../hooks';

export const useWorksheetFiscalYears = ({ groupId, ledgerId }, options = {}) => {
  const useFiscalYearsHook = groupId
    ? useGroupUpcomingFiscalYears.bind(null, groupId)
    : useLedgerUpcomingFiscalYears.bind(null, ledgerId);

  const data = useFiscalYearsHook(options);

  return data;
};
