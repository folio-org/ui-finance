import { getExpenseClassesForSelect } from './getExpenseClassesForSelect';

const expenseClasses = [{ name: 'name', id: 'id' }];
const expenseClassesOptions = [{ label: 'name', value: 'id' }];

test('Expense classes are not passed', () => {
  const options = getExpenseClassesForSelect();

  expect(options).toStrictEqual([]);
});

test('Expense class options', () => {
  const options = getExpenseClassesForSelect(expenseClasses);

  expect(options).toStrictEqual(expenseClassesOptions);
});
