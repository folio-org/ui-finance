import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
} from '@folio/stripes-acq-components';

import ExpenseClasses from '../../../common/ExpenseClasses';
import { SECTIONS_FUND } from '../../constants';

const VISIBLE_COLUMNS = ['expenseClassName', 'expended', 'percentageExpended', 'status'];

function FundExpenseClasses({ budgetId, currency, resources: { totals: { failed, isPending, records } } }) {
  if (!budgetId || failed || isPending || records.length === 0) return null;

  return (
    <Accordion
      label={<FormattedMessage id="ui-finance.fund.currentExpenseClasses" />}
      id={SECTIONS_FUND.currentExpenseClasses}
    >
      <ExpenseClasses
        expenseClassesTotals={records}
        currency={currency}
        id="fund-expense-classes"
        loading={isPending}
        visibleColumns={VISIBLE_COLUMNS}
      />
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
