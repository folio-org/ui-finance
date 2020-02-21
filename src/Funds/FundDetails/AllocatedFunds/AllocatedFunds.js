import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

const AllocatedFunds = ({ allocatedFunds, labelId }) => (
  <KeyValue
    label={<FormattedMessage id={labelId} />}
    value={allocatedFunds}
  />
);

AllocatedFunds.propTypes = {
  allocatedFunds: PropTypes.string,
  labelId: PropTypes.string.isRequired,
};

AllocatedFunds.defaultProps = {
  allocatedFunds: '',
};

export default AllocatedFunds;
