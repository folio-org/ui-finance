import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useSourceLink } from './useSourceLink';

const SourceValue = ({ transaction }) => {
  const intl = useIntl();
  const sourceLink = useSourceLink(transaction, intl);

  return sourceLink || intl.formatMessage({ id: `ui-finance.transaction.source.${transaction.source}` });
};

SourceValue.propTypes = {
  transaction: PropTypes.object,
};

SourceValue.defaultProps = {
  transaction: {},
};

export default SourceValue;
