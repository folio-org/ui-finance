import { hierarchyResponse } from 'fixtures';
import { buildHierarchy } from './buildHierarchy';

describe('buildHierarchy', () => {
  const { hierarchy, counts, keysByType } = buildHierarchy(hierarchyResponse);

  it('should nest ledger, group, fund, budget and expense class', () => {
    const ledger = hierarchy.find(({ id }) => id === 'ledger-2');
    const group = ledger.children[0];
    const fund = group.children.find(({ id }) => id === 'fund-1');
    const budget = fund.children[0];

    expect([ledger.type, group.type, fund.type, budget.type, budget.children[0].type])
      .toEqual(['ledger', 'group', 'fund', 'budget', 'expenseClass']);
    expect(ledger).toEqual(expect.objectContaining({ name: 'One-time', code: 'ONETIME' }));
    expect(budget).toEqual(expect.objectContaining({ name: 'AFRICAHIST-FY2024', status: 'Active' }));
    expect(budget.children[0]).toEqual(expect.objectContaining({ name: 'Electronic', status: 'Active' }));
  });

  it('should sort every level by name', () => {
    const ledger = hierarchy.find(({ id }) => id === 'ledger-2');
    const fund = ledger.children[0].children.find(({ id }) => id === 'fund-1');

    expect(hierarchy.map(({ name }) => name)).toEqual(['Main Library', 'One-time']);
    expect(ledger.children[0].children.map(({ name }) => name)).toEqual(['African History', 'Asian History']);
    expect(fund.children[0].children.map(({ name }) => name)).toEqual(['Electronic', 'Print']);
  });

  it('should list funds without a group under an "Ungrouped" group placed last', () => {
    const ledger = hierarchy.find(({ id }) => id === 'ledger-2');
    const ungrouped = ledger.children[ledger.children.length - 1];

    expect(ungrouped).toEqual(expect.objectContaining({ isUngrouped: true, type: 'group' }));
    expect(ungrouped.children.map(({ name }) => name)).toEqual(['Exchanges']);
  });

  it('should not add an "Ungrouped" group to a ledger whose funds all have a group', () => {
    const ledger = hierarchy.find(({ id }) => id === 'ledger-1');

    expect(ledger.children.map(({ id }) => id)).toEqual(['group-1']);
  });

  it('should list a group under every ledger that has funds in it', () => {
    const groupKeys = keysByType.group;

    expect(groupKeys).toEqual(expect.arrayContaining(['ledger-1/group-1', 'ledger-2/group-1']));
  });

  it('should count each record once and not count the "Ungrouped" group', () => {
    expect(counts).toEqual({
      ledgers: 2,
      groups: 1,
      funds: 4,
      budgets: 2,
      expenseClasses: 2,
    });
  });

  it('should return an empty hierarchy when there is no data', () => {
    expect(buildHierarchy({ fiscalYearHierarchies: [] })).toEqual({
      hierarchy: [],
      counts: { ledgers: 0, groups: 0, funds: 0, budgets: 0, expenseClasses: 0 },
      keysByType: {},
    });
  });
});
