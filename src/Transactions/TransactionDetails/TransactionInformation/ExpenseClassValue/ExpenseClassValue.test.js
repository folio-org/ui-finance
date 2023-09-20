import React from 'react';
import { act, render } from '@folio/jest-config-stripes/testing-library/react';
import { FormattedMessage } from 'react-intl';

import ExpenseClassValue from './ExpenseClassValue';

const expenseClass = { name: 'expenseClassName' };
const expenseClassLabel = <FormattedMessage id="expenseClassLabel" />;
const defaultProps = {
  mutator: {
    expenseClass: {
      GET: jest.fn(),
    },
  },
  label: expenseClassLabel,
};

const renderExpenseClassValue = (props = defaultProps) => (render(
  <ExpenseClassValue
    {...props}
  />,
));

describe('ExpenseClassValue component', () => {
  it('should load expense class and display name', async () => {
    defaultProps.mutator.expenseClass.GET.mockReturnValue(Promise.resolve(expenseClass));
    let getByText;

    await act(async () => {
      getByText = renderExpenseClassValue({ ...defaultProps, id: 'id' }).getByText;
    });

    expect(defaultProps.mutator.expenseClass.GET).toHaveBeenCalled();
    expect(getByText(expenseClass.name)).toBeDefined();
    expect(getByText('expenseClassLabel')).toBeDefined();
  });

  it('should not load expense class and display hyphen', async () => {
    defaultProps.mutator.expenseClass.GET.mockClear();
    let getByText;

    await act(async () => {
      getByText = renderExpenseClassValue().getByText;
    });

    expect(defaultProps.mutator.expenseClass.GET).not.toHaveBeenCalled();
    expect(getByText('-')).toBeDefined();
  });
});
