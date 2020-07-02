import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  FiltersPane,
  NoResultsMessage,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useLocationFilters,
  useLocationSorting,
  useToggle,
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
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  fiscalYears,
  fiscalYearsCount,
}) => {
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

  const [isFiltersOpened, toggleFilters] = useToggle(true);

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

  return (
    <Paneset data-test-fiscal-years-list>
      {isFiltersOpened && (
        <FiltersPane
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
        title={resultsPaneTitle}
        count={fiscalYearsCount}
        renderLastMenu={renderLastMenu}
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
      >
        <MultiColumnList
          id="fiscal-years-list"
          totalCount={fiscalYearsCount}
          contentData={fiscalYears}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          loading={isLoading}
          autosize
          virtualize
          onNeedMoreData={onNeedMoreData}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
          onRowClick={openFiscalYearDetails}
          isEmptyMessage={resultsStatusMessage}
          pagingType="click"
          hasMargin
        />
      </ResultsPane>

      <Route
        path={`${FISCAL_YEAR_ROUTE}/:id/view`}
        render={() => (
          <CheckPermission perm="ui-finance.fiscal-year.view">
            <FiscalYearDetails />
          </CheckPermission>
        )}
      />
    </Paneset>
  );
};

FiscalYearsList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  fiscalYearsCount: PropTypes.number,
  isLoading: PropTypes.bool,
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

FiscalYearsList.defaultProps = {
  fiscalYearsCount: 0,
  isLoading: false,
  fiscalYears: [],
};

export default withRouter(FiscalYearsList);
