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
  ResultsPane,
  ResetButton,
  SingleSearchForm,
  useLocationFilters,
  useLocationSorting,
  useToggle,
} from '@folio/stripes-acq-components';

import { FUNDS_ROUTE } from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';

import { FundDetailsContainer } from '../FundDetails';
import { FundsListFiltersContainer } from './FundsListFilters';
import {
  searchableIndexes,
} from './FundsListSearchConfig';
import FundsListLastMenu from './FundsListLastMenu';

const resultsPaneTitle = <FormattedMessage id="ui-finance.fund" />;
const visibleColumns = ['name', 'code', 'fundStatus', 'ledger'];
const sortableFields = ['name', 'code', 'fundStatus'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.fund.list.name" />,
  code: <FormattedMessage id="ui-finance.fund.list.code" />,
  fundStatus: <FormattedMessage id="ui-finance.fund.list.status" />,
  ledger: <FormattedMessage id="ui-finance.fund.list.ledger" />,
};

const FundsList = ({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  funds,
  fundsCount,
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

  const openFundDetails = useCallback(
    (e, meta) => {
      history.push({
        pathname: `${FUNDS_ROUTE}/view/${meta.id}`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const renderLastMenu = useCallback(() => <FundsListLastMenu />, []);

  return (
    <Paneset data-test-funds-list>
      {isFiltersOpened && (
        <FiltersPane width="350px">
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
            id="reset-funds-filters"
            reset={resetFilters}
            disabled={!location.search}
          />

          <FundsListFiltersContainer
            activeFilters={filters}
            applyFilters={applyFilters}
          />
        </FiltersPane>
      )}

      <ResultsPane
        title={resultsPaneTitle}
        count={fundsCount}
        renderLastMenu={renderLastMenu}
        toggleFiltersPane={toggleFilters}
        filters={!isFiltersOpened && filters}
      >
        <MultiColumnList
          id="funds-list"
          totalCount={fundsCount}
          contentData={funds}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          loading={isLoading}
          autosize
          virtualize
          onNeedMoreData={onNeedMoreData}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
          onRowClick={openFundDetails}
        />
      </ResultsPane>

      <Route
        path={`${FUNDS_ROUTE}/view/:id`}
        component={FundDetailsContainer}
      />
    </Paneset>
  );
};

FundsList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  fundsCount: PropTypes.number,
  isLoading: PropTypes.bool,
  funds: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

FundsList.defaultProps = {
  fundsCount: 0,
  isLoading: false,
  funds: [],
};

export default withRouter(FundsList);