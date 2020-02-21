import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

const FundLedger = ({ ledgerName }) => (
  <KeyValue
    label={<FormattedMessage id="ui-finance.fund.information.ledger" />}
    value={ledgerName}
  />
);

FundLedger.propTypes = {
  ledgerName: PropTypes.string.isRequired,
};

export default FundLedger;
