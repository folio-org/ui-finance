import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { BUDGETS_API } from '../../../../common/const';

export const useBudget = (budgetId) => {
  const ky = useOkapiKy();
  const namespace = useNamespace({ key: 'budget-transactions' });

  const { data: budget, isLoading } = useQuery(
    [namespace, budgetId],
    () => ky.get(`${BUDGETS_API}/${budgetId}`).json(),
    { enabled: Boolean(budgetId) },
  );

  return ({
    budget,
    isLoading,
  });
};
