import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import arrayMutators from 'final-form-arrays';
import { Form } from 'react-final-form';

import RolloverLedgerBudgets from './RolloverLedgerBudgets';
import { ADD_AVAILABLE_TO, ROLLOVER_BUDGET_VALUE } from '../constants';

const fundTypes = [
  null,
  { id: '0f5f819e-0690-4c20-ad8d-cc23a6ecc585', name: 'Faculty' },
  { id: 'c93373df-e7ec-4d31-b200-719736610d89', name: 'Approvals' },
  { id: 'addac225-947b-41b6-b80a-4c0b79261747', name: 'Gifts' },
];

const defaultProps = {
  fundTypesMap: new Map(fundTypes.filter(Boolean).map((fundType) => [fundType.id, fundType])),
};

const initialValues = {
  budgetsRollover: fundTypes.map((fundType) => {
    return {
      addAvailableTo: ADD_AVAILABLE_TO.transfer,
      rolloverBudgetValue: ROLLOVER_BUDGET_VALUE.none,
      fundTypeId: fundType?.id,
    };
  }),
};

const renderRolloverLedgerBudgets = (props = {}) => render(
  <Form
    onSubmit={jest.fn}
    initialValues={initialValues}
    mutators={{ ...arrayMutators }}
    render={() => (
      <RolloverLedgerBudgets
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('RolloverLedgerBudgets', () => {
  it('should render \'Rollover budget value\' select fields for each fund type', () => {
    renderRolloverLedgerBudgets();

    const selectFields = screen.getAllByRole('combobox', { name: 'ui-finance.ledger.rollover.rolloverBudgetValue' });

    expect(selectFields.length).toEqual(fundTypes.length);
  });

  it('should allow user to select \'Rollover budget value\' options', async () => {
    renderRolloverLedgerBudgets();

    const selectField = screen.getAllByRole('combobox', { name: 'ui-finance.ledger.rollover.rolloverBudgetValue' })[0];
    const availableOption = screen.getAllByRole('option', { name: 'ui-finance.ledger.rollover.rolloverBudgetValue.available' })[0];
    const cashBalanceOption = screen.getAllByRole('option', { name: 'ui-finance.ledger.rollover.rolloverBudgetValue.cashBalance' })[0];
    const noneOption = screen.getAllByRole('option', { name: 'ui-finance.ledger.rollover.rolloverBudgetValue.none' })[0];

    expect(noneOption.selected).toBeTruthy();
    expect(availableOption.selected).toBeFalsy();
    expect(cashBalanceOption.selected).toBeFalsy();

    await act(async () => user.selectOptions(selectField, ROLLOVER_BUDGET_VALUE.available));

    expect(noneOption.selected).toBeFalsy();
    expect(availableOption.selected).toBeTruthy();
    expect(cashBalanceOption.selected).toBeFalsy();

    await act(async () => user.selectOptions(selectField, ROLLOVER_BUDGET_VALUE.cashBalance));

    expect(noneOption.selected).toBeFalsy();
    expect(availableOption.selected).toBeFalsy();
    expect(cashBalanceOption.selected).toBeTruthy();
  });
});
