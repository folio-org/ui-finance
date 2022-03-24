import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

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
  PrevNextPagination,
  ResetButton,
  RESULT_COUNT_INCREMENT,
  ResultsPane,
  SingleSearchForm,
  useFiltersToogle,
  useItemToView,
  useLocationFilters,
  useLocationSorting,
} from '@folio/stripes-acq-components';

import { FISCAL_YEAR_ROUTE } from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';
import CheckPermission from '../../common/CheckPermission';

import FiscalYearDetails from '../FiscalYearDetails';
import FiscalYearsListFilter from './FiscalYearsListFilter';
import {
  searchableIndexes,
} from './FiscalYearsListSearchConfig';
import FiscalYearsListLastMenu from './FiscalYearsListLastMenu';

const resultsPaneTitle = <FormattedMessage id="ui-finance.fiscalyear" />;
const visibleColumns = ['name', 'code', 'description'];
const sortableFields = ['name', 'code', 'description'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.fiscalYear.list.name" />,
  code: <FormattedMessage id="ui-finance.fiscalYear.list.code" />,
  description: <FormattedMessage id="ui-finance.fiscalYear.list.description" />,
};

const FiscalYearsList = ({
  isLoading,
  onNeedMoreData,
  resetData,
  fiscalYears,
  fiscalYearsCount,
  pagination,
}) => {
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();
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
  ] = useLocationSorting(location, history, resetData, sortableFields);

  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/fiscalYear/filters');
  const { itemToView, setItemToView, deleteItemToView } = useItemToView('fiscal-years-list');

  const openFiscalYearDetails = useCallback(
    (e, meta) => {
      history.push({
        pathname: `${FISCAL_YEAR_ROUTE}/${meta.id}/view`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const renderLastMenu = useCallback(() => <FiscalYearsListLastMenu />, []);
  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-finance.fiscal-year.create')) {
          history.push(`${FISCAL_YEAR_ROUTE}/create`);
        }
      }),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <PersistedPaneset
        appId="ui-finance"
        id="fiscal-year-paneset"
        data-test-fiscal-years-list
      >
        {isFiltersOpened && (
          <FiltersPane
            id="fiscal-year-filters-pane"
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
              id="reset-fiscal-years-filters"
              reset={resetFilters}
              disabled={!location.search}
            />

            <FiscalYearsListFilter
              activeFilters={filters}
              applyFilters={applyFilters}
            />
          </FiltersPane>
        )}

        <ResultsPane
          id="fiscal-year-results-pane"
          autosize
          title={resultsPaneTitle}
          count={fiscalYearsCount}
          renderLastMenu={renderLastMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
        >
          {(({ height, width }) => (
            <>
              <MultiColumnList
                id="fiscal-years-list"
                totalCount={fiscalYearsCount}
                contentData={fiscalYears}
                visibleColumns={visibleColumns}
                columnMapping={columnMapping}
                loading={isLoading}
                onNeedMoreData={onNeedMoreData}
                onRowClick={openFiscalYearDetails}
                sortOrder={sortingField}
                sortDirection={sortingDirection}
                onHeaderClick={changeSorting}
                isEmptyMessage={resultsStatusMessage}
                hasMargin
                pageAmount={RESULT_COUNT_INCREMENT}
                pagingType="none"
                height={height - PrevNextPagination.HEIGHT}
                width={width}
                itemToView={itemToView}
                onMarkPosition={setItemToView}
                onResetMark={deleteItemToView}
              />
              {fiscalYears.length > 0 && (
                <PrevNextPagination
                  {...pagination}
                  totalCount={fiscalYearsCount}
                  disabled={isLoading}
                  onChange={onNeedMoreData}
                />
              )}
            </>
          ))}
        </ResultsPane>

        <Route
          path={`${FISCAL_YEAR_ROUTE}/:id/view`}
          render={() => (
            <CheckPermission perm="ui-finance.fiscal-year.view">
              <FiscalYearDetails />
            </CheckPermission>
          )}
        />
      </PersistedPaneset>
    </HasCommand>
  );
};

FiscalYearsList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  fiscalYearsCount: PropTypes.number,
  isLoading: PropTypes.bool,
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.object.isRequired,
};

FiscalYearsList.defaultProps = {
  fiscalYearsCount: 0,
  isLoading: false,
  fiscalYears: [],
};

export default FiscalYearsList;
