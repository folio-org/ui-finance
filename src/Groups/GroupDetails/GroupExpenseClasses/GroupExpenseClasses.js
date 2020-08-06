import React from 'react';
import PropTypes from 'prop-types';

import { Accordion } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import ExpenseClasses from '../../../common/ExpenseClasses';
import { GROUP_ACCORDTION, GROUP_ACCORDTION_LABELS } from '../../constants';

const VISIBLE_COLUMNS = ['expenseClassName', 'expended', 'percentageExpended'];

function GroupExpenseClasses({
  currency,
  fiscalYearId,
  groupId,
  resources: { totals: { failed, isPending, records } }
}) {
  if (!fiscalYearId || !groupId || failed || isPending || records.length === 0) return null;

  return (
    <Accordion
      label={GROUP_ACCORDTION_LABELS.expenseClasses}
      id={GROUP_ACCORDTION.expenseClasses}
    >
      <ExpenseClasses
        expenseClassesTotals={records}
        currency={currency}
        id="group-expense-classes"
        loading={isPending}
        visibleColumns={VISIBLE_COLUMNS}
      />
    </Accordion>
  );
}

GroupExpenseClasses.manifest = Object.freeze({
  totals: {
    path: `finance/groups/!{groupId}/expense-classes-totals?fiscalYearId=!{fiscalYearId}&limit=${LIMIT_MAX}`,
    records: 'budgetExpenseClassTotals',
    throwErrors: false,
    type: 'okapi',
  },
});

GroupExpenseClasses.propTypes = {
  fiscalYearId: PropTypes.string,
  groupId: PropTypes.string,
  currency: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(GroupExpenseClasses);
