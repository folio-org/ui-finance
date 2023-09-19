import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter, useParams, useHistory } from 'react-router';

import { FiscalYearForm } from '../../FiscalYears/FiscalYearForm';
import RolloverLedgerCreateFiscalYear from './RolloverLedgerCreateFiscalYear';

jest.mock('../../FiscalYears/FiscalYearForm', () => ({
  FiscalYearForm: jest.fn().mockReturnValue('FiscalYearForm'),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
  useHistory: jest.fn(),
}));

const mutatorMock = {
  createLedgerFiscalYear: {
    POST: jest.fn(),
  },
};
const pushMock = jest.fn();
const ledgerId = 'ledgerId';

const renderRolloverLedgerCreateFiscalYear = (props) => render(
  <RolloverLedgerCreateFiscalYear
    mutator={mutatorMock}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('RolloverLedgerCreateFiscalYear', () => {
  beforeEach(() => {
    FiscalYearForm.mockClear();
    useParams.mockClear().mockReturnValue({ id: ledgerId });
    useHistory.mockClear().mockReturnValue({
      push: pushMock,
    });
    mutatorMock.createLedgerFiscalYear.POST.mockClear();
  });

  it('should display fiscal year form', () => {
    renderRolloverLedgerCreateFiscalYear();

    expect(screen.getByText('FiscalYearForm')).toBeDefined();
  });

  it('should redirect to ledger rollover when create is cancelled', () => {
    renderRolloverLedgerCreateFiscalYear();

    FiscalYearForm.mock.calls[0][0].onCancel();

    expect(pushMock).toHaveBeenCalled();
  });

  it('should save new fiscal year', async () => {
    mutatorMock.createLedgerFiscalYear.POST.mockReturnValue(Promise.resolve({ id: 'fyId' }));

    renderRolloverLedgerCreateFiscalYear();

    await screen.findByText('FiscalYearForm');

    FiscalYearForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.createLedgerFiscalYear.POST).toHaveBeenCalled();
  });
});
