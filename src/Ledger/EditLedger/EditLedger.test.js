import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router';

import LedgerForm from '../LedgerForm';
import { EditLedger } from './EditLedger';

jest.mock('../LedgerForm', () => jest.fn().mockReturnValue('LedgerForm'));

const ledgerId = 'ledgerId';
const mutatorMock = {
  ledgerEdit: {
    PUT: jest.fn(),
    GET: jest.fn(),
    reset: jest.fn(),
  },
};
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: ledgerId }, path: 'path', url: 'url' },
  location: { state: { fiscalYearOneId: 'fyId' }, ...locationMock },
  history: historyMock,
  resources: {
    ledgerEdit: {
      hasLoaded: true,
      records: [{ id: ledgerId }],
    },
  },
};

const renderEditLedger = (props = defaultProps) => render(
  <EditLedger
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('EditLedger', () => {
  beforeEach(() => {
    LedgerForm.mockClear();

    historyMock.push.mockClear();
    mutatorMock.ledgerEdit.PUT.mockClear();
  });

  it('should display ledger form', () => {
    renderEditLedger();

    expect(screen.getByText('LedgerForm')).toBeDefined();
  });

  it('should redirect to ledger details when edit is cancelled', () => {
    renderEditLedger();

    LedgerForm.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should redirect to fiscal year form', () => {
    renderEditLedger();

    LedgerForm.mock.calls[0][0].goToCreateFY();

    expect(historyMock.push.mock.calls[0][0].pathname).toContain('/fiscalyear/create');
  });

  it('should save ledger', async () => {
    mutatorMock.ledgerEdit.PUT.mockReturnValue(Promise.resolve({}));

    renderEditLedger();

    await screen.findByText('LedgerForm');

    LedgerForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.ledgerEdit.PUT).toHaveBeenCalled();
  });
});
