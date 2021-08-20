import moment from 'moment';
import { exportCsv } from '@folio/stripes/util';
import { EXPORT_FUND_FIELDS } from './constants';

export const exportCsvFunds = (fiscalYearCode, fundCodeVsExpClassesTypes = []) => {
  const filename = `fund-codes-export-${fiscalYearCode}-${moment().format('YYYY-MM-DD-hh:mm')}`;

  return exportCsv(
    [EXPORT_FUND_FIELDS, ...fundCodeVsExpClassesTypes],
    {
      header: false,
      filename,
    },
  );
};
