import { useMutation } from 'react-query';
import { useIntl } from 'react-intl';

import { exportToCsv } from '@folio/stripes/components';
import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { EXPORT_DATA_FIELDS } from '../../constants';
import {
  createExportReport,
  getBudgetExpenseClassesExportData,
  getBudgetsExportData,
  getFiscalYearData,
  getFundsExportData,
} from '../../utils';

export const useLedgerExportCSV = (ledger) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ledger-export-csv' });

  const mutationKey = [namespace, ledger.id];
  const mutationFn = async (configs) => {
    if (!configs.fiscalYearId) Promise.reject();

    const budgetsData = await getBudgetsExportData(ky)({ ...configs, ledgerId: ledger.id });

    const [
      fiscalYearData,
      fundsData,
      expenseClassesData,
    ] = await Promise.all([
      getFiscalYearData(ky)(configs.fiscalYearId),
      getFundsExportData(ky)({ ...configs, ledger }),
      getBudgetExpenseClassesExportData(ky)({ ...configs, budgetsData }),
    ]);

    const exportReport = await createExportReport(
      {
        budgetsData,
        expenseClassesData,
        fundsData,
      },
      {
        intl,
      },
    );

    exportToCsv(
      [{ ...EXPORT_DATA_FIELDS }, ...exportReport],
      {
        filename: `Export-${ledger.code}-${fiscalYearData.code}`,
        header: false,
      },
    );

    return exportReport;
  };

  const {
    isLoading,
    mutateAsync: runExportCSV,
  } = useMutation({ mutationKey, mutationFn });

  return {
    runExportCSV,
    isLoading,
  };
};
