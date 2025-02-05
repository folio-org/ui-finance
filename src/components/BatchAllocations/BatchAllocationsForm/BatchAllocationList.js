import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import {
  BATCH_ALLOCATION_COLUMNS,
  BATCH_ALLOCATION_FIELDS,
} from '../constants';
import { useBatchAllocationFormatter } from '../hooks';
import { getBatchAllocationColumnMapping } from './utils';

export const BatchAllocationList = ({
  fields,
  props: {
    onHeaderClick,
    sortDirection,
    sortedColumn,
  },
}) => {
  const intl = useIntl();
  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  const formatter = useBatchAllocationFormatter(intl);

  return (
    <MultiColumnList
      contentData={fields.value}
      columnMapping={columnMapping}
      formatter={formatter}
      onHeaderClick={onHeaderClick}
      sortDirection={sortDirection}
      sortedColumn={sortedColumn || BATCH_ALLOCATION_FIELDS.fundName}
      visibleColumns={BATCH_ALLOCATION_COLUMNS}
    />
  );
};

BatchAllocationList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    onHeaderClick: PropTypes.func.isRequired,
    sortDirection: PropTypes.string,
    sortedColumn: PropTypes.string,
  }).isRequired,
};
