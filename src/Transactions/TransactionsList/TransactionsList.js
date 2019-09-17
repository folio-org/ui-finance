import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router-dom/withRouter';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  baseManifest,
  FolioFormattedTime,
  AmountWithCurrencyField,
  FiltersPane,
  ResultsPane,
  ResetButton,
  SingleSearchForm,
  useLocationFilters,
  useLocationSorting,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
} from '@folio/stripes-acq-components';

import {
  budgetResource,
} from '../../common/resources';

import TransactionsFilters from './TransactionsFilters';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const visibleColumns = ['transactionDate', 'transactionType', 'amount', 'fromFundId', 'toFundId', 'source', 'tagsList'];
const columnMapping = {
  transactionDate: 'Transaction date',
  transactionType: 'Type',
  amount: 'Amount',
  fromFundId: 'From',
  toFundId: 'To',
  source: 'Source',
  tagsList: 'Tags',
};
const resultsFormatter = {
  transactionDate: item => <FolioFormattedTime dateString={get(item, 'metadata.createdDate')} />,
  amount: item => (
    <AmountWithCurrencyField
      amount={item.amount}
      currency={item.currency}
    />
  ),
  tagsList: item => get(item, 'tags.tagList', []).join(', '),
};

const TransactionsList = ({ mutator, resources, history, location }) => {
  const resetData = useCallback(
    () => mutator.resultCount.replace(INITIAL_RESULT_COUNT),
    [mutator.resultCount]
  );
  const onNeedMore = useCallback(
    () => mutator.resultCount.replace(resources.resultCount + RESULT_COUNT_INCREMENT),
    [mutator.resultCount, resources.resultCount],
  );

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
  ] = useLocationFilters(location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData);

  const selectedItem = useCallback(
    (item) => console.log(item),
    [],
  );

  const count = get(resources, 'transactions.other.totalRecords');
  const contentData = get(resources, 'transactions.records', []);
  const isLoading = get(resources, 'transactions.isPending', true);

  return (
    <Paneset>
      <FiltersPane>
        <SingleSearchForm
          applySearch={applySearch}
          changeSearch={changeSearch}
          searchQuery={searchQuery}
          isLoading={isLoading}
          areaLabelId="search.transactions"
        />

        <ResetButton
          id="reset-transactions-filters"
          reset={resetFilters}
          disabled={!location.search}
        />

        <TransactionsFilters
          activeFilters={filters}
          applyFilters={applyFilters}
        />
      </FiltersPane>

      <ResultsPane
        title="Results"
        count={count}
      >
        <MultiColumnList
          id="transactions"
          ariaLabel="arai label"
          totalCount={count}
          contentData={contentData}
          formatter={resultsFormatter}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          loading={isLoading}
          autosize
          virtualize
          onNeedMoreData={onNeedMore}
          onRowClick={selectedItem}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
        />
      </ResultsPane>
    </Paneset>
  );
};

TransactionsList.manifest = Object.freeze({
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  budget: budgetResource,
  transactions: {
    ...baseManifest,
    path: (queryParams, pathComponents, resourceData, logger, props) => {
      const budget = get(props, ['resources', 'budget', 'records', 0]);

      if (budget) {
        return 'finance-storage/transactions';
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

TransactionsList.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(TransactionsList));
