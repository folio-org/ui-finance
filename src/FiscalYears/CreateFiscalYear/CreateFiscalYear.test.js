import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { FISCAL_YEAR_ROUTE } from '../../common/const';
import { FiscalYearForm } from '../FiscalYearForm';
import { CreateFiscalYear } from './CreateFiscalYear';

jest.mock('../FiscalYearForm', () => ({
  FiscalYearForm: jest.fn().mockReturnValue('FiscalYearForm'),
}));

const mutatorMock = {
  createFiscalYear: {
    POST: jest.fn(),
  },
};
const historyMock = {
  push: jest.fn(),
};
const fyId = 'fyId';

const renderCreateFiscalYear = (props) => render(
  <CreateFiscalYear
    location={{}}
    history={historyMock}
    mutator={mutatorMock}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('CreateFiscalYear', () => {
  beforeEach(() => {
    FiscalYearForm.mockClear();

    historyMock.push.mockClear();
    mutatorMock.createFiscalYear.POST.mockClear();
  });

  it('should display fiscal year form', () => {
    renderCreateFiscalYear();

    expect(screen.getByText('FiscalYearForm')).toBeDefined();
  });

  it('should redirect to fiscal year list when create is cancelled', () => {
    renderCreateFiscalYear();

    FiscalYearForm.mock.calls[0][0].onCancel();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(FISCAL_YEAR_ROUTE);
  });

  it('should redirect to fiscal year details when create is completed', () => {
    renderCreateFiscalYear();

    FiscalYearForm.mock.calls[0][0].onCancel({ id: fyId });

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${FISCAL_YEAR_ROUTE}/${fyId}/view`);
  });

  it('should save new fiscal year', async () => {
    mutatorMock.createFiscalYear.POST.mockReturnValue(Promise.resolve({ id: fyId }));

    renderCreateFiscalYear();

    await screen.findByText('FiscalYearForm');

    FiscalYearForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.createFiscalYear.POST).toHaveBeenCalled();
  });
});
