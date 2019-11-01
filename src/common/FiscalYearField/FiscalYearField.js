import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelect,
} from '@folio/stripes-acq-components';

function FiscalYearField(props) {
  return (
    <FieldSelect
      label={<FormattedMessage id="ui-finance.budget.fiscalYear" />}
      {...props}
    />
  );
}

export default FiscalYearField;
