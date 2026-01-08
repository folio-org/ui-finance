import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const FundType = ({ fundTypeName = '' }) => (
  <KeyValue
    label={<FormattedMessage id="ui-finance.fund.information.type" />}
    value={fundTypeName || <NoValue />}
  />
);

FundType.propTypes = {
  fundTypeName: PropTypes.string,
};

export default FundType;
