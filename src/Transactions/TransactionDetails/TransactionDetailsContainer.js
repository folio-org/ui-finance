import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  baseManifest,
  EXPENSE_CLASSES_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  fiscalYearResource,
  fundsResource,
  transactionByUrlIdResource,
} from '../../common/resources';
import {
  FISCAL_YEARS_API,
} from '../../common/const';
import TransactionDetails from './TransactionDetails';

const TransactionDetailsContainer = ({
  baseUrl,
  history,
  match,
  location,
  mutator,
  fundId,
}) => {
  const transactionId = match.params.id;
  const showCallout = useShowCallout();
  const [transaction, setTransaction] = useState();
  const [transactionFunds, setTransactionFunds] = useState();
  const [fiscalYear, setFiscalYear] = useState();
  const [expenseClass, setExpenseClass] = useState();

  const onClose = useCallback(
    () => {
      history.push({
        pathname: baseUrl,
        search: location.search,
      });
    },
    [location.search, history, baseUrl],
  );

  useEffect(
    () => {
      setTransaction();
      setTransactionFunds();
      setFiscalYear();
      setExpenseClass();

      mutator.transactionDetails.GET()
        .then(transactionResponse => {
          setTransaction(transactionResponse);

          const { fromFundId, toFundId, fiscalYearId, expenseClassId } = transactionResponse;
          const funds = [fromFundId, toFundId].filter(Boolean);
          const fundsQuery = funds.map(id => `id == ${id}`).join(' OR ');

          const fiscalYearPromise = mutator.fiscalYear.GET({
            path: `${FISCAL_YEARS_API}/${fiscalYearId}`,
          });
          const transactionFundsPromise = mutator.transactionFunds.GET({ params: { query: fundsQuery } });
          const expenseClassPromise = expenseClassId
            ? (
              mutator.transactionExpenseClass.GET({
                path: `${EXPENSE_CLASSES_API}/${expenseClassId}`,
              })
            )
            : {};

          return Promise.all([fiscalYearPromise, transactionFundsPromise, expenseClassPromise]);
        })
        .then(([fiscalYearResp, transactionFundsResp, expenseClassResp]) => {
          setFiscalYear(fiscalYearResp);
          setTransactionFunds(transactionFundsResp);
          setExpenseClass(expenseClassResp);
        })
        .catch(() => showCallout({
          messageId: 'ui-finance.transaction.actions.load.error',
          type: 'error',
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactionId],
  );

  const isLoading = !(transaction && transactionFunds && fiscalYear && expenseClass);

  if (isLoading) {
    return <LoadingPane onClose={onClose} dismissible />;
  }

  const fromFund = transactionFunds.find(({ id }) => id === transaction.fromFundId);
  const fromFundName = fromFund && `${fromFund.name} (${fromFund.code})`;
  const toFund = transactionFunds.find(({ id }) => id === transaction.toFundId);
  const toFundName = toFund && `${toFund.name} (${toFund.code})`;

  return (
    <TransactionDetails
      expenseClassName={expenseClass.name}
      fiscalYearCode={fiscalYear.code}
      fromFundName={fromFundName}
      fundId={fundId}
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
  transactionDetails: {
    ...transactionByUrlIdResource,
    accumulate: true,
    fetch: false,
  },
  fiscalYear: {
    ...fiscalYearResource,
    fetch: false,
    accumulate: true,
  },
  transactionExpenseClass: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
});

TransactionDetailsContainer.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  fundId: PropTypes.string.isRequired,
};

export default withRouter(stripesConnect(TransactionDetailsContainer));
