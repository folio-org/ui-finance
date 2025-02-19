import noop from 'lodash/noop';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import {
  IfPermission,
  TitleManager,
} from '@folio/stripes/core';
import {
  FiltersPane,
  getFiltersCount,
  NoResultsMessage,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useFiltersToogle,
  useLocationFilters,
  useRecordsSelect,
  useShowCallout,
  useToggle,
  useUsersBatch,
} from '@folio/stripes-acq-components';
import { PersistedPaneset } from '@folio/stripes/smart-components';

import {
  LEDGERS_ROUTE,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../common/const';
import { useBatchAllocationLogs } from '../hooks';
import { resolveDefaultBackPathname } from '../utils';
import BatchAllocationLogFilters from './BatchAllocationLogsFilters';
import { BatchAllocationLogsList } from './BatchAllocationLogsList';
import { searchableIndexes } from './BatchAllocationLogsSearchConfig';
import { ConfirmDeleteLogModal } from './ConfirmDeleteLogModal';
import { useBatchAllocationLogsMutation } from './useBatchAllocationLogsMutation';
import { useLedgers } from './useLedgers';
import { useGroups } from './useGroups';

export const BatchAllocationLogs = ({
  history,
  location,
  match,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const [isToggleDeleteModal, toggleDeleteModal] = useToggle(false);

  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/batch-allocations/logs/filters');
  const { id: sourceId } = match.params;
  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;
  const backPathname = location.state?.backPathname || resolveDefaultBackPathname(sourceType, sourceId);

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, noop);

  const {
    data: logs,
    isFetching: isFetchingLogs,
    totalRecords: logsCount,
    refetch,
  } = useBatchAllocationLogs();

  const { groups } = useGroups();
  const { ledgers } = useLedgers();

  const groupsOptions = groups.map(({ id, name }) => ({ label: name, value: id }));
  const ledgersOptions = ledgers.map(({ id, name }) => ({ label: name, value: id }));
  const userIdsSet = logs.map(({ metadata: { createdByUserId } }) => createdByUserId);

  const {
    users,
    isLoading: isUsersLoading,
  } = useUsersBatch(userIdsSet);

  const logsWithUsers = logs?.map((log) => ({
    ...log,
    createdByUser: users.find((user) => user.id === log.metadata.createdByUserId) || null,
  })) || [];

  const {
    allRecordsSelected,
    resetAllSelectedRecords,
    selectedRecordsLength,
    selectedRecordsMap,
    selectRecord,
    toggleSelectAll,
  } = useRecordsSelect({ records: logs });

  const renderActionMenu = useCallback(({ onToggle }) => (
    <MenuSection>
      <IfPermission perm="ui-finance.fund-update-logs.delete">
        <Button
          data-testid="delete-log-button"
          buttonStyle="dropdownItem"
          onClick={() => {
            toggleDeleteModal();
            onToggle();
          }}
          disabled={!selectedRecordsLength}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-finance.allocation.batch.logs.actions.delete" />
          </Icon>
        </Button>
      </IfPermission>
    </MenuSection>
  ), [toggleDeleteModal, selectedRecordsLength]);

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isFetchingLogs}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  const { deleteLog } = useBatchAllocationLogsMutation();

  const onDelete = async () => {
    toggleDeleteModal();

    const recordIds = Object.keys(selectedRecordsMap);
    const deletePromises = recordIds.map((id) => deleteLog(id));
    const results = await Promise.allSettled(deletePromises);

    const failedDeletes = results.reduce((acc, result, index) => {
      if (result.status === 'rejected' || result.value?.error) {
        acc.push({ id: recordIds[index] });
      }

      return acc;
    }, []);

    if (failedDeletes.length > 0) {
      failedDeletes.forEach(({ id }) => {
        showCallout({
          messageId: 'ui-finance.allocation.batch.logs.actions.delete.fail',
          type: 'error',
          values: { id },
        });
      });
    } else {
      showCallout({
        messageId: 'ui-finance.allocation.batch.logs.actions.delete.success',
      });
    }

    refetch();
    resetAllSelectedRecords();
  };

  const onClose = useCallback(() => {
    history.push(backPathname);
  }, [history, backPathname]);

  return (
    <>
      <TitleManager record={intl.formatMessage({ id: 'ui-finance.allocation.batch.logs.title' })} />
      <PersistedPaneset
        appId="ui-finance"
        id="batch-allocation-logs-paneset"
      >
        {isFiltersOpened && (
          <FiltersPane
            id="batch-allocation-logs-filters-pane"
            toggleFilters={toggleFilters}
          >
            <SingleSearchForm
              applySearch={applySearch}
              changeSearch={changeSearch}
              searchQuery={searchQuery}
              isLoading={isFetchingLogs}
              ariaLabelId="ui-finance.search"
              searchableIndexes={searchableIndexes}
              changeSearchIndex={changeIndex}
              selectedIndex={searchIndex}
            />

            <ResetButton
              id="reset-batch-allocation-logs-filters"
              reset={resetFilters}
              disabled={!getFiltersCount(filters) || isFetchingLogs}
            />

            <BatchAllocationLogFilters
              activeFilters={filters}
              applyFilters={applyFilters}
              disabled={isFetchingLogs}
              groupsOptions={groupsOptions}
              ledgersOptions={ledgersOptions}
            />
          </FiltersPane>
        )}
        <ResultsPane
          actionMenu={renderActionMenu}
          autosize
          count={logsCount}
          dismissible
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isFetchingLogs}
          onClose={onClose}
          title={intl.formatMessage({ id: 'ui-finance.allocation.batch.logs.title' })}
          toggleFiltersPane={toggleFilters}
        >
          {({ height, width }) => (
            <BatchAllocationLogsList
              allRecordsSelected={allRecordsSelected}
              height={height}
              isLoading={isFetchingLogs || isUsersLoading}
              logs={logsWithUsers}
              selectedRecordsMap={selectedRecordsMap}
              selectRecord={selectRecord}
              totalRecords={logsCount}
              toggleSelectAll={toggleSelectAll}
              isEmptyMessage={resultsStatusMessage}
              width={width}
            />)}
        </ResultsPane>
      </PersistedPaneset>

      <ConfirmDeleteLogModal
        onCancel={toggleDeleteModal}
        onConfirm={onDelete}
        open={isToggleDeleteModal}
      />

    </>
  );
};

BatchAllocationLogs.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};
