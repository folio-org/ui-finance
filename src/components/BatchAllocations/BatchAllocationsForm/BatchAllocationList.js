import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import { AcqEndOfList } from '@folio/stripes-acq-components';

import {
  BATCH_ALLOCATION_COLUMNS,
  BATCH_ALLOCATION_FIELDS,
} from '../constants';
import { useBatchAllocationFormatter } from '../hooks';
import { getBatchAllocationColumnMapping } from './utils';

const COLUMN_WIDTHS = {
  [BATCH_ALLOCATION_FIELDS.fundName]: '10%',
  [BATCH_ALLOCATION_FIELDS.fundStatus]: '8%',
  [BATCH_ALLOCATION_FIELDS.budgetName]: '10%',
  [BATCH_ALLOCATION_FIELDS.budgetStatus]: '8%',
  [BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation]: '6%',
  [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: '10%',
  [BATCH_ALLOCATION_FIELDS.budgetAfterAllocation]: '8%',
  [BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]: '8%',
  [BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]: '8%',
  [BATCH_ALLOCATION_FIELDS.transactionDescription]: '12%',
  [BATCH_ALLOCATION_FIELDS.transactionTag]: '12%',
};

export const BatchAllocationList = ({
  fields,
  props: {
    fiscalYear,
    onHeaderClick,
    sortDirection,
    sortedColumn,
  },
}) => {
  const intl = useIntl();
  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  const formatter = useBatchAllocationFormatter(intl, fiscalYear);

  return (
    <>
      <MultiColumnList
        contentData={fields.value}
        columnMapping={columnMapping}
        columnWidths={COLUMN_WIDTHS}
        formatter={formatter}
        onHeaderClick={onHeaderClick}
        sortDirection={sortDirection}
        sortedColumn={sortedColumn || BATCH_ALLOCATION_FIELDS.fundName}
        visibleColumns={BATCH_ALLOCATION_COLUMNS}
      />
      <AcqEndOfList totalCount={fields.value?.length} />
    </>
  );
};

BatchAllocationList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    fiscalYear: PropTypes.object,
    onHeaderClick: PropTypes.func.isRequired,
    sortDirection: PropTypes.string,
    sortedColumn: PropTypes.string,
  }).isRequired,
};
