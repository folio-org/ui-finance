import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';
import { batchFetch } from '@folio/stripes-acq-components';

import { fundsResource } from '../../../common/resources';
import AllocatedFunds from './AllocatedFunds';

const AllocatedFundContainer = ({ fundIds, mutator, labelId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allocatedFunds, setAllocatedFunds] = useState('');

  useEffect(() => {
    if (fundIds.length) {
      setIsLoading(true);
      batchFetch(mutator.allocatedFunds, fundIds, (itemsChunk) => {
        const fundsQuery = itemsChunk
          .map(id => `id==${id}`)
          .join(' or ');

        return fundsQuery || '';
      }).then(funds => setAllocatedFunds(funds.map(f => f.name).join(', ')))
        .catch(() => setAllocatedFunds(''))
        .finally(() => setIsLoading(false));
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [fundIds]);

  if (isLoading) {
    return (<Icon icon="spinner-ellipsis" />);
  }

  return (
    <AllocatedFunds
      allocatedFunds={allocatedFunds}
      labelId={labelId}
    />
  );
};

AllocatedFundContainer.manifest = Object.freeze({
  allocatedFunds: {
    ...fundsResource,
    accumulate: true,
    fetch: false,
  },
});

AllocatedFundContainer.propTypes = {
  fundIds: PropTypes.arrayOf(PropTypes.string),
  labelId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
};

AllocatedFundContainer.defaultProps = {
  fundIds: [],
};

export default stripesConnect(AllocatedFundContainer);
