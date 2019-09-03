import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

const visibleColumns = ['name', 'code', 'allocated', 'unavailable', 'available'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.fund.budget.name" />,
  code: <FormattedMessage id="ui-finance.fund.budget.code" />,
  allocated: <FormattedMessage id="ui-finance.budget.allocated" />,
  unavailable: <FormattedMessage id="ui-finance.budget.unavailable" />,
  available: <FormattedMessage id="ui-finance.budget.available" />,
};
const columnWidths = {
  name: '20%',
  code: '20%',
  allocated: '20%',
  unavailable: '20%',
  available: '20%',
};

const BudgetDetails = ({ budgets, currency, openBudget }) => {
  const resultsFormatter = {
    allocated: budget => (
      <AmountWithCurrencyField
        amount={budget.allocated}
        currency={currency}
      />
    ),
    unavailable: budget => (
      <AmountWithCurrencyField
        amount={budget.unavailable}
        currency={currency}
      />
    ),
    available: budget => (
      <AmountWithCurrencyField
        amount={budget.available}
        currency={currency}
      />
    ),
  };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      contentData={budgets}
      formatter={resultsFormatter}
      onRowClick={openBudget}
      visibleColumns={visibleColumns}
    />
  );
};

BudgetDetails.propTypes = {
  openBudget: PropTypes.func.isRequired,
  budgets: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

BudgetDetails.defaultProps = {
  budgets: [],
  currency: '',
};

export default BudgetDetails;
