import { EXPORT_EXPENSE_CLASSES_VALUES } from '../constants';

export const getExportExpenseClassesOptions = (intl) => {
  return Object.values(EXPORT_EXPENSE_CLASSES_VALUES).map(
    value => ({
      label: intl.formatMessage({ id: `ui-finance.exportCSV.exportSettings.expenseClasses.${value}` }),
      value,
    }),
  );
};
