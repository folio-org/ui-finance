import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { LIMIT_MAX } from '@folio/stripes-acq-components';
import { Icon } from '@folio/stripes/components';

import ConnectionListing from '../../components/ConnectionListing';
import { groupFundFiscalYears } from '../resources';
import { getFundsToDisplay } from '../utils/getFundToDisplay';

const RelatedFunds = ({ mutator, resources, query, history, currency, funds }) => {
  const openFund = useCallback(
    (e, fund) => {
      const path = `/finance/fund/view/${fund.id}`;

      history.push(path);
    },
    [history],
  );

  useEffect(() => {
    mutator.groupFundFiscalYears.reset();
    mutator.groupFundFiscalYears.GET({
      params: {
        limit: LIMIT_MAX,
        query,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const isLoading = !(
    get(resources, ['groupFundFiscalYears', 'hasLoaded'])
  );

  if (isLoading) {
    return (
      <Icon
        icon="spinner-ellipsis"
        width="100px"
      />
    );
  }

  const fundFiscalYears = get(resources, ['groupFundFiscalYears', 'records'], []);

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
  resources: PropTypes.object.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  query: PropTypes.string,
};

RelatedFunds.defaultProps = {
  funds: [],
  query: null,
  currency: '',
};

RelatedFunds.manifest = Object.freeze({
  groupFundFiscalYears,
});

export default withRouter(stripesConnect(RelatedFunds));
