import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useSourceLink } from './useSourceLink';

const DEFAULT_TRANSACTION = {};

const SourceValue = ({ transaction = DEFAULT_TRANSACTION }) => {
  const intl = useIntl();
  const sourceLink = useSourceLink(transaction, intl);

  return sourceLink || intl.formatMessage({ id: `ui-finance.transaction.source.${transaction.source}` });
};

SourceValue.propTypes = {
  transaction: PropTypes.object,
};

export default SourceValue;
