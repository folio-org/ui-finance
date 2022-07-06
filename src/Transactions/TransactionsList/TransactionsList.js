import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { get, sortBy } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  DESC_DIRECTION,
  FiltersPane,
  FolioFormattedTime,
  NoResultsMessage,
  PrevNextPagination,
  ResetButton,
  RESULT_COUNT_INCREMENT,
  ResultsPane,
  SingleSearchForm,
  SORTING_DIRECTION_PARAMETER,
  SORTING_PARAMETER,
  useFiltersToogle,
  useItemToView,
  useLocationFilters,
  useLocationSorting,
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
  fundId,
  pagination,
}) => {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
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
  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/transaction/filters');
  const { itemToView, setItemToView, deleteItemToView } = useItemToView('transactions-list');

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
    <PersistedPaneset
      isRoot
      appId="ui-finance"
      id="transaction-paneset"
    >
      {isFiltersOpened && (
        <FiltersPane
          id="transaction-filters-pane"
          toggleFilters={toggleFilters}
        >
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
        id="transaction-results-pane"
        autosize
        title={resultsPaneTitle}
        count={transactionsCount}
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
        isLoading={isLoadingTransactions}
      >
        {(({ height, width }) => (
          <>
            <MultiColumnList
              id="transactions-list"
              totalCount={transactionsCount}
              contentData={transactions}
              formatter={resultsFormatter}
              visibleColumns={visibleColumns}
              columnMapping={columnMapping}
              loading={isLoadingTransactions}
              onNeedMoreData={onNeedMoreData}
              onRowClick={selectedItem}
              sortOrder={sortingField}
              sortDirection={sortingDirection}
              onHeaderClick={changeSorting}
              isEmptyMessage={resultsStatusMessage}
              hasMargin
              nonInteractiveHeaders={nonInteractiveHeaders}
              pageAmount={RESULT_COUNT_INCREMENT}
              pagingType="none"
              height={height - PrevNextPagination.HEIGHT}
              width={width}
              itemToView={itemToView}
              onMarkPosition={setItemToView}
              onResetMark={deleteItemToView}
            />
            {transactions.length > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={transactionsCount}
                disabled={isLoadingTransactions}
                onChange={onNeedMoreData}
              />
            )}
          </>
        ))}
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
    </PersistedPaneset>
  );
};

TransactionsList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  transactionsCount: PropTypes.number,
  isLoadingTransactions: PropTypes.bool,
  transactions: PropTypes.arrayOf(PropTypes.object),
  fundId: PropTypes.string.isRequired,
  pagination: PropTypes.object.isRequired,
};

TransactionsList.defaultProps = {
  transactionsCount: 0,
  isLoadingTransactions: false,
  transactions: [],
  funds: [],
};

export default TransactionsList;
