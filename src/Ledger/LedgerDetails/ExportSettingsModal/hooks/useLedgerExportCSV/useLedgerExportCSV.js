import { useMutation } from 'react-query';
import { useIntl } from 'react-intl';

import { exportToCsv } from '@folio/stripes/components';
import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  EXPORT_FUND_FIELDS,
  EXPORT_BUDGET_FIELDS,
  EXPORT_EXPENSE_CLASS_FIELDS,
  EXPORT_EXPENSE_CLASS_STATUSES_MAP,
} from '../../constants';
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

    const reportFields = EXPORT_EXPENSE_CLASS_STATUSES_MAP[configs.expenseClasses]
      ? Object.keys({ ...EXPORT_FUND_FIELDS, ...EXPORT_BUDGET_FIELDS, ...EXPORT_EXPENSE_CLASS_FIELDS })
      : Object.keys({ ...EXPORT_FUND_FIELDS, ...EXPORT_BUDGET_FIELDS });

    exportToCsv(
      [{ ...EXPORT_FUND_FIELDS, ...EXPORT_BUDGET_FIELDS, ...EXPORT_EXPENSE_CLASS_FIELDS }, ...exportReport],
      {
        onlyFields: reportFields,
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
