import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

function NetTransfers({ netTransfers, currency }) {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-finance.budget.netTransfers" />}
    >
      <AmountWithCurrencyField
        amount={netTransfers}
        currency={currency}
        showBrackets={netTransfers < 0}
      />
    </KeyValue>
  );
}

NetTransfers.propTypes = {
  currency: PropTypes.string,
  netTransfers: PropTypes.number,
};

export default NetTransfers;
