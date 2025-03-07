import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import {
  BATCH_ALLOCATION_LOG_COLUMNS,
  BATCH_ALLOCATION_LOGS_COLUMNS_WIDTHS,
} from './constants';
import {
  getLogsListColumnMapping,
  getResultsListFormatter,
} from './utils';

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
  const match = useRouteMatch();
  const location = useLocation();

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
      intl,
      path: match.path,
      locationSearch: location.search,
      locationState: location.state,
      disabled: isLoading,
      selectRecord,
      selectedRecordsMap,
    });
  }, [
    intl,
    isLoading,
    location.search,
    location.state,
    match.path,
    selectRecord,
    selectedRecordsMap,
  ]);

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={logs}
      columnWidths={BATCH_ALLOCATION_LOGS_COLUMNS_WIDTHS}
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
  allRecordsSelected: PropTypes.bool.isRequired,
  height: PropTypes.number,
  isEmptyMessage: PropTypes.node,
  isLoading: PropTypes.bool,
  logs: PropTypes.arrayOf(PropTypes.object),
  selectedRecordsMap: PropTypes.object,
  selectRecord: PropTypes.func.isRequired,
  totalRecords: PropTypes.number,
  toggleSelectAll: PropTypes.func.isRequired,
  width: PropTypes.number,
};
