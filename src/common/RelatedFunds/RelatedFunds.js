import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import { LIMIT_MAX } from '@folio/stripes-acq-components';
import { Icon } from '@folio/stripes/components';

import ConnectionListing from '../../components/ConnectionListing';
import { groupFundFiscalYears } from '../resources';
import { getFundsToDisplay } from '../utils';

const RelatedFunds = ({ mutator, query, history, currency, funds }) => {
  const openFund = useCallback(
    (e, fund) => {
      const path = `/finance/fund/view/${fund.id}`;

      history.push(path);
    },
    [history],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [fundFiscalYears, setFundFiscalYears] = useState([]);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      mutator.groupFundFiscalYears.GET({
        params: {
          limit: LIMIT_MAX,
          query,
        },
      })
        .then(setFundFiscalYears)
        .catch(() => {
          setFundFiscalYears([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setFundFiscalYears([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (isLoading) {
    return (
      <Icon
        icon="spinner-ellipsis"
        width="100px"
      />
    );
  }

  const fundsToDisplay = getFundsToDisplay(funds, fundFiscalYears).filter(fund => fund.available !== undefined);

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
  mutator: PropTypes.object.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  query: PropTypes.string,
};

RelatedFunds.defaultProps = {
  funds: [],
  query: null,
};

RelatedFunds.manifest = Object.freeze({
  groupFundFiscalYears,
});

export default withRouter(stripesConnect(RelatedFunds));
