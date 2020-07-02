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

import { GROUPS_ROUTE } from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';
import CheckPermission from '../../common/CheckPermission';

import { GroupDetailsContainer } from '../GroupDetails';
import GroupsListFilters from './GroupsListFilters';
import {
  searchableIndexes,
} from './GroupsListSearchConfig';
import GroupsListLastMenu from './GroupsListLastMenu';

const resultsPaneTitle = <FormattedMessage id="ui-finance.group" />;
const visibleColumns = ['name', 'code'];
const sortableFields = ['name', 'code'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.groups.list.name" />,
  code: <FormattedMessage id="ui-finance.groups.list.code" />,
};

const GroupsList = ({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  groups,
  groupsCount,
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

  const openGroupDetails = useCallback(
    (e, meta) => {
      history.push({
        pathname: `${GROUPS_ROUTE}/${meta.id}/view`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const renderLastMenu = useCallback(() => <GroupsListLastMenu />, []);
  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  return (
    <Paneset data-test-groups-list>
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
            id="reset-groups-filters"
            reset={resetFilters}
            disabled={!location.search}
          />

          <GroupsListFilters
            activeFilters={filters}
            applyFilters={applyFilters}
          />
        </FiltersPane>
      )}

      <ResultsPane
        title={resultsPaneTitle}
        count={groupsCount}
        renderLastMenu={renderLastMenu}
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
      >
        <MultiColumnList
          id="groups-list"
          totalCount={groupsCount}
          contentData={groups}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          loading={isLoading}
          autosize
          virtualize
          onNeedMoreData={onNeedMoreData}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
          onRowClick={openGroupDetails}
          isEmptyMessage={resultsStatusMessage}
          pagingType="click"
          hasMargin
        />
      </ResultsPane>

      <Route
        path={`${GROUPS_ROUTE}/:id/view`}
        render={() => (
          <CheckPermission perm="ui-finance.group.view">
            <GroupDetailsContainer />
          </CheckPermission>
        )}
      />
    </Paneset>
  );
};

GroupsList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  groupsCount: PropTypes.number,
  isLoading: PropTypes.bool,
  groups: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

GroupsList.defaultProps = {
  groupsCount: 0,
  isLoading: false,
  groups: [],
};

export default withRouter(GroupsList);
