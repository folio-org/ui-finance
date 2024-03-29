import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router';

import { FiscalYearForm } from '../FiscalYearForm';
import { EditFiscalYear } from './EditFiscalYear';

jest.mock('../FiscalYearForm', () => ({
  FiscalYearForm: jest.fn().mockReturnValue('FiscalYearForm'),
}));

const mutatorMock = {
  fiscalYearEdit: {
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
const fyId = 'fyId';

const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: fyId }, path: 'path', url: 'url' },
  location: locationMock,
  history: historyMock,
  resources: {
    fiscalYearEdit: {
      hasLoaded: true,
      records: [{ id: fyId }],
    },
  },
};

const renderEditFiscalYear = (props = defaultProps) => render(
  <EditFiscalYear
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('EditFiscalYear', () => {
  beforeEach(() => {
    FiscalYearForm.mockClear();

    historyMock.push.mockClear();
    mutatorMock.fiscalYearEdit.PUT.mockClear();
  });

  it('should display fiscal year form', () => {
    renderEditFiscalYear();

    expect(screen.getByText('FiscalYearForm')).toBeDefined();
  });

  it('should redirect to fiscal year details when edit is cancelled', () => {
    renderEditFiscalYear();

    FiscalYearForm.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should save fiscal year', async () => {
    mutatorMock.fiscalYearEdit.PUT.mockReturnValue(Promise.resolve({}));

    renderEditFiscalYear();

    await screen.findByText('FiscalYearForm');

    FiscalYearForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.fiscalYearEdit.PUT).toHaveBeenCalled();
  });
});
