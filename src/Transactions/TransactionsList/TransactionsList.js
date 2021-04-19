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
  DESC_DIRECTION,
  FiltersPane,
  FolioFormattedTime,
  NoResultsMessage,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  SORTING_DIRECTION_PARAMETER,
  SORTING_PARAMETER,
  useLocationFilters,
  useLocationSorting,
  useToggle,
} from '@folio/stripes-acq-components';

import CheckPermission from '../../common/CheckPermission';
import TransactionDetails from '../TransactionDetails';
import { BracketizeTransactionAmount } from '../BracketizeTransactionAmount';
import TransactionsFilters from './TransactionsFilters';

const COL_TAGS = 'tags.tagList';
const COL_TRANS_DATE = 'metadata.createdDate';
const DEFAULT_SORTING = { [SORTING_PARAMETER]: COL_TRANS_DATE, [SORTING_DIRECTION_PARAMETER]: DESC_DIRECTION };
const resultsPaneTitle = <FormattedMessage id="ui-finance.budget.transactions" />;
const visibleColumns = [COL_TRANS_DATE, 'transactionType', 'amount', 'fromFundId', 'toFundId', 'source', COL_TAGS];
const sortableFields = [COL_TRANS_DATE, 'amount', COL_TAGS];
const nonInteractiveHeaders = visibleColumns.filter(col => !sortableFields.includes(col));
const columnMapping = {
  [COL_TRANS_DATE]: <FormattedMessage id="ui-finance.transaction.date" />,
  transactionType: <FormattedMessage id="ui-finance.transaction.type" />,
  amount: <FormattedMessage id="ui-finance.transaction.amount" />,
  fromFundId: <FormattedMessage id="ui-finance.transaction.from" />,
  toFundId: <FormattedMessage id="ui-finance.transaction.to" />,
  source: <FormattedMessage id="ui-finance.transaction.source" />,
  [COL_TAGS]: <FormattedMessage id="ui-finance.transaction.tags" />,
};
const getResultsFormatter = (funds, fundId) => {
  const fundsMap = funds.reduce((acc, fund) => {
    acc[fund.id] = fund.code;

    return acc;
  }, {});

  return ({
    [COL_TRANS_DATE]: item => <FolioFormattedTime dateString={get(item, 'metadata.createdDate')} />,
    transactionType: item => <FormattedMessage id={`ui-finance.transaction.type.${item.transactionType}`} />,
    amount: item => (
      <BracketizeTransactionAmount
        fundId={fundId}
        transaction={item}
      />
    ),
    fromFundId: item => fundsMap[item.fromFundId],
    toFundId: item => fundsMap[item.toFundId],
    source: item => <FormattedMessage id={`ui-finance.transaction.source.${item.source}`} />,
    [COL_TAGS]: item => sortBy(get(item, 'tags.tagList', [])).join(', '),
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
  fundId,
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
  ] = useLocationSorting(location, history, resetData, sortableFields, DEFAULT_SORTING);
  const [isFiltersOpened, toggleFilters] = useToggle(true);

  const selectedItem = useCallback(
    (e, meta) => {
      history.push({
        pathname: `${match.url}/transaction/${meta.id}/view`,
        search: location.search,
      });
    },
    [history, location.search, match.url],
  );

  const resultsFormatter = useMemo(() => getResultsFormatter(funds, fundId), [fundId, funds]);
  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoadingTransactions}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  return (
    <Paneset isRoot>
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
          nonInteractiveHeaders={nonInteractiveHeaders}
        />
      </ResultsPane>

      <Route
        path={`${match.path}/transaction/:id/view`}
        render={() => (
          <CheckPermission perm="ui-finance.fund-budget.view">
            <TransactionDetails
              baseUrl={match.url}
              fundId={fundId}
            />
          </CheckPermission>
        )}
      />
    </Paneset>
  );
};

TransactionsList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object).isRequired,
  transactionsCount: PropTypes.number,
  isLoadingTransactions: PropTypes.bool,
  transactions: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  fundId: PropTypes.string.isRequired,
};

TransactionsList.defaultProps = {
  transactionsCount: 0,
  isLoadingTransactions: false,
  transactions: [],
};

export default withRouter(TransactionsList);
