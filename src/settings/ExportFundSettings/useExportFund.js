import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { FUND_CODES_EXPENSE_CLASSES_API } from '../../common/const';

export const useExportFund = (fiscalYearCode, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

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
    queryKey, queryFn, enabled: false, ...options,
  });

  return { fetchExportFund };
};
