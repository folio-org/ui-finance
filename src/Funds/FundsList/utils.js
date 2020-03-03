import { uniq } from 'lodash';

import {
  batchFetch,
} from '@folio/stripes-acq-components';

export const fetchFundLedgers = (mutator, funds, fetchedLedgersMap) => {
  const unfetchedLedgers = funds
    .filter(fund => !fetchedLedgersMap[fund.ledgerId])
    .map(fund => fund.ledgerId);

  const ledgersPromise = unfetchedLedgers.length
    ? batchFetch(mutator, uniq(unfetchedLedgers))
    : Promise.resolve([]);

  return ledgersPromise;
};
