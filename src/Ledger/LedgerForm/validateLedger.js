import React from 'react';
import { FormattedMessage } from 'react-intl';

import { validateRequired } from '@folio/stripes-acq-components';

export const validateLedger = async (fetchLedger, ledgerId, paramValue, paramName) => {
  const errorRequired = validateRequired(paramValue);

  if (errorRequired) {
    return errorRequired;
  }

  let query = `${paramName} == "${paramValue}"`;

  if (ledgerId) query += ` and id<>"${ledgerId}"`;

  try {
    const existingLedgers = await fetchLedger.GET({ params: { query } });

    return existingLedgers.length ? <FormattedMessage id={`ui-finance.ledger.${paramName}.isInUse`} /> : undefined;
  } catch {
    return <FormattedMessage id={`ui-finance.errors.load.${paramName}`} />;
  }
};
