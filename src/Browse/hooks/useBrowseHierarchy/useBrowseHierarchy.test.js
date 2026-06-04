import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { useBrowseHierarchy } from './useBrowseHierarchy';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useNamespace: jest.fn(() => ['browse-hierarchy']),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, cacheTime: 0 },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const mockFinanceData = {
  fyFinanceData: [
    {
      ledgerId: 'led-1',
      ledgerName: 'Main Ledger',
      ledgerCode: 'ML',
      ledgerStatus: 'Active',
      groupId: 'grp-1',
      groupName: 'Science',
      groupCode: 'SCI',
      groupStatus: 'Active',
      fundId: 'fund-1',
      fundName: 'Chemistry',
      fundCode: 'CHEM',
      fundStatus: 'Active',
      budgetId: 'bud-1',
      budgetName: 'FY24-CHEM',
      budgetCode: 'FY24C',
      budgetStatus: 'Active',
    },
    {
      ledgerId: 'led-1',
      ledgerName: 'Main Ledger',
      ledgerCode: 'ML',
      ledgerStatus: 'Active',
      fundId: 'fund-2',
      fundName: 'Physics',
      fundCode: 'PHY',
      fundStatus: 'Active',
      budgetId: 'bud-2',
      budgetName: 'FY24-PHY',
      budgetCode: 'FY24P',
      budgetStatus: 'Active',
    },
  ],
};

const mockEmptyFinanceData = { fyFinanceData: [] };

const mockLedgersResponse = {
  ledgers: [
    { id: 'led-1', name: 'Main Ledger', code: 'ML', ledgerStatus: 'Active' },
    { id: 'led-2', name: 'Other Ledger', code: 'OL', ledgerStatus: 'Active' },
  ],
};

const mockBudgetsResponse = {
  budgets: [
    {
      id: 'bud-1',
      fundId: 'fund-1',
      name: 'FY24-CHEM',
      budgetStatus: 'Active',
      fundDetails: {
        ledgerId: 'led-1',
        name: 'Chemistry',
        code: 'CHEM',
        fundStatus: 'Active',
        groupIds: ['grp-1'],
      },
      statusExpenseClasses: [
        { expenseClassId: 'ec-1', expenseClassName: 'Electronic', status: 'Active' },
      ],
    },
    {
      id: 'bud-2',
      fundId: 'fund-2',
      name: 'FY24-PHY',
      budgetStatus: 'Active',
      fundDetails: {
        ledgerId: 'led-1',
        name: 'Physics',
        code: 'PHY',
        fundStatus: 'Active',
        groupIds: [],
      },
    },
  ],
};

const mockGroupsResponse = {
  groups: [
    { id: 'grp-1', name: 'Science', code: 'SCI', status: 'Active' },
  ],
};

