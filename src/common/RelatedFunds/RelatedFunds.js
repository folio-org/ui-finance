import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LIMIT_MAX } from '@folio/stripes-acq-components';

import ConnectionListing from '../../components/ConnectionListing';

const RelatedFunds = ({ parentMutator, query, history, fundsToDisplay, currency }) => {
  const openFund = useCallback(
    (e, fund) => {
      const path = `/finance/fund/view/${fund.id}`;

      history.push(path);
    },
    [history],
  );

  useEffect(() => {
    parentMutator.groupFundFiscalYears.reset();
    parentMutator.groupFundFiscalYears.GET({
      params: {
        limit: LIMIT_MAX,
        query,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <ConnectionListing
      items={fundsToDisplay}
      currency={currency}
      openItem={openFund}
    />
  );
};

RelatedFunds.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  parentMutator: PropTypes.object.isRequired,
  fundsToDisplay: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  query: PropTypes.string,
};

RelatedFunds.defaultProps = {
  fundsToDisplay: [],
  query: null,
  currency: '',
};

export default RelatedFunds;
