import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldMultiSelectionFinal } from '@folio/stripes-acq-components';

const DEFAULT_DATA_OPTIONS = [];

function FieldFundGroups({
  dataOptions = DEFAULT_DATA_OPTIONS,
  name,
  ...props
}) {
  return (
    <FieldMultiSelectionFinal
      dataOptions={dataOptions}
      label={<FormattedMessage id="ui-finance.fund.information.group" />}
      name={name}
      {...props}
    />
  );
}

FieldFundGroups.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.any),
  name: PropTypes.string.isRequired,
};

export default FieldFundGroups;
