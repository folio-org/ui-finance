import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Form } from 'react-final-form';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { FUNDS_ROUTE } from '../../../common/const';
import BudgetForm from './BudgetForm';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('../../../common/FinancialSummary', () => jest.fn().mockReturnValue('FinancialSummary'));

const defaultProps = {
  initialValues: { name: 'budget' },
  onClose: jest.fn(),
  form: {},
  onSubmit: jest.fn(),
  pristine: false,
  submitting: false,
  expenseClasses: [],
  fiscalYear: {},
};

const renderBudgetForm = (props = defaultProps) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn}
      render={() => (
        <BudgetForm
          {...props}
        />
      )}
    />
  </MemoryRouter>,
));

describe('BudgetForm component', () => {
  it('should display title for editing budget', () => {
    const { getByText } = renderBudgetForm();

    expect(getByText(defaultProps.initialValues.name)).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderBudgetForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('ui-finance.saveAndClose')).toBeDefined();
  });

  describe('Close form', () => {
    it('should close the budget form', async () => {
      const { getByText } = renderBudgetForm();

      await user.click(getByText('stripes-acq-components.FormFooter.cancel'));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      expandAllSections.mockClear();
      renderBudgetForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      collapseAllSections.mockClear();
      renderBudgetForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should cancel form when cancel shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderBudgetForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should navigate to list view when search shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderBudgetForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith(FUNDS_ROUTE);
    });
  });
});
