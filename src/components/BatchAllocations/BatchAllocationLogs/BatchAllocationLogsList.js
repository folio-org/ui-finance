import noop from 'lodash/noop';
import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Icon,
  LoadingView,
  MultiColumnList,
  MenuSection,
} from '@folio/stripes/components';
import {
  IfPermission,
  TitleManager,
} from '@folio/stripes/core';
import {
  ResultsPane,
  useFilters,
  useFiltersToogle,
  useRecordsSelect,
  useShowCallout,
  useToggle,
} from '@folio/stripes-acq-components';
import { PersistedPaneset } from '@folio/stripes/smart-components';

import {
  getLogsListColumnMapping,
  getResultsListFormatter,
} from '../utils';
import { BATCH_ALLOCATION_LOG_COLUMNS } from './constants';
import { ConfirmDeleteLogModal } from './ConfirmDeleteLogModal';

export const BatchAllocationLogsList = ({
  dataReset,
  deleteLog,
  isLoading,
  logs,
  onClose,
  totalRecords,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/batch-allocations/logs/filters');
  const [isToggleDeleteModal, toggleDeleteModal] = useToggle();

  const {
    filters,
  } = useFilters(noop);

  const {
    allRecordsSelected,
    resetAllSelectedRecords,
    selectedRecordsLength,
    selectedRecordsMap,
    selectRecord,
    toggleSelectAll,
  } = useRecordsSelect({ records: logs });

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

    dataReset();
    resetAllSelectedRecords();
  };

  const columnMapping = useMemo(() => {
    return getLogsListColumnMapping({
      disabled: isLoading,
      intl,
      isAllSelected: allRecordsSelected,
      selectAll: toggleSelectAll,
    });
  }, [allRecordsSelected, intl, isLoading, toggleSelectAll]);

  const formatter = useMemo(() => {
    return getResultsListFormatter({
      disabled: isLoading,
      intl,
      selectRecord,
      selectedRecordsMap,
    });
  }, [isLoading, intl, selectRecord, selectedRecordsMap]);

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

  const title = <FormattedMessage id="ui-finance.allocation.batch.logs.title" />;

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
        paneTitle={title}
      />
    );
  }

  return (
    <>
      <TitleManager record={intl.formatMessage({ id: 'ui-finance.allocation.batch.logs.title' })} />
      <PersistedPaneset
        appId="ui-finance"
        id="batch-allocation-logs"
      >
        <ResultsPane
          actionMenu={renderActionMenu}
          autosize
          count={totalRecords}
          dismissible
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
          onClose={onClose}
          title={title}
          toggleFiltersPane={toggleFilters}
        >
          {({ height, width }) => (
            <MultiColumnList
              columnMapping={columnMapping}
              contentData={logs}
              formatter={formatter}
              height={height}
              totalCount={totalRecords}
              visibleColumns={BATCH_ALLOCATION_LOG_COLUMNS}
              width={width}
            />
          )}
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

BatchAllocationLogsList.propTypes = {
  dataReset: PropTypes.func.isRequired,
  deleteLog: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  logs: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
  totalRecords: PropTypes.number,
};
