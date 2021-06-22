import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import queryString from 'query-string';

import { FiscalYearsListContainer, buildFiscalYearsQuery } from './FiscalYearsListContainer';
import FiscalYearsList from './FiscalYearsList';

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

  it('should load more data', async () => {
    await act(async () => renderFiscalYearsListContainer());

    await act(async () => FiscalYearsList.mock.calls[0][0].onNeedMoreData());

    expect(defaultProps.mutator.fiscalYearsListFYears.GET).toHaveBeenCalled();
  });

  describe('search query', () => {
    it('should build query when search is active', () => {
      const expectedQuery = '(((name="FY*" or code="FY*" or description="FY*"))) sortby name/sort.ascending';

      expect(buildFiscalYearsQuery(queryString.parse('?query=FY'))).toBe(expectedQuery);
    });

    it('should build query when search by field is active', () => {
      const expectedQuery = '(((name=FY*))) sortby name/sort.ascending';

      expect(buildFiscalYearsQuery(queryString.parse('?qindex=name&query=FY'))).toBe(expectedQuery);
    });
  });
});
