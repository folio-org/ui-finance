import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router-dom/withRouter';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  Paneset,
  Pane,
} from '@folio/stripes/components';
import {
  baseManifest,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
  LoadingPane,
} from '@folio/stripes-acq-components';

import {
  budgetResource,
  fundsResource,
} from '../../common/resources';
import {
  BUDGET_ROUTE,
  BUDGET_VIEW_ROUTE,
  TRANSACTIONS_API,
} from '../../common/const';

import TransactionsList from './TransactionsList';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const TransactionsListContainer = ({ mutator, resources, history, match }) => {
  const onNeedMoreData = useCallback(
    () => mutator.resultCount.replace(resources.resultCount + RESULT_COUNT_INCREMENT),
    [mutator.resultCount, resources.resultCount],
  );
  const resetData = useCallback(
    () => mutator.resultCount.replace(INITIAL_RESULT_COUNT),
    [mutator.resultCount]
  );
  const closePane = useCallback(
    () => {
      history.push(`${BUDGET_ROUTE}${match.params.budgetId}${BUDGET_VIEW_ROUTE}`);
    },
    [history, match.params.budgetId],
  );

  const isLoading = !(
    get(resources, ['budget', 'hasLoaded']) && get(resources, ['fundsTransactionsList', 'hasLoaded'])
  );
  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane onClose={closePane} />
      </Paneset>
    );
  }

  return (
    <div data-test-transactions-list>
      <Paneset>
        <Pane
          paneTitle={get(resources, 'budget.records.0.name')}
          defaultWidth="100%"
          padContent={false}
          onClose={closePane}
          dismissible
        >
          <TransactionsList
            onNeedMoreData={onNeedMoreData}
            resetData={resetData}
            funds={get(resources, 'fundsTransactionsList.records')}
            transactionsCount={get(resources, 'transactions.other.totalRecords')}
            isLoadingTransactions={get(resources, 'transactions.isPending', true)}
            transactions={get(resources, 'transactions.records')}
          />
        </Pane>
      </Paneset>
    </div>
  );
};

TransactionsListContainer.manifest = Object.freeze({
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  budget: budgetResource,
  fundsTransactionsList: fundsResource,
  transactions: {
    ...baseManifest,
    path: (queryParams, pathComponents, resourceData, logger, props) => {
      const budget = get(props, ['resources', 'budget', 'records', 0]);

      if (budget) {
        return TRANSACTIONS_API;
      }

      return null;
    },
    records: 'transactions',
    perRequest: RESULT_COUNT_INCREMENT,
    recordsRequired: '%{resultCount}',
    GET: {
      params: {
        query: (queryParams, pathComponents, resourceValues) => {
          const budget = get(resourceValues, ['budget', 'records', 0]);

          if (!budget) return null;

          const fundId = budget.fundId;
          const fiscalYearId = budget.fiscalYearId;
          const requiredFilterQuery =
            `(fiscalYearId=${fiscalYearId} and (fromFundId=${fundId} or toFundId=${fundId}))`;
          const filterQuery = buildFilterQuery(queryParams, (query) => `(id=${query}* or amount=${query}*)`);

          return connectQuery(
            filterQuery ? `${requiredFilterQuery} and ${filterQuery}` : requiredFilterQuery,
            buildSortingQuery(queryParams),
          );
        },
      }
    }
  },
});

TransactionsListContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(stripesConnect(TransactionsListContainer));
