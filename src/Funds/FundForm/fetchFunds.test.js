import { fetchFundsByName } from './fetchFunds';

const mutator = { GET: jest.fn() };

test('fetchFundsByName - should call API', () => {
  mutator.GET.mockClear().mockReturnValue(Promise.resolve([{}]));

  fetchFundsByName(mutator, 'fundId', 'fundName', 'ledgerId');

  expect(mutator.GET).toHaveBeenCalled();
});

test('fetchFundsByName - should not call API', () => {
  mutator.GET.mockClear();

  fetchFundsByName(mutator, 'fundId', 'fundName');

  expect(mutator.GET).not.toHaveBeenCalled();
});
