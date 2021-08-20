import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import {
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { FUND_CODES_EXPENSE_CLASSES_API } from '../../common/const';
import { exportCsvFunds } from './utils';

export const useExportFund = (fiscalYearCode, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();
  const showCallout = useShowCallout();

  const queryKey = [namespace, 'exportFunds', fiscalYearCode];
  const queryFn = () => ky
    .get(FUND_CODES_EXPENSE_CLASSES_API, {
      searchParams: {
        fiscalYearCode,
        limit: LIMIT_MAX,
      },
    })
    .json();

  const { refetch: fetchExportFund } = useQuery({
    queryKey,
    queryFn,
    enabled: false,
    onError: () => showCallout({
      messageId: 'ui-finance.fund.actions.load.error',
      type: 'error',
    }),
    onSuccess: async (data) => {
      await exportCsvFunds(fiscalYearCode, data?.fundCodeVsExpClassesTypes);

      return showCallout({
        messageId: 'ui-finance.settings.exportFund.success',
        type: 'success',
      });
    },
    ...options,
  });

  return { fetchExportFund };
};
