import { getFundsToDisplay } from './getFundToDisplay';

const funds = [{ id: 'fundId' }];
const sum = { available: 0, allocated: 0, unavailable: 0 };
const budgets = [{ id: 'budgetId', fundId: 'fundId', ...sum }];

test('getFundsToDisplay', () => {
  const fundsToDisplay = getFundsToDisplay(funds, budgets);

  expect(fundsToDisplay).toStrictEqual([{ ...funds[0], ...sum }]);
});
