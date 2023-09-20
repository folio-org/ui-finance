import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter } from 'react-router';

import AddBudgetModalForm from './AddBudgetModalForm';

const budgetLabelId = 'budgetLabel';
const defaultProps = {
  initialValues: {},
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  label: <FormattedMessage id={budgetLabelId} />,
};

const renderAddBudgetModalForm = (props = defaultProps) => (render(
  <Form
    onSubmit={jest.fn}
    render={() => (
      <AddBudgetModalForm
        {...props}
      />
    )}
  />,
  { wrapper: MemoryRouter },
));

describe('AddBudgetModalForm component', () => {
  it('should display title', () => {
    const { getByText } = renderAddBudgetModalForm();

    expect(getByText(budgetLabelId)).toBeDefined();
  });

  it('should display modal footer', () => {
    const { getByText } = renderAddBudgetModalForm();

    expect(getByText('ui-finance.budget.save')).toBeDefined();
    expect(getByText('ui-finance.budget.button.cancel')).toBeDefined();
  });

  describe('Close form', () => {
    it('should close the budget form', async () => {
      const { getByText } = renderAddBudgetModalForm();

      await user.click(getByText('ui-finance.budget.button.cancel'));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
