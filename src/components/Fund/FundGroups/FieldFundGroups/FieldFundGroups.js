import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldMultiSelectionFinal } from '@folio/stripes-acq-components';

function FieldFundGroups(props) {
  return (
    <FieldMultiSelectionFinal
      label={<FormattedMessage id="ui-finance.fund.information.group" />}
      {...props}
    />
  );
}

FieldFundGroups.propTypes = {
  name: PropTypes.string.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.any),
};

FieldFundGroups.defaultProps = {
  dataOptions: [],
};

export default FieldFundGroups;
