import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import FiscalYearsListContainer from './FiscalYearsListContainer';

jest.mock('./FiscalYearsList', () => jest.fn().mockReturnValue('FiscalYearsList'));

const defaultProps = {
  mutator: {
    fiscalYearsListFYears: {
      GET: jest.fn(),
    },
  },
  location: {},
  history: {},
};

const renderFiscalYearsListContainer = (props = defaultProps) => render(
  <FiscalYearsListContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('FiscalYearsListContainer', () => {
  beforeEach(() => {
    defaultProps.mutator.fiscalYearsListFYears.GET.mockClear();
  });

  it('should display GroupsList', async () => {
    defaultProps.mutator.fiscalYearsListFYears.GET.mockReturnValue(Promise.resolve({
      fiscalYears: [],
      totalRecords: 0,
    }));

    await act(async () => renderFiscalYearsListContainer());

    expect(screen.getByText('FiscalYearsList')).toBeDefined();
  });
});
