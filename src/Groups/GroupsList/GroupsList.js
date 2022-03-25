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
  isLoading,
  onNeedMoreData,
  resetData,
  groups,
  groupsCount,
  pagination,
}) => {
  const history = useHistory();
  const location = useLocation();
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
  ] = useLocationSorting(location, history, resetData, sortableFields);

  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/group/filters');
  const { itemToView, setItemToView, deleteItemToView } = useItemToView('groups-list');

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

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-finance.group.create')) {
          history.push(`${GROUPS_ROUTE}/create`);
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
        id="group-paneset"
        data-test-groups-list
      >
        {isFiltersOpened && (
          <FiltersPane
            id="group-filters-pane"
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
          id="group-results-pane"
          autosize
          title={resultsPaneTitle}
          count={groupsCount}
          renderLastMenu={renderLastMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
        >
          {(({ height, width }) => (
            <>
              <MultiColumnList
                id="groups-list"
                totalCount={groupsCount}
                contentData={groups}
                visibleColumns={visibleColumns}
                columnMapping={columnMapping}
                loading={isLoading}
                onNeedMoreData={onNeedMoreData}
                onRowClick={openGroupDetails}
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
              {groups.length > 0 && (
                <PrevNextPagination
                  {...pagination}
                  totalCount={groupsCount}
                  disabled={isLoading}
                  onChange={onNeedMoreData}
                />
              )}
            </>
          ))}
        </ResultsPane>

        <Route
          path={`${GROUPS_ROUTE}/:id/view`}
          render={() => (
            <CheckPermission perm="ui-finance.group.view">
              <GroupDetailsContainer />
            </CheckPermission>
          )}
        />
      </PersistedPaneset>
    </HasCommand>
  );
};

GroupsList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  groupsCount: PropTypes.number,
  isLoading: PropTypes.bool,
  groups: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.object,
};

GroupsList.defaultProps = {
  groupsCount: 0,
  isLoading: false,
  groups: [],
};

export default GroupsList;