describe('useBrowseHierarchy', () => {
  let kyGetMock;

  beforeEach(() => {
    kyGetMock = jest.fn();
    useOkapiKy.mockReturnValue({ get: kyGetMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default values when no fiscalYearId is provided', async () => {
    const { result } = renderHook(
      () => useBrowseHierarchy(null),
      { wrapper: createWrapper() },
    );

    expect(result.current.hierarchy).toEqual([]);
    expect(result.current.counts).toEqual({
      ledgers: 0, groups: 0, funds: 0, budgets: 0, expenseClasses: 0,
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should return default values when fiscalYearId is undefined', () => {
    const { result } = renderHook(
      () => useBrowseHierarchy(undefined),
      { wrapper: createWrapper() },
    );

    expect(result.current.hierarchy).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should not fetch when enabled option is false', () => {
    renderHook(
      () => useBrowseHierarchy('fy-1', { enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(kyGetMock).not.toHaveBeenCalled();
  });

  describe('with finance data available', () => {
    beforeEach(() => {
      kyGetMock.mockReturnValue({
        json: jest.fn().mockResolvedValue(mockFinanceData),
      });
    });

    it('should build hierarchy from finance data', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.hierarchy.length).toBeGreaterThan(0);
      });

      const ledger = result.current.hierarchy[0];

      expect(ledger.id).toBe('led-1');
      expect(ledger.name).toBe('Main Ledger');
      expect(ledger.code).toBe('ML');
    });

    it('should calculate counts correctly', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.counts.ledgers).toBe(1);
      });
    });

    it('should create ungrouped group for items without groupId', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBeGreaterThan(0);
      });

      const ledger = result.current.hierarchy[0];
      const ungrouped = ledger.groups.find(g => g.isUngrouped);

      expect(ungrouped).toBeDefined();
      expect(ungrouped.name).toBe('Ungrouped');
    });

    it('should place grouped funds under the correct group', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBeGreaterThan(0);
      });

      const ledger = result.current.hierarchy[0];
      const scienceGroup = ledger.groups.find(g => g.id === 'grp-1');

      expect(scienceGroup).toBeDefined();
      expect(scienceGroup.funds.length).toBe(1);
      expect(scienceGroup.funds[0].id).toBe('fund-1');
    });

    it('should include budgets under funds', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBeGreaterThan(0);
      });

      const ledger = result.current.hierarchy[0];
      const group = ledger.groups.find(g => g.id === 'grp-1');
      const fund = group.funds[0];

      expect(fund.budgets.length).toBe(1);
      expect(fund.budgets[0].id).toBe('bud-1');
    });
  });

  describe('with empty finance data (fallback to budgets)', () => {
    beforeEach(() => {
      let callCount = 0;

      kyGetMock.mockImplementation(() => ({
        json: jest.fn().mockImplementation(() => {
          callCount++;

          switch (callCount) {
            case 1: return Promise.resolve(mockEmptyFinanceData);
            case 2: return Promise.resolve(mockLedgersResponse);
            case 3: return Promise.resolve(mockBudgetsResponse);
            case 4: return Promise.resolve(mockGroupsResponse);
            default: return Promise.resolve({});
          }
        }),
      }));
    });

    it('should fall back to building hierarchy from budgets', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.hierarchy.length).toBeGreaterThan(0);
      });

      const ledger = result.current.hierarchy[0];

      expect(ledger.id).toBe('led-1');
    });

    it('should include expense classes from budgets', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBeGreaterThan(0);
      });

      const ledger = result.current.hierarchy[0];
      const sciGroup = ledger.groups.find(g => g.id === 'grp-1');

      expect(sciGroup).toBeDefined();

      const fund = sciGroup.funds[0];
      const budget = fund.budgets[0];

      expect(budget.expenseClasses.length).toBe(1);
      expect(budget.expenseClasses[0].name).toBe('Electronic');
    });

    it('should put ungrouped funds in an Ungrouped group', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBeGreaterThan(0);
      });

      const ledger = result.current.hierarchy[0];
      const ungrouped = ledger.groups.find(g => g.isUngrouped);

      expect(ungrouped).toBeDefined();
      expect(ungrouped.funds.length).toBe(1);
      expect(ungrouped.funds[0].id).toBe('fund-2');
    });

    it('should calculate counts from fallback hierarchy', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.counts.ledgers).toBeGreaterThanOrEqual(1);
      });

      expect(result.current.counts.funds).toBeGreaterThanOrEqual(2);
      expect(result.current.counts.budgets).toBeGreaterThanOrEqual(2);
      expect(result.current.counts.expenseClasses).toBeGreaterThanOrEqual(1);
    });

    it('should filter out ledgers with no budgets', async () => {
      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBeGreaterThan(0);
      });

      const ledger2 = result.current.hierarchy.find(l => l.id === 'led-2');

      expect(ledger2).toBeUndefined();
    });
  });

  describe('edge cases in finance data', () => {
    it('should handle items with missing optional fields', async () => {
      kyGetMock.mockReturnValue({
        json: jest.fn().mockResolvedValue({
          fyFinanceData: [
            {
              ledgerId: 'led-x',
              fundId: 'fund-x',
              budgetId: 'bud-x',
            },
          ],
        }),
      });

      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBe(1);
      });

      const ledger = result.current.hierarchy[0];

      expect(ledger.name).toContain('Unknown Ledger');
      expect(ledger.status).toBe('Active');
    });

    it('should handle finance data items without budgetId', async () => {
      kyGetMock.mockReturnValue({
        json: jest.fn().mockResolvedValue({
          fyFinanceData: [
            {
              ledgerId: 'led-1',
              ledgerName: 'Test',
              ledgerCode: 'T',
              groupId: 'grp-1',
              groupName: 'G',
              fundId: 'fund-1',
              fundName: 'F',
            },
          ],
        }),
      });

      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBe(1);
      });

      const fund = result.current.hierarchy[0].groups[0].funds[0];

      expect(fund.budgets).toHaveLength(0);
    });
  });

  describe('fallback edge cases', () => {
    it('should skip budgets without ledgerId in fundDetails', async () => {
      let callCount = 0;

      kyGetMock.mockImplementation(() => ({
        json: jest.fn().mockImplementation(() => {
          callCount++;

          switch (callCount) {
            case 1: return Promise.resolve(mockEmptyFinanceData);
            case 2: return Promise.resolve(mockLedgersResponse);
            case 3: return Promise.resolve({
              budgets: [
                {
                  id: 'bud-orphan',
                  fundId: 'fund-orphan',
                  name: 'Orphan',
                  budgetStatus: 'Active',
                  fundDetails: {},
                },
              ],
            });
            case 4: return Promise.resolve(mockGroupsResponse);
            default: return Promise.resolve({});
          }
        }),
      }));

      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hierarchy).toEqual([]);
    });

    it('should handle budgets with unknown group IDs', async () => {
      let callCount = 0;

      kyGetMock.mockImplementation(() => ({
        json: jest.fn().mockImplementation(() => {
          callCount++;

          switch (callCount) {
            case 1: return Promise.resolve(mockEmptyFinanceData);
            case 2: return Promise.resolve(mockLedgersResponse);
            case 3: return Promise.resolve({
              budgets: [
                {
                  id: 'bud-1',
                  fundId: 'fund-1',
                  name: 'B',
                  budgetStatus: 'Active',
                  fundDetails: {
                    ledgerId: 'led-1',
                    name: 'Fund',
                    groupIds: ['unknown-group'],
                  },
                },
              ],
            });
            case 4: return Promise.resolve({ groups: [] });
            default: return Promise.resolve({});
          }
        }),
      }));

      const { result } = renderHook(
        () => useBrowseHierarchy('fy-1'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.hierarchy.length).toBe(1);
      });

      const group = result.current.hierarchy[0].groups[0];

      expect(group.name).toBe('Unknown Group');
    });
  });
});
