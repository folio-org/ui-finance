import moment from 'moment';
import { exportToCsv } from '@folio/stripes/components';
import { EXPORT_FUND_FIELDS } from './constants';

export const exportCsvFunds = (fiscalYearCode, fundCodeVsExpClassesTypes = []) => {
  const filename = `fund-codes-export-${fiscalYearCode}-${moment().format('YYYY-MM-DD-hh:mm')}`;

  return exportToCsv(
    [EXPORT_FUND_FIELDS, ...fundCodeVsExpClassesTypes],
    {
      header: false,
      filename,
    },
  );
};
