import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes-acq-components';

import {
  fiscalYearResource,
  fundsResource,
  transactionsResource,
  transactionByUrlIdResource,
} from '../../common/resources';
import { FISCAL_YEARS_API } from '../../common/const';
import TransactionDetails from './TransactionDetails';

const TransactionDetailsContainer = ({
  history,
  match,
  mutator,
  resources,
}) => {
  const transactionId = match.params.id;
  const transaction = get(resources, ['transactionDetails', 'records', '0']);
  const onClose = history.goBack;

  useEffect(
    () => {
      mutator.transactionFunds.reset();
      mutator.transactionDetails.reset();
      mutator.fiscalYear.reset();
      mutator.transactionDetails.GET()
        .then(({ fiscalYearId, fromFundId, toFundId }) => {
          mutator.fiscalYearId.replace(fiscalYearId);
          mutator.fiscalYear.GET();

          const fundsQuery = [fromFundId, toFundId].map(fundId => `id == ${fundId}`).join(' OR ');
          mutator.transactionFunds.GET({ params: { query: fundsQuery } });
        })
        .catch(() => {
          history.goBack();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactionId]
  );

  const isLoading = !(
    get(resources, ['transactionDetails', 'hasLoaded']) &&
    get(resources, ['fiscalYear', 'hasLoaded']) &&
    get(resources, ['transactionFunds', 'hasLoaded'])
  );

  if (isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  const fiscalYearCode = get(resources, 'fiscalYear.records.0.code');
  const fromFund = get(resources, 'transactionFunds.records', []).find(({ id }) => id === transaction.fromFundId);
  const fromFundName = fromFund && `${fromFund.name} (${fromFund.code})`;
  const toFund = get(resources, 'transactionFunds.records', []).find(({ id }) => id === transaction.toFundId);
  const toFundName = toFund && `${toFund.name} (${toFund.code})`;

  return (
    <TransactionDetails
      fiscalYearCode={fiscalYearCode}
      fromFundName={fromFundName}
      onClose={onClose}
      toFundName={toFundName}
      transaction={transaction}
    />
  );
};

TransactionDetailsContainer.manifest = Object.freeze({
  transactionFunds: {
    ...fundsResource,
    fetch: false,
    accumulate: true,
  },
  transactions: transactionsResource,
  fiscalYearId: {},
  transactionDetails: {
    ...transactionByUrlIdResource,
    accumulate: true,
  },
  fiscalYear: {
    ...fiscalYearResource,
    fetch: false,
    accumulate: true,
    path: `${FISCAL_YEARS_API}/%{fiscalYearId}`,
  }
});

TransactionDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(TransactionDetailsContainer));
