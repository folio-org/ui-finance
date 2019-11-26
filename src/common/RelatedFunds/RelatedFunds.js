import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import { LIMIT_MAX } from '@folio/stripes-acq-components';
import { Icon } from '@folio/stripes/components';

import ConnectionListing from '../../components/ConnectionListing';
import {
  budgetsResource,
} from '../resources';
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
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      mutator.relatedBudgets.GET({
        params: {
          limit: LIMIT_MAX,
          query,
        },
      })
        .then(setBudgets)
        .catch(() => {
          setBudgets([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setBudgets([]);
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

  const fundsToDisplay = getFundsToDisplay(funds, budgets).filter(fund => fund.available !== undefined);

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
  relatedBudgets: {
    ...budgetsResource,
    accumulate: true,
    fetch: false,
  },
});

export default withRouter(stripesConnect(RelatedFunds));
