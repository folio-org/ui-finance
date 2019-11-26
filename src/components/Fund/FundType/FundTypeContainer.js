import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';
import { baseManifest } from '@folio/stripes-acq-components';

import { FUND_TYPES_API } from '../../../common/const';
import FundType from './FundType';

const FundTypeContainer = ({ fundTypeId, mutator }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fundTypeName, setFundTypeName] = useState('');

  useEffect(() => {
    if (fundTypeId) {
      setIsLoading(true);
      mutator.fundType.GET()
        .then(fundType => setFundTypeName(fundType.name))
        .catch(() => setFundTypeName(''))
        .finally(() => setIsLoading(false));
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [fundTypeId]);

  if (isLoading) {
    return (<Icon icon="spinner-ellipsis" />);
  }

  return (
    <FundType fundTypeName={fundTypeName} />
  );
};

FundTypeContainer.manifest = Object.freeze({
  fundType: {
    ...baseManifest,
    path: `${FUND_TYPES_API}/!{fundTypeId}`,
    fetch: false,
    accumulate: true,
  },
});

FundTypeContainer.propTypes = {
  fundTypeId: PropTypes.string,
  mutator: PropTypes.object.isRequired,
};

FundTypeContainer.defaultProps = {
  fundTypeId: '',
};

export default stripesConnect(FundTypeContainer);
