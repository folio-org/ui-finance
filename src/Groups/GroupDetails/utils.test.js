import { getGroupSummary } from './utils';

const mutator = { GET: jest.fn() };

test('getGroupSummary - should call API', () => {
  mutator.GET.mockClear().mockReturnValue(Promise.resolve([{}]));

  getGroupSummary(mutator, 'groupId', 'fiscalYearId');

  expect(mutator.GET).toHaveBeenCalled();
});

test('getGroupSummary - should not call API', () => {
  mutator.GET.mockClear();

  getGroupSummary(mutator, 'groupId');

  expect(mutator.GET).not.toHaveBeenCalled();
});
