import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Form } from 'react-final-form';
import { render, act, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { LEDGERS_ROUTE } from '../../common/const';
import LedgerForm from './LedgerForm';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));

const defaultProps = {
  initialValues: {},
  onCancel: jest.fn(),
  form: {},
  onSubmit: jest.fn(),
  pristine: false,
  submitting: false,
  goToCreateFY: jest.fn(),
};

const renderLedgerForm = (props = defaultProps) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn}
      render={() => (
        <LedgerForm
          {...props}
        />
      )}
    />
  </MemoryRouter>,
));

describe('LedgerForm component', () => {
  it('should display title for new ledger', async () => {
    await act(async () => renderLedgerForm());

    expect(screen.getByText('ui-finance.ledger.form.title.create')).toBeDefined();
  });

  it('should display title for editing ledger', async () => {
    await act(async () => renderLedgerForm({ ...defaultProps, initialValues: { id: 'ledgerId' } }));

    expect(screen.getByText('ui-finance.ledger.form.title.edit')).toBeDefined();
  });

  it('should display pane footer', async () => {
    await act(async () => renderLedgerForm());

    expect(screen.getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(screen.getByText('ui-finance.saveAndClose')).toBeDefined();
  });

  describe('Close form', () => {
    it('should close the ledger form', async () => {
      await act(async () => renderLedgerForm());

      user.click(screen.getByText('stripes-acq-components.FormFooter.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Open fiscal year form', () => {
    it('should open the fiscal year form', async () => {
      await act(async () => renderLedgerForm());

      user.click(screen.getByText('ui-finance.ledger.createNewFY'));

      expect(defaultProps.goToCreateFY).toHaveBeenCalled();
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
      await act(async () => renderLedgerForm());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', async () => {
      collapseAllSections.mockClear();
      await act(async () => renderLedgerForm());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should cancel form when cancel shortcut is called', async () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      await act(async () => renderLedgerForm());
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should navigate to list view when search shortcut is called', async () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      await act(async () => renderLedgerForm());
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith(LEDGERS_ROUTE);
    });
  });
});
