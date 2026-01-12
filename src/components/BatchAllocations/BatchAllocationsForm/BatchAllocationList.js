import PropTypes from 'prop-types';
import {
  memo,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import {
  BATCH_ALLOCATION_COLUMNS,
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_LOG_COLUMN_WIDTHS,
} from '../constants';
import { useBatchAllocationFormatter } from '../hooks';
import { getBatchAllocationColumnMapping } from '../utils';

export const BatchAllocationList = memo(({
  fields,
  fiscalYear,
  isLoading,
  mclKey,
  onHeaderClick,
  sortDirection,
  sortedColumn,
}) => {
  const intl = useIntl();
  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  const formatter = useBatchAllocationFormatter(intl, fiscalYear, isLoading);

  return (
    <MultiColumnList
      key={mclKey}
      autosize
      contentData={fields}
      columnMapping={columnMapping}
      columnWidths={BATCH_ALLOCATION_LOG_COLUMN_WIDTHS}
      formatter={formatter}
      loading={isLoading}
      onHeaderClick={onHeaderClick}
      sortDirection={sortDirection}
      sortedColumn={sortedColumn || BATCH_ALLOCATION_FIELDS.fundName}
      totalCount={fields?.length}
      virtualize
      visibleColumns={BATCH_ALLOCATION_COLUMNS}
    />
  );
});

BatchAllocationList.propTypes = {
  fields: PropTypes.object.isRequired,
  fiscalYear: PropTypes.object,
  isLoading: PropTypes.bool,
  mclKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onHeaderClick: PropTypes.func.isRequired,
  sortDirection: PropTypes.string,
  sortedColumn: PropTypes.string,
};
