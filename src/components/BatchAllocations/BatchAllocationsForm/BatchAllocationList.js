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
  props: {
    fiscalYear,
    isLoading,
    onHeaderClick,
    sortDirection,
    sortedColumn,
  },
}) => {
  const intl = useIntl();
  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  const formatter = useBatchAllocationFormatter(intl, fiscalYear, isLoading);

  return (
    <>
      <MultiColumnList
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
    </>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.fields === nextProps.fields
    && prevProps.props.fiscalYear === nextProps.props.fiscalYear
    && prevProps.props.isLoading === nextProps.props.isLoading
    && prevProps.props.sortDirection === nextProps.props.sortDirection
    && prevProps.props.sortedColumn === nextProps.props.sortedColumn
  );
});

BatchAllocationList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    fiscalYear: PropTypes.object,
    isLoading: PropTypes.bool,
    onHeaderClick: PropTypes.func.isRequired,
    sortDirection: PropTypes.string,
    sortedColumn: PropTypes.string,
  }).isRequired,
};
