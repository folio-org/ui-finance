import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isNumber } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

const defaultVisibleColumns = ['expenseClassName', 'encumbered', 'awaitingPayment', 'expended', 'percentageExpended', 'status'];
const columnMapping = {
  expenseClassName: <FormattedMessage id="ui-finance.budget.expenseClasses.expenseClassName" />,
  encumbered: <FormattedMessage id="ui-finance.budget.expenseClasses.encumbered" />,
  awaitingPayment: <FormattedMessage id="ui-finance.budget.expenseClasses.awaitingPayment" />,
  expended: <FormattedMessage id="ui-finance.budget.expenseClasses.expended" />,
  percentageExpended: <FormattedMessage id="ui-finance.budget.expenseClasses.percentageExpended" />,
  status: <FormattedMessage id="ui-finance.budget.expenseClasses.status" />,
};
const resultsFormatter = {
  encumbered: expenseClass => <AmountWithCurrencyField amount={expenseClass.encumbered} />,
  awaitingPayment: expenseClass => <AmountWithCurrencyField amount={expenseClass.awaitingPayment} />,
  expended: expenseClass => <AmountWithCurrencyField amount={expenseClass.expended} />,
  percentageExpended: expenseClass => (isNumber(expenseClass.percentageExpended)
    ? `${expenseClass.percentageExpended}%`
    : <FormattedMessage id="ui-finance.budget.expenseClasses.percentageExpended.undefined" />
  ),
  status: expenseClass => <FormattedMessage id={`ui-finance.budget.expenseClasses.status.${expenseClass.expenseClassStatus}`} />,
};

const ExpenseClasses = ({ expenseClassesTotals, visibleColumns, id }) => {
  if (!expenseClassesTotals) {
    return null;
  }

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={expenseClassesTotals}
      formatter={resultsFormatter}
      id={id}
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
};

ExpenseClasses.propTypes = {
  expenseClassesTotals: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

ExpenseClasses.defaultProps = {
  visibleColumns: defaultVisibleColumns,
};

export default ExpenseClasses;
