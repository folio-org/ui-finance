import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { LEDGERS_ROUTE } from '../../common/const';
import LedgerForm from '../LedgerForm';
import { CreateLedger } from './CreateLedger';

jest.mock('../LedgerForm', () => jest.fn().mockReturnValue('LedgerForm'));

const mutatorMock = {
  createLedger: {
    POST: jest.fn(),
  },
};
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
};
const ledgerId = 'ledgerId';

const renderCreateLedger = (props) => render(
  <CreateLedger
    location={{ hash: 'hash', pathname: 'pathname', search: 'search' }}
    history={historyMock}
    mutator={mutatorMock}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('CreateLedger', () => {
  beforeEach(() => {
    LedgerForm.mockClear();

    historyMock.push.mockClear();
    mutatorMock.createLedger.POST.mockClear();
  });

  it('should display ledger form', () => {
    renderCreateLedger();

    expect(screen.getByText('LedgerForm')).toBeDefined();
  });

  it('should redirect to ledger list when create is cancelled', () => {
    renderCreateLedger();

    LedgerForm.mock.calls[0][0].onCancel();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(LEDGERS_ROUTE);
  });

  it('should redirect to ledger details when create is completed', () => {
    renderCreateLedger();

    LedgerForm.mock.calls[0][0].onCancel(ledgerId);

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${ledgerId}/view`);
  });

  it('should redirect to fiscal year form', () => {
    renderCreateLedger();

    LedgerForm.mock.calls[0][0].goToCreateFY();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/fiscalyear/create`);
  });

  it('should save new ledger', async () => {
    mutatorMock.createLedger.POST.mockReturnValue(Promise.resolve({ id: ledgerId }));

    renderCreateLedger();

    await screen.findByText('LedgerForm');

    LedgerForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.createLedger.POST).toHaveBeenCalled();
  });
});
