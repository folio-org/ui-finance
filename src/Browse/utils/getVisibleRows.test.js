import { hierarchyResponse } from 'fixtures';
import { buildHierarchy } from './buildHierarchy';
import { getVisibleRows } from './getVisibleRows';

const { hierarchy } = buildHierarchy(hierarchyResponse);

describe('getVisibleRows', () => {
  it('should only return the ledgers when nothing is expanded', () => {
    const rows = getVisibleRows(hierarchy, new Set());

    expect(rows.map(({ node }) => node.name)).toEqual(['Main Library', 'One-time']);
    expect(rows.every(({ level }) => level === 0)).toBe(true);
  });

  it('should return the children of expanded nodes only, one level deeper', () => {
    const rows = getVisibleRows(hierarchy, new Set(['ledger-1']));

    expect(rows.map(({ node, level }) => [node.name, level])).toEqual([
      ['Main Library', 0],
      ['History', 1],
      ['One-time', 0],
    ]);
    expect(rows[0].isExpanded).toBe(true);
  });
});
