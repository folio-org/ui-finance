import { useMemo } from 'react';

import {
  Selection,
} from '@folio/stripes/components';

import { getFormattedOptions } from '../../BatchAllocationsForm/utils';
import { BARCH_ALLOCATION_STATUS_OPTIONS } from '../../constants';

export const useBatchAllocationColumnValues = (budgetsFunds, intl) => {
  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, BARCH_ALLOCATION_STATUS_OPTIONS), [intl]);

  return budgetsFunds.map((fund) => ({
    ...fund,
    fundStatus:
  <Selection
    name="members"
    id="memberSelect"
    placeholder={intl.formatMessage({ id: 'ui-finance.fund.information.status' })}
    dataOptions={fundStatusOptions}
    onChange={() => { }}
    value={fund.fundStatus}
  />,
  }));
};
