import { useIntl } from 'react-intl';
import { renderHook } from '@testing-library/react-hooks';

import { EXPORT_EXPENSE_CLASSES_VALUES } from '../constants';
import { getExportExpenseClassesOptions } from './getExportExpenseClassesOptions';

describe('getExportExpenseClassesOptions', () => {
  it('should return export expense class options', () => {
    const { result } = renderHook(() => useIntl());

    expect(getExportExpenseClassesOptions(result.current)).toEqual(
      Object.values(EXPORT_EXPENSE_CLASSES_VALUES).map(
        value => ({
          label: `ui-finance.exportCSV.exportSettings.expenseClasses.${value}`,
          value,
        }),
      ),
    );
  });
});
