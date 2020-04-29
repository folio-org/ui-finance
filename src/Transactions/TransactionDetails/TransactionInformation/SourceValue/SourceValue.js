import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { getSourceLink } from './utils';

const SourceValue = ({ transaction }) => {
  const sourceLink = useMemo(() => getSourceLink(transaction), [transaction]);

  return sourceLink
    ? (
      <Link
        data-testid="transaction-source-link"
        to={sourceLink}
      >
        <FormattedMessage id={`ui-finance.transaction.source.${transaction.source}`} />
      </Link>
    )
    : <FormattedMessage id={`ui-finance.transaction.source.${transaction.source}`} />;
};

SourceValue.propTypes = {
  transaction: PropTypes.object,
};

SourceValue.defaultProps = {
  transaction: {},
};

export default SourceValue;
