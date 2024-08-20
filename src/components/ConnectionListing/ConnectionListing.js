import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FrontendSortingMCL,
} from '@folio/stripes-acq-components';

const COLUMN_NAME = 'name';
const COLUMN_REMOVE_ITEM = 'removeItem';
const defaultColumns = [COLUMN_NAME, 'code', 'allocated', 'unavailable', 'available'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.item.name" />,
  code: <FormattedMessage id="ui-finance.item.code" />,
  allocated: <FormattedMessage id="ui-finance.item.allocated" />,
  netTransfers: <FormattedMessage id="ui-finance.item.netTransfers" />,
  unavailable: <FormattedMessage id="ui-finance.item.unavailable" />,
  available: <FormattedMessage id="ui-finance.item.available" />,
  removeItem: null,
};
const sorters = {
  [COLUMN_NAME]: ({ name }) => name?.toLowerCase(),
  'code': ({ code }) => code?.toLowerCase(),
  'allocated': ({ allocated }) => allocated,
  'netTransfers': ({ netTransfers }) => netTransfers,
  'unavailable': ({ unavailable }) => unavailable,
  'available': ({ available }) => available,
};

const ConnectionListing = ({
  items,
  currency,
  openItem,
  visibleColumns,
  onRemoveItem,
  columnIdPrefix,
}) => {
  const intl = useIntl();
  const isRemovable = Boolean(onRemoveItem);
  const _visibleColumns = isRemovable ? [...visibleColumns, COLUMN_REMOVE_ITEM] : visibleColumns;
  const rowProps = isRemovable ? { interactive: true, alignLastColToEnd: true } : {};
  const resultsFormatter = useMemo(() => ({
    [COLUMN_NAME]: (item) => (<span data-testid="nameColumn">{item[COLUMN_NAME]}</span>),
    allocated: item => (
      <AmountWithCurrencyField
        amount={item.allocated}
        currency={currency || item.currency}
        showBrackets={item.allocated < 0}
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
        showBrackets={item.unavailable < 0}
      />
    ),
    available: item => (
      <AmountWithCurrencyField
        amount={item.available}
        currency={currency || item.currency}
        showBrackets={item.available < 0}
      />
    ),
    [COLUMN_REMOVE_ITEM]: item => (
      <Button
        align="end"
        aria-label={intl.formatMessage({ id: 'ui-finance.actions.remove' })}
        buttonStyle="fieldControl"
        type="button"
        onClick={(e) => onRemoveItem(e, item)}
        id="remove-item-button"
      >
        <Icon icon="times-circle" />
      </Button>
    ),
  }), [currency, intl, onRemoveItem]);

  return (
    <FrontendSortingMCL
      columnMapping={columnMapping}
      contentData={items}
      formatter={resultsFormatter}
      hasArrow={!isRemovable}
      onRowClick={openItem}
      sortedColumn={COLUMN_NAME}
      sorters={sorters}
      visibleColumns={_visibleColumns}
      columnIdPrefix={columnIdPrefix}
      {...rowProps}
    />
  );
};

ConnectionListing.propTypes = {
  openItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  onRemoveItem: PropTypes.func,
  columnIdPrefix: PropTypes.string,
};

ConnectionListing.defaultProps = {
  items: [],
  visibleColumns: defaultColumns,
  columnIdPrefix: '',
};

export default ConnectionListing;
