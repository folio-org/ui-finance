import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import {
  FormattedMessage,
} from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  checkScope,
  HasCommand,
  MultiColumnList,
} from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  handleKeyCommand,
  NoResultsMessage,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  PrevNextPagination,
  useFiltersReset,
  useFiltersToogle,
  useLocationFilters,
  useLocationSorting,
  useItemToView,
} from '@folio/stripes-acq-components';

import { LEDGERS_ROUTE } from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';
import CheckPermission from '../../common/CheckPermission';
import LedgerListFilters from './LedgerListFilters';
import {
  searchableIndexes,
} from './LedgerListSearchConfig';
import LedgerDetailsContainer from '../LedgerDetails';
import LedgerListLastMenu from './LedgerListLastMenu';

const title = <FormattedMessage id="ui-finance.ledger" />;
const visibleColumns = ['name', 'code'];
const columnMapping = {
  'name': <FormattedMessage id="ui-finance.ledger.name" />,
  'code': <FormattedMessage id="ui-finance.ledger.code" />,
};

const LedgerList = ({
  ledgers,
  history,
  isLoading,
  onNeedMoreData,
  ledgersCount,
  location,
  resetData,
  pagination,
  refreshList,
}) => {
  const stripes = useStripes();
  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData);

  useFiltersReset(resetFilters);

  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/ledger/filters');

  const renderLastMenu = useCallback(() => <LedgerListLastMenu />, []);

  const openLedgerDetails = useCallback(
    (e, meta) => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${meta.id}/view`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-finance.ledger.create')) {
          history.push(`${LEDGERS_ROUTE}/create`);
        }
      }),
    },
  ];

  const { itemToView, setItemToView, deleteItemToView } = useItemToView('ledgers-list');

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <PersistedPaneset
        appId="ui-receiving"
        id="invoice-paneset"
        data-test-ledgers-list
      >
        {isFiltersOpened && (
          <FiltersPane
            id="ledger-filters-pane"
            toggleFilters={toggleFilters}
            width="350px"
          >
            <FinanceNavigation />
            <SingleSearchForm
              applySearch={applySearch}
              changeSearch={changeSearch}
              searchQuery={searchQuery}
              searchableIndexes={searchableIndexes}
              changeSearchIndex={changeIndex}
              selectedIndex={searchIndex}
              isLoading={isLoading}
              ariaLabelId="ui-finance.search"
            />

            <ResetButton
              id="reset-ledgers-filters"
              reset={resetFilters}
              disabled={!location.search}
            />
            <LedgerListFilters
              activeFilters={filters}
              applyFilters={applyFilters}
            />
          </FiltersPane>
        )}
        <ResultsPane
          id="ledger-results-pane"
          autosize
          title={title}
          count={ledgersCount}
          renderLastMenu={renderLastMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
        >
          {({ height, width }) => (
            <>
              <MultiColumnList
                id="ledgers-list"
                totalCount={ledgersCount}
                contentData={ledgers}
                visibleColumns={visibleColumns}
                columnMapping={columnMapping}
                loading={isLoading}
                onNeedMoreData={onNeedMoreData}
                sortOrder={sortingField}
                sortDirection={sortingDirection}
                onHeaderClick={changeSorting}
                onRowClick={openLedgerDetails}
                isEmptyMessage={resultsStatusMessage}
                pagingType="none"
                hasMargin
                height={height - PrevNextPagination.HEIGHT}
                width={width}
                itemToView={itemToView}
                onMarkPosition={setItemToView}
                onResetMark={deleteItemToView}
              />
              {ledgers?.length > 0 && (
                <PrevNextPagination
                  {...pagination}
                  totalCount={ledgersCount}
                  disabled={isLoading}
                  onChange={onNeedMoreData}
                />
              )}
            </>
          )}
        </ResultsPane>
        <Route
          path="/finance/ledger/:id/view"
          render={() => (
            <CheckPermission perm="ui-finance.ledger.view">
              <LedgerDetailsContainer refreshList={refreshList} />
            </CheckPermission>
          )}
        />
      </PersistedPaneset>
    </HasCommand>
  );
};

LedgerList.propTypes = {
  ledgers: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  ledgersCount: PropTypes.number,
  resetData: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  pagination: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
};

export default withRouter(LedgerList);
