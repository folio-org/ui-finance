export const getExpenseClassesForSelect = (expenseClasses = []) => (
  expenseClasses.map(({ id, name }) => ({
    label: name,
    value: id,
  }))
);
