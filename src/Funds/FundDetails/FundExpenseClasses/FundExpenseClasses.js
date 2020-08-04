import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import orderBy from 'lodash/orderBy';

import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  AcqEndOfList,
  AmountWithCurrencyField,
  ASC_DIRECTION,
  baseManifest,
  DESC_DIRECTION,
} from '@folio/stripes-acq-components';

import { SECTIONS_FUND } from '../../constants';

const VISIBLE_COLUMNS = ['expenseClassName', 'expended', 'percentageExpended', 'expenseClassStatus'];
const COLUMN_MAPPING = {
  expenseClassName: <FormattedMessage id="ui-finance.currentExpenseClasses.expenseClassName" />,
  expended: <FormattedMessage id="ui-finance.currentExpenseClasses.expended" />,
  percentageExpended: <FormattedMessage id="ui-finance.currentExpenseClasses.percentageExpended" />,
  expenseClassStatus: <FormattedMessage id="ui-finance.currentExpenseClasses.expenseClassStatus" />,
};
const SORTERS = {
  'expenseClassName': ({ expenseClassName }) => expenseClassName?.toLowerCase(),
  'expenseClassStatus': ({ expenseClassStatus }) => expenseClassStatus?.toLowerCase(),
  'expended': ({ expended }) => expended,
  'percentageExpended': ({ percentageExpended }) => percentageExpended,
};

function FundExpenseClasses({ budgetId, currency, resources: { totals: { failed, isPending, records } } }) {
  const [sortedColumn, setSortedColumn] = useState('expenseClassName');
  const [sortOrder, setSortOrder] = useState(ASC_DIRECTION);
  const sortedRecords = orderBy(records, SORTERS[sortedColumn], sortOrder === DESC_DIRECTION ? 'desc' : 'asc');
  const changeSorting = useCallback((event, { name }) => {
    if (!SORTERS[name]) return;
    if (sortedColumn !== name) {
      setSortedColumn(name);
      setSortOrder(DESC_DIRECTION);
    } else {
      setSortOrder(sortOrder === DESC_DIRECTION ? ASC_DIRECTION : DESC_DIRECTION);
    }
  }, [sortOrder, sortedColumn]);
  const resultsFormatter = useMemo(() => ({
    expended: item => (
      <AmountWithCurrencyField
        amount={item.expended}
        currency={currency}
      />
    ),
    percentageExpended: item => `${item.percentageExpended}%`,
    expenseClassStatus: item => (
      <FormattedMessage id={`ui-finance.currentExpenseClasses.expenseClassStatus.${item.expenseClassStatus}`} />
    ),
  }), [currency]);

  if (!budgetId || failed || isPending || records.length === 0) return null;

  return (
    <Accordion
      label={<FormattedMessage id="ui-finance.fund.currentExpenseClasses" />}
      id={SECTIONS_FUND.currentExpenseClasses}
    >
      <MultiColumnList
        columnMapping={COLUMN_MAPPING}
        contentData={sortedRecords}
        formatter={resultsFormatter}
        id="fund-expense-classes"
        interactive={false}
        loading={isPending}
        onHeaderClick={changeSorting}
        sortDirection={sortOrder}
        sortedColumn={sortedColumn}
        visibleColumns={VISIBLE_COLUMNS}
      />
      <AcqEndOfList totalCount={sortedRecords?.length} />
    </Accordion>
  );
}

FundExpenseClasses.manifest = Object.freeze({
  totals: {
    ...baseManifest,
    path: 'finance/budgets/!{budgetId}/expense-classes-totals',
    records: 'budgetExpenseClassTotals',
  },
});

FundExpenseClasses.propTypes = {
  budgetId: PropTypes.string,
  currency: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FundExpenseClasses);
