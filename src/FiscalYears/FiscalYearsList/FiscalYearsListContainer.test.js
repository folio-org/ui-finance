import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import FiscalYearsListContainer from './FiscalYearsListContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: () => ({}),
}));
jest.mock('./FiscalYearsList', () => jest.fn().mockReturnValue('FiscalYearsList'));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useFiscalYears: jest.fn().mockReturnValue({}),
}));

const renderFiscalYearsListContainer = () => render(
  <FiscalYearsListContainer />,
  { wrapper: MemoryRouter },
);

describe('FiscalYearsListContainer', () => {
  it('should display FiscalYearList', async () => {
    await act(async () => renderFiscalYearsListContainer());

    expect(screen.getByText('FiscalYearsList')).toBeDefined();
  });
});
