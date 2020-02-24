import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';
import { baseManifest } from '@folio/stripes-acq-components';

import { LEDGERS_API } from '../../../common/const';
import FundLedger from './FundLedger';

const FundLedgerContainer = ({ ledgerId, mutator }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ledgerName, setLedgerName] = useState('');

  useEffect(
    () => {
      setIsLoading(true);
      setLedgerName('');

      if (ledgerId) {
        mutator.ledger.GET()
          .then(ledger => setLedgerName(ledger.name))
          .finally(() => setIsLoading(false));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ledgerId],
  );

  if (isLoading) {
    return (<Icon icon="spinner-ellipsis" />);
  }

  return (
    <FundLedger ledgerName={ledgerName} />
  );
};

FundLedgerContainer.manifest = Object.freeze({
  ledger: {
    ...baseManifest,
    path: `${LEDGERS_API}/!{ledgerId}`,
    fetch: false,
    accumulate: true,
  },
});

FundLedgerContainer.propTypes = {
  ledgerId: PropTypes.string,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(FundLedgerContainer);
