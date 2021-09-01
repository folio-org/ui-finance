import React from 'react';
import { FormattedMessage } from 'react-intl';

import { validateRequired } from '@folio/stripes-acq-components';

export const validateDuplicateFieldValue = async ({
  ky,
  api,
  id,
  fieldValue,
  errorMessage,
  fieldName,
  query = `${fieldName} == "${fieldValue}"`,
}) => {
  const errorRequired = validateRequired(fieldValue);

  if (errorRequired) {
    return errorRequired;
  }

  if (fieldValue?.includes(':')) return <FormattedMessage id="ui-finance.validation.mustNotIncludeColon" />;

  const _query = id ? query.concat(` and id<>"${id}"`) : query;

  try {
    const existingRecords = await ky.get(api, { searchParams: { query: _query } }).json();

    return existingRecords.totalRecords ? errorMessage : undefined;
  } catch {
    return <FormattedMessage id={`ui-finance.errors.load.${fieldName}`} />;
  }
};
