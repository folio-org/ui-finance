import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { Loading } from '@folio/stripes/components';

import { useSource } from './useSource';

const SourceValue = ({ transaction }) => {
  const intl = useIntl();
  const { isLoading, sourceLink, sourceValue } = useSource(transaction, intl);

  if (isLoading) return <Loading />;

  return sourceLink
    ? (
      <Link
        data-testid="transaction-source-link"
        to={sourceLink}
      >
        {sourceValue}
      </Link>
    )
    : sourceValue;
};

SourceValue.propTypes = {
  transaction: PropTypes.object,
};

SourceValue.defaultProps = {
  transaction: {},
};

export default SourceValue;
