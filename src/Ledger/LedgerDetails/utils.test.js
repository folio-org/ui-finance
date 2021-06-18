import { getLedgerGroupsSummary } from './utils';

const mutator = { GET: jest.fn() };

test('getLedgerGroupsSummary - should call API', () => {
  mutator.GET.mockClear().mockReturnValue(Promise.resolve([{}]));

  getLedgerGroupsSummary(mutator, 'groupId', 'fiscalYearId');

  expect(mutator.GET).toHaveBeenCalled();
});

test('getLedgerGroupsSummary - should not call API', () => {
  mutator.GET.mockClear();

  getLedgerGroupsSummary(mutator, 'groupId');

  expect(mutator.GET).not.toHaveBeenCalled();
});
