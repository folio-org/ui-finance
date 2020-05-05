import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get, sortBy } from 'lodash';

import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FiltersPane,
  FolioFormattedTime,
  NoResultsMessage,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useLocationFilters,
  useLocationSorting,
  useToggle,
} from '@folio/stripes-acq-components';

import {
  BUDGET_ROUTE,
  BUDGET_TRANSACTIONS_ROUTE,
} from '../../common/const';
import TransactionDetails from '../TransactionDetails';

import TransactionsFilters from './TransactionsFilters';

const resultsPaneTitle = <FormattedMessage id="ui-finance.budget.transactions" />;
const visibleColumns = ['transactionDate', 'transactionType', 'amount', 'fromFundId', 'toFundId', 'source', 'tagsList'];
const sortableFields = ['transactionDate', 'transactionType', 'amount', 'source'];
const columnMapping = {
  transactionDate: <FormattedMessage id="ui-finance.transaction.date" />,
  transactionType: <FormattedMessage id="ui-finance.transaction.type" />,
  amount: <FormattedMessage id="ui-finance.transaction.amount" />,
  fromFundId: <FormattedMessage id="ui-finance.transaction.from" />,
  toFundId: <FormattedMessage id="ui-finance.transaction.to" />,
  source: <FormattedMessage id="ui-finance.transaction.source" />,
  tagsList: <FormattedMessage id="ui-finance.transaction.tags" />,
};
const getResultsFormatter = (funds) => {
  const fundsMap = funds.reduce((acc, fund) => {
    acc[fund.id] = fund.code;

    return acc;
  }, {});

  return ({
    transactionDate: item => <FolioFormattedTime dateString={get(item, 'metadata.createdDate')} />,
    transactionType: item => <FormattedMessage id={`ui-finance.transaction.type.${item.transactionType}`} />,
    amount: item => (
      <AmountWithCurrencyField
        amount={item.amount}
        currency={item.currency}
      />
    ),
    fromFundId: item => fundsMap[item.fromFundId],
    toFundId: item => fundsMap[item.toFundId],
    source: item => <FormattedMessage id={`ui-finance.transaction.source.${item.source}`} />,
    tagsList: item => sortBy(get(item, 'tags.tagList', [])).join(', '),
  });
};

const TransactionsList = ({
  onNeedMoreData,
  resetData,
  funds,
  transactionsCount,
  isLoadingTransactions,
  transactions,
  history,
  location,
  match,
}) => {
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
  ] = useLocationSorting(location, history, resetData, sortableFields);
  const [isFiltersOpened, toggleFilters] = useToggle(true);

  const selectedItem = useCallback(
    (e, meta) => {
      history.push({
        pathname: `${BUDGET_ROUTE}${match.params.budgetId}${BUDGET_TRANSACTIONS_ROUTE}${meta.id}/view`,
        search: location.search,
      });
    },
    [history, match.params.budgetId, location.search],
  );

  const resultsFormatter = useMemo(() => getResultsFormatter(funds), [funds]);
  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoadingTransactions}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  return (
    <Paneset>
      {isFiltersOpened && (
        <FiltersPane toggleFilters={toggleFilters}>
          <SingleSearchForm
            applySearch={applySearch}
            changeSearch={changeSearch}
            searchQuery={searchQuery}
            isLoading={isLoadingTransactions}
            ariaLabelId="ui-finance.search"
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
      )}

      <ResultsPane
        title={resultsPaneTitle}
        count={transactionsCount}
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
      >
        <MultiColumnList
          id="transactions-list"
          totalCount={transactionsCount}
          contentData={isLoadingTransactions ? [] : transactions}
          formatter={resultsFormatter}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          loading={isLoadingTransactions}
          autosize
          virtualize
          onNeedMoreData={onNeedMoreData}
          onRowClick={selectedItem}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
          isEmptyMessage={resultsStatusMessage}
          pagingType="click"
          hasMargin
        />
      </ResultsPane>

      <Route
        path={`${match.path}/:id/view`}
        component={TransactionDetails}
      />
    </Paneset>
  );
};

TransactionsList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  transactionsCount: PropTypes.number,
  isLoadingTransactions: PropTypes.bool,
  transactions: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

TransactionsList.defaultProps = {
  transactionsCount: 0,
  isLoadingTransactions: false,
  transactions: [],
  funds: [],
};

export default withRouter(TransactionsList);
