import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AmountWithCurrencyField,
  FrontendSortingMCL,
} from '@folio/stripes-acq-components';

const COLUMN_NAME = 'name';
const defaultColumns = [COLUMN_NAME, 'code', 'allocated', 'unavailable', 'available'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.item.name" />,
  code: <FormattedMessage id="ui-finance.item.code" />,
  allocated: <FormattedMessage id="ui-finance.item.allocated" />,
  netTransfers: <FormattedMessage id="ui-finance.item.netTransfers" />,
  unavailable: <FormattedMessage id="ui-finance.item.unavailable" />,
  available: <FormattedMessage id="ui-finance.item.available" />,
};
const sorters = {
  [COLUMN_NAME]: ({ name }) => name?.toLowerCase(),
  'code': ({ code }) => code?.toLowerCase(),
  'allocated': ({ allocated }) => allocated,
  'netTransfers': ({ netTransfers }) => netTransfers,
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
    netTransfers: item => (
      <AmountWithCurrencyField
        amount={item.netTransfers}
        currency={currency || item.currency}
        showBrackets={item.netTransfers < 0}
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
  }), [currency]);

  return (
    <FrontendSortingMCL
      columnMapping={columnMapping}
      contentData={items}
      formatter={resultsFormatter}
      hasArrow
      onRowClick={openItem}
      sortedColumn={COLUMN_NAME}
      sorters={sorters}
      visibleColumns={visibleColumns}
    />
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
