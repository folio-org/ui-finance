import { getGroupsWithTotals } from './getGroupsWithTotals';

const groups = [{ id: 'groupId' }];
const groupSummaries = [{ groupId: 'groupId', available: 0, allocated: 0, unavailable: 0 }];
const groupSummary = { available: 0, allocated: 0, unavailable: 0 };

test('getGroupsWithTotals', () => {
  const groupTotals = getGroupsWithTotals(groups, groupSummaries);

  expect(groupTotals).toStrictEqual([{ ...groups[0], ...groupSummary }]);
});
