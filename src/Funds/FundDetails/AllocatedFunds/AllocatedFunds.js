import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const AllocatedFunds = ({
  allocatedFunds = '',
  labelId,
}) => (
  <KeyValue
    label={<FormattedMessage id={labelId} />}
    value={allocatedFunds || <NoValue />}
  />
);

AllocatedFunds.propTypes = {
  allocatedFunds: PropTypes.string,
  labelId: PropTypes.string.isRequired,
};

export default AllocatedFunds;
