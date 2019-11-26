import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

const FundType = ({ fundTypeName }) => (
  <KeyValue
    label={<FormattedMessage id="ui-finance.fund.information.type" />}
    value={fundTypeName}
  />
);

FundType.propTypes = {
  fundTypeName: PropTypes.string,
};

FundType.defaultProps = {
  fundTypeName: '',
};

export default FundType;
