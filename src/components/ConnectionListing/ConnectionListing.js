import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { orderBy } from 'lodash';

import {
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  AcqEndOfList,
  acqRowFormatter,
  AmountWithCurrencyField,
  ASC_DIRECTION,
  DESC_DIRECTION,
} from '@folio/stripes-acq-components';

const COLUMN_NAME = 'name';
const defaultColumns = [COLUMN_NAME, 'code', 'allocated', 'unavailable', 'available', 'arrow'];
const columnMapping = {
  arrow: null,
  name: <FormattedMessage id="ui-finance.item.name" />,
  code: <FormattedMessage id="ui-finance.item.code" />,
  allocated: <FormattedMessage id="ui-finance.item.allocated" />,
  unavailable: <FormattedMessage id="ui-finance.item.unavailable" />,
  available: <FormattedMessage id="ui-finance.item.available" />,
};
const alignRowProps = { alignLastColToEnd: true };
const sorters = {
  [COLUMN_NAME]: ({ name }) => name?.toLowerCase(),
  'code': ({ code }) => code?.toLowerCase(),
  'allocated': ({ allocated }) => allocated,
  'unavailable': ({ unavailable }) => unavailable,
  'available': ({ available }) => available,
};

const ConnectionListing = ({ items, currency, openItem, visibleColumns }) => {
  const resultsFormatter = useMemo(() => ({
    allocated: item => (
      <AmountWithCurrencyField
        amount={item.allocated}
        currency={currency || item.currency}
      />
    ),
    unavailable: item => (
      <AmountWithCurrencyField
        amount={item.unavailable}
        currency={currency || item.currency}
      />
    ),
    available: item => (
      <AmountWithCurrencyField
        amount={item.available}
        currency={currency || item.currency}
      />
    ),
    arrow: () => <Icon icon="caret-right" />,
  }), [currency]);

  const [sortedColumn, setSortedColumn] = useState(COLUMN_NAME);
  const [sortOrder, setSortOrder] = useState(ASC_DIRECTION);
  const sortedRecords = orderBy(items, sorters[sortedColumn], sortOrder === DESC_DIRECTION ? 'desc' : 'asc');
  const changeSorting = useCallback((event, { name }) => {
    if (!sorters[name]) return;
    if (sortedColumn !== name) {
      setSortedColumn(name);
      setSortOrder(DESC_DIRECTION);
    } else {
      setSortOrder(sortOrder === DESC_DIRECTION ? ASC_DIRECTION : DESC_DIRECTION);
    }
  }, [sortOrder, sortedColumn]);

  return (
    <>
      <MultiColumnList
        columnMapping={columnMapping}
        contentData={sortedRecords}
        formatter={resultsFormatter}
        onHeaderClick={changeSorting}
        onRowClick={openItem}
        rowFormatter={acqRowFormatter}
        rowProps={alignRowProps}
        sortDirection={sortOrder}
        sortedColumn={sortedColumn}
        visibleColumns={visibleColumns}
      />
      <AcqEndOfList totalCount={items?.length} />
    </>
  );
};

ConnectionListing.propTypes = {
  openItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

ConnectionListing.defaultProps = {
  items: [],
  visibleColumns: defaultColumns,
};

export default ConnectionListing;
