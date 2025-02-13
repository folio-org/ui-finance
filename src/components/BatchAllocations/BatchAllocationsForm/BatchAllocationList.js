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
