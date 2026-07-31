import { filterHierarchy } from './filterHierarchy';
import { BROWSE_FILTERS } from '../constants';

const buildHierarchy = () => [
  {
    id: 'led-active',
    name: 'Active Ledger',
    status: 'Active',
    groups: [
      {
        id: 'grp-active',
        name: 'Active Group',
        status: 'Active',
        isUngrouped: false,
        funds: [
          {
            id: 'fund-active',
            name: 'Active Fund',
            status: 'Active',
            budgets: [
              {
                id: 'bud-active',
                name: 'Active Budget',
                status: 'Active',
                expenseClasses: [
                  { id: 'ec-active', name: 'Electronic', status: 'Active' },
                  { id: 'ec-inactive', name: 'Print', status: 'Inactive' },
                ],
              },
              {
                id: 'bud-closed',
                name: 'Closed Budget',
                status: 'Closed',
                expenseClasses: [],
              },
            ],
          },
          {
            id: 'fund-inactive',
            name: 'Inactive Fund',
            status: 'Inactive',
            budgets: [],
          },
        ],
      },
      {
        id: 'grp-frozen',
        name: 'Frozen Group',
        status: 'Frozen',
        isUngrouped: false,
        funds: [],
      },
      {
        id: 'ungrouped',
        name: 'Ungrouped',
        status: '',
        isUngrouped: true,
        funds: [
          { id: 'fund-ungrouped', name: 'Ungrouped Fund', status: 'Active', budgets: [] },
        ],
      },
    ],
  },
  {
    id: 'led-frozen',
    name: 'Frozen Ledger',
    status: 'Frozen',
    groups: [],
  },
];

describe('filterHierarchy', () => {
  it('should return the hierarchy unchanged when no filters are selected', () => {
    const hierarchy = buildHierarchy();
    const result = filterHierarchy(hierarchy, {});

    expect(result).toHaveLength(2);
    expect(result[0].groups).toHaveLength(3);
  });

  it('should return an empty array for a null/undefined hierarchy', () => {
    expect(filterHierarchy(null, {})).toEqual([]);
    expect(filterHierarchy(undefined, {})).toEqual([]);
  });

  it('should filter ledgers by the selected ledger status', () => {
    const result = filterHierarchy(buildHierarchy(), {
      [BROWSE_FILTERS.LEDGER_STATUS]: ['Active'],
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('led-active');
  });

  it('should filter groups by the selected group status, always keeping Ungrouped', () => {
    const result = filterHierarchy(buildHierarchy(), {
      [BROWSE_FILTERS.GROUP_STATUS]: ['Active'],
    });

    const ledger = result.find(l => l.id === 'led-active');
    const groupIds = ledger.groups.map(g => g.id);

    expect(groupIds).toContain('grp-active');
    expect(groupIds).toContain('ungrouped');
    expect(groupIds).not.toContain('grp-frozen');
  });

  it('should filter funds by the selected fund status', () => {
    const result = filterHierarchy(buildHierarchy(), {
      [BROWSE_FILTERS.FUND_STATUS]: ['Active'],
    });

    const group = result[0].groups.find(g => g.id === 'grp-active');
    const fundIds = group.funds.map(f => f.id);

    expect(fundIds).toEqual(['fund-active']);
  });

  it('should filter budgets by the selected budget status', () => {
    const result = filterHierarchy(buildHierarchy(), {
      [BROWSE_FILTERS.BUDGET_STATUS]: ['Active'],
    });

    const fund = result[0].groups[0].funds[0];
    const budgetIds = fund.budgets.map(b => b.id);

    expect(budgetIds).toEqual(['bud-active']);
  });

  it('should filter expense classes by the selected expense class status', () => {
    const result = filterHierarchy(buildHierarchy(), {
      [BROWSE_FILTERS.EXPENSE_CLASS_STATUS]: ['Active'],
    });

    const budget = result[0].groups[0].funds[0].budgets[0];

    expect(budget.expenseClasses).toHaveLength(1);
    expect(budget.expenseClasses[0].id).toBe('ec-active');
  });

  it('should keep a parent visible with empty children when its own status matches but nothing beneath it does', () => {
    const result = filterHierarchy(buildHierarchy(), {
      [BROWSE_FILTERS.FUND_STATUS]: ['Discontinued'],
    });

    const group = result[0].groups.find(g => g.id === 'grp-active');

    expect(group).toBeDefined();
    expect(group.funds).toHaveLength(0);
  });

  it('should apply multiple level filters simultaneously', () => {
    const result = filterHierarchy(buildHierarchy(), {
      [BROWSE_FILTERS.LEDGER_STATUS]: ['Active'],
      [BROWSE_FILTERS.FUND_STATUS]: ['Active'],
      [BROWSE_FILTERS.BUDGET_STATUS]: ['Active'],
    });

    expect(result).toHaveLength(1);
    expect(result[0].groups[0].funds).toHaveLength(1);
    expect(result[0].groups[0].funds[0].budgets).toHaveLength(1);
  });

  it('should treat an empty selected-status array the same as no filter', () => {
    const result = filterHierarchy(buildHierarchy(), {
      [BROWSE_FILTERS.LEDGER_STATUS]: [],
    });

    expect(result).toHaveLength(2);
  });
});
