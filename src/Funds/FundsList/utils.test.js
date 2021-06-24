import { fetchFundLedgers } from './utils';

const mutatorMock = { GET: jest.fn() };
const funds = [{ id: 'fundId', ledgerId: 'ledgerId' }];

test('fetchFundLedgers - should fetch funds', () => {
  fetchFundLedgers(mutatorMock, funds, {});

  expect(mutatorMock.GET).toHaveBeenCalled();
});

test('fetchFundLedgers - should not fetch funds', () => {
  mutatorMock.GET.mockClear();

  fetchFundLedgers(mutatorMock, funds, { [funds[0].ledgerId]: funds[0] });

  expect(mutatorMock.GET).not.toHaveBeenCalled();
});
