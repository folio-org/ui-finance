import React from 'react';
import { FormattedMessage } from 'react-intl';

import { validateRequired } from '@folio/stripes-acq-components';

export const validateDuplicateFieldValue = async (ky, api, id, value, errorMessage, name, customQuery) => {
  const errorRequired = validateRequired(value);

  if (errorRequired) {
    return errorRequired;
  }

  let query = customQuery || `${name} == "${value}"`;

  if (id) query += ` and id<>"${id}"`;

  try {
    const existingRecords = await ky.get(api, { searchParams: { query } }).json();

    return existingRecords.totalRecords ? errorMessage : undefined;
  } catch {
    return <FormattedMessage id={`ui-finance.errors.load.${name}`} />;
  }
};
