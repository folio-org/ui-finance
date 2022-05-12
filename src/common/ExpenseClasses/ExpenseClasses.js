import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isNumber, orderBy } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import {
  AcqEndOfList,
  AmountWithCurrencyField,
  ASC_DIRECTION,
  DESC_DIRECTION,
} from '@folio/stripes-acq-components';

const defaultVisibleColumns = ['expenseClassName', 'encumbered', 'awaitingPayment', 'expended', 'percentageExpended', 'status'];
const columnMapping = {
  expenseClassName: <FormattedMessage id="ui-finance.budget.expenseClasses.expenseClassName" />,
  encumbered: <FormattedMessage id="ui-finance.budget.expenseClasses.encumbered" />,
  awaitingPayment: <FormattedMessage id="ui-finance.budget.expenseClasses.awaitingPayment" />,
  expended: <FormattedMessage id="ui-finance.budget.expenseClasses.expended" />,
  percentageExpended: <FormattedMessage id="ui-finance.budget.expenseClasses.percentageExpended" />,
  status: <FormattedMessage id="ui-finance.budget.expenseClasses.status" />,
};
const getResultsFormatter = currency => ({
  expenseClassName: expenseClass => (<span data-testid="nameColumn">{expenseClass.expenseClassName}</span>),
  encumbered: expenseClass => (
    <AmountWithCurrencyField
      amount={expenseClass.encumbered}
      currency={currency}
    />
  ),
  awaitingPayment: expenseClass => (
    <AmountWithCurrencyField
      amount={expenseClass.awaitingPayment}
      currency={currency}
    />
  ),
  expended: expenseClass => (
    <AmountWithCurrencyField
      amount={expenseClass.expended}
      currency={currency}
    />
  ),
  percentageExpended: expenseClass => (isNumber(expenseClass.percentageExpended)
    ? `${expenseClass.percentageExpended}%`
    : <FormattedMessage id="ui-finance.budget.expenseClasses.percentageExpended.undefined" />
  ),
  status: expenseClass => (
    <FormattedMessage
      id={`ui-finance.budget.expenseClasses.status.${expenseClass.expenseClassStatus}`}
      defaultMessage="-"
    />
  ),
});

const SORTERS = {
  'expenseClassName': ({ expenseClassName }) => expenseClassName?.toLowerCase(),
  'expenseClassStatus': ({ expenseClassStatus }) => expenseClassStatus?.toLowerCase(),
  'expended': ({ expended }) => expended,
  'percentageExpended': ({ percentageExpended }) => percentageExpended,
  'encumbered': ({ encumbered }) => encumbered,
  'awaitingPayment': ({ awaitingPayment }) => awaitingPayment,
};

const ExpenseClasses = ({ currency, expenseClassesTotals, visibleColumns, id, loading }) => {
  const resultsFormatter = useMemo(() => getResultsFormatter(currency), [currency]);
  const [sortedColumn, setSortedColumn] = useState('expenseClassName');
  const [sortOrder, setSortOrder] = useState(ASC_DIRECTION);

  const changeSorting = useCallback((event, { name }) => {
    if (!SORTERS[name]) return;
    if (sortedColumn !== name) {
      setSortedColumn(name);
      setSortOrder(DESC_DIRECTION);
    } else {
      setSortOrder(sortOrder === DESC_DIRECTION ? ASC_DIRECTION : DESC_DIRECTION);
    }
  }, [sortOrder, sortedColumn]);

  if (!expenseClassesTotals) {
    return null;
  }

  const sortedRecords = orderBy(expenseClassesTotals, SORTERS[sortedColumn], sortOrder === DESC_DIRECTION ? 'desc' : 'asc');

  return (
    <>
      <MultiColumnList
        columnMapping={columnMapping}
        contentData={sortedRecords}
        formatter={resultsFormatter}
        id={id}
        interactive={false}
        loading={loading}
        onHeaderClick={changeSorting}
        sortDirection={sortOrder}
        sortedColumn={sortedColumn}
        visibleColumns={visibleColumns}
      />
      <AcqEndOfList totalCount={sortedRecords?.length} />
    </>
  );
};

ExpenseClasses.propTypes = {
  currency: PropTypes.string,
  expenseClassesTotals: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

ExpenseClasses.defaultProps = {
  loading: false,
  visibleColumns: defaultVisibleColumns,
};

export default ExpenseClasses;
