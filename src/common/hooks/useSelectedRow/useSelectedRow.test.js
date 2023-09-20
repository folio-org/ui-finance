import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { FISCAL_YEAR_ROUTE } from '../../const';
import { useSelectedRow } from './useSelectedRow';

const history = createMemoryHistory();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <Router history={history}>
    {children}
  </Router>
);

describe('useSelectedRow', () => {
  it('should return \'true\' if the row should be selected', async () => {
    const id = 'fiscalYearId';

    history.push(`${FISCAL_YEAR_ROUTE}/${id}/view`);

    const { result } = renderHook(() => useSelectedRow(`${FISCAL_YEAR_ROUTE}/:id/view`), { wrapper });

    const isSelected = result.current;

    expect(isSelected({ item: { id } })).toBeTruthy();
  });

  it('should return \'false\' if the row should not be selected', async () => {
    history.push(`${FISCAL_YEAR_ROUTE}/fiscalYearId/view`);

    const { result } = renderHook(() => useSelectedRow(`${FISCAL_YEAR_ROUTE}/:id/view`), { wrapper });

    const isSelected = result.current;

    expect(isSelected({ item: { id: 'anotherId' } })).toBeFalsy();
  });

  it('should return \'null\' if the path didn\'t match', async () => {
    const id = 'fiscalYearId';

    history.push(`${FISCAL_YEAR_ROUTE}/${id}/edit`);

    const { result } = renderHook(() => useSelectedRow(`${FISCAL_YEAR_ROUTE}/:id/view`), { wrapper });

    const isSelected = result.current;

    expect(isSelected({ item: { id } })).toBeNull();
  });
});
