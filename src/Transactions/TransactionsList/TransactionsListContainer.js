import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingView,
  Paneset,
  Pane,
} from '@folio/stripes/components';
import {
  baseManifest,
  buildArrayFieldQuery,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
} from '@folio/stripes-acq-components';

import {
  budgetResource,
  fundsResource,
} from '../../common/resources';
import {
  TRANSACTIONS_API,
} from '../../common/const';
import { FILTERS } from './TransactionsFilters/TransactionsFilters';
import TransactionsList from './TransactionsList';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const customFiltersMap = {
  [FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.TAGS]),
};

export const TransactionsListContainer = ({ mutator, resources, closePane, match }) => {
  const budgetId = match.params.budgetId;
  const onNeedMoreData = useCallback(
    () => mutator.resultCount.replace(resources.resultCount + RESULT_COUNT_INCREMENT),
    [mutator.resultCount, resources.resultCount],
  );
  const resetData = useCallback(
    () => mutator.resultCount.replace(INITIAL_RESULT_COUNT),
    [mutator.resultCount],
  );
  const budget = resources?.budget?.records?.[0];
  const isLoading = !(
    budgetId === budget?.id && resources?.fundsTransactionsList?.hasLoaded
  );

  if (isLoading) {
    return (
      <LoadingView dismissible onClose={closePane} />

    );
  }

  return (
    <div data-test-transactions-list>
      <Paneset>
        <Pane
          paneTitle={budget?.name}
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
            fundId={budget.fundId}
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
    path: (queryParams, { budgetId }, resourceData, logger, props) => {
      const budget = get(props, ['resources', 'budget', 'records', 0]);

      if (budget && budget.id === budgetId) {
        return TRANSACTIONS_API;
      }

      return null;
    },
    records: 'transactions',
    perRequest: RESULT_COUNT_INCREMENT,
    recordsRequired: '%{resultCount}',
    GET: {
      params: {
        query: (queryParams, { budgetId }, resourceValues) => {
          const budget = get(resourceValues, ['budget', 'records', 0]);

          if (budget?.id !== budgetId) return null;

          const fundId = budget.fundId;
          const fiscalYearId = budget.fiscalYearId;
          const requiredFilterQuery =
            `(fiscalYearId=${fiscalYearId} and (fromFundId=${fundId} or toFundId=${fundId}))`;
          const filterQuery = buildFilterQuery(queryParams, (query) => `(id=${query}* or amount=${query}*)`, customFiltersMap);

          return connectQuery(
            filterQuery ? `${requiredFilterQuery} and ${filterQuery}` : requiredFilterQuery,
            buildSortingQuery(queryParams) || 'sortby transactionDate/sort.descending',
          );
        },
      },
    },
  },
});

TransactionsListContainer.propTypes = {
  closePane: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(stripesConnect(TransactionsListContainer));
