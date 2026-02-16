import PropTypes from 'prop-types';
import {
  memo,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Layout,
  MultiColumnList,
} from '@folio/stripes/components';
import { AcqEndOfList } from '@folio/stripes-acq-components';

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
    <>
      <MultiColumnList
        contentData={fields}
        columnMapping={columnMapping}
        columnWidths={BATCH_ALLOCATION_LOG_COLUMN_WIDTHS}
        formatter={formatter}
        loading={isLoading}
        onHeaderClick={onHeaderClick}
        sortDirection={sortDirection}
        sortedColumn={sortedColumn || BATCH_ALLOCATION_FIELDS.fundName}
        totalCount={fields?.length}
        visibleColumns={BATCH_ALLOCATION_COLUMNS}
      />
      <Layout className="padding-bottom-gutter">
        <AcqEndOfList totalCount={fields?.length} />
      </Layout>
    </>
  );
});

BatchAllocationList.propTypes = {
  fields: PropTypes.object.isRequired,
  fiscalYear: PropTypes.object,
  isLoading: PropTypes.bool,
  onHeaderClick: PropTypes.func.isRequired,
  sortDirection: PropTypes.string,
  sortedColumn: PropTypes.string,
};
