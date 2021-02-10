import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Loading } from '@folio/stripes/components';

import { TRANSACTION_SOURCE } from '../../../constants';
import { getSourceLink } from './utils';
import { useSourceValue } from './useSourceValue';

const SourceValue = ({ transaction }) => {
  const { isLoading, sourceValue } = useSourceValue(transaction);
  const sourceLink = useMemo(() => getSourceLink(transaction), [transaction]);

  if (isLoading) return <Loading />;

  return sourceLink
    ? (
      <Link
        data-testid="transaction-source-link"
        to={sourceLink}
      >
        {transaction.source === TRANSACTION_SOURCE.invoice || transaction.source === TRANSACTION_SOURCE.poLine
          ? sourceValue || <FormattedMessage id={`ui-finance.transaction.source.${transaction.source}`} />
          : <FormattedMessage id={`ui-finance.transaction.source.${transaction.source}`} />
        }
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
