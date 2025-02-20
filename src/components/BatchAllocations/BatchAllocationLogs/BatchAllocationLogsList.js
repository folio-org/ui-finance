import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import {
  getLogsListColumnMapping,
  getResultsListFormatter,
} from '../utils';
import {
  BATCH_ALLOCATION_LOG_COLUMNS,
  BATCH_ALLOCATION_LOG_FIELDS,
} from './constants';

export const BatchAllocationLogsList = ({
  allRecordsSelected,
  height,
  isEmptyMessage,
  isLoading,
  logs,
  selectedRecordsMap,
  selectRecord,
  totalRecords,
  toggleSelectAll,
  width,
}) => {
  const intl = useIntl();

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

  const COLUMN_WIDTHS = {
    select: '4%',
    [BATCH_ALLOCATION_LOG_FIELDS.jobName]: '26%',
    [BATCH_ALLOCATION_LOG_FIELDS.status]: '12%',
    [BATCH_ALLOCATION_LOG_FIELDS.recordsCount]: '6%',
    [BATCH_ALLOCATION_LOG_FIELDS.createdDate]: '14%',
    [BATCH_ALLOCATION_LOG_FIELDS.updatedDate]: '14%',
    [BATCH_ALLOCATION_LOG_FIELDS.createdByUsername]: '20%',
    [BATCH_ALLOCATION_LOG_FIELDS.jobNumber]: '4%',
  };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={logs}
      columnWidths={COLUMN_WIDTHS}
      formatter={formatter}
      height={height}
      id="batch-allocation-logs-list"
      isEmptyMessage={isEmptyMessage}
      loading={isLoading}
      totalCount={totalRecords}
      visibleColumns={BATCH_ALLOCATION_LOG_COLUMNS}
      width={width}
    />
  );
};

BatchAllocationLogsList.propTypes = {
  allRecordsSelected: PropTypes.bool,
  height: PropTypes.number.isRequired,
  isEmptyMessage: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  logs: PropTypes.arrayOf(PropTypes.object),
  selectedRecordsMap: PropTypes.object.isRequired,
  selectRecord: PropTypes.func.isRequired,
  totalRecords: PropTypes.number.isRequired,
  toggleSelectAll: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};
