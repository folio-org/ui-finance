import React from 'react';
import { FormattedMessage } from 'react-intl';

import { validateRequired } from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API } from '../../common/const';

export const validateFYCode = async (ky, fiscalYearId, value) => {
  const errorRequired = validateRequired(value);

  if (errorRequired) {
    return errorRequired;
  }

  let query = `code == ${value}`;

  if (fiscalYearId) query += ` and id<>"${fiscalYearId}"`;

  const existingFiscalYears = await ky.get(`${FISCAL_YEARS_API}`, { searchParams: { query } }).json();

  return existingFiscalYears?.totalRecords ? <FormattedMessage id="ui-finance.fiscalYear.code.isInUse" /> : undefined;
};
