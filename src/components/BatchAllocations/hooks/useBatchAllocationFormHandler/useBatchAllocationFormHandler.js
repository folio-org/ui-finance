import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  fetchFinanceData,
  resolveSourceQueryIndex,
} from '../../../../common/utils';
import { BATCH_ALLOCATION_FORM_SPECIAL_FIELDS } from '../../constants';
import { useBatchAllocationMutation } from '../useBatchAllocationMutation';

const countBudgets = (data) => data.reduce((acc, { budgetId }) => {
  return acc + (budgetId ? 1 : 0);
}, 0);

export const useBatchAllocationFormHandler = () => {
  const showCallout = useShowCallout();
  const ky = useOkapiKy();

  const { batchAllocate } = useBatchAllocationMutation();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async ({
      fyFinanceData,
      initialValues,
      sourceId,
      sourceType,
      worksheetName,
    }) => {
      return batchAllocate({ fyFinanceData, worksheetName })
        .then(() => showCallout({ messageId: 'ui-finance.actions.allocations.batch.success' }))
        .then(() => {
          const qIndex = resolveSourceQueryIndex(sourceType);

          return fetchFinanceData(ky)({
            searchParams: {
              query: `fiscalYearId=="${fyFinanceData[0].fiscalYearId}" and ${qIndex}=="${sourceId}"`,
              limit: LIMIT_MAX,
            },
          })
            .then((results) => {
              const { fyFinanceData: FINANCE_DATA } = BATCH_ALLOCATION_FORM_SPECIAL_FIELDS;
              const initialBudgetsCount = countBudgets(initialValues[FINANCE_DATA]);
              const currentBudgetsCount = countBudgets(results[FINANCE_DATA]);

              if (currentBudgetsCount > initialBudgetsCount) {
                showCallout({ messageId: 'ui-finance.budget.batch.create.success' });
              }
            })
            .catch(() => {
              showCallout({
                messageId: 'ui-finance.budget.actions.load.error',
                type: 'error',
              });
            });
        });
    },
  });

  return {
    handle: mutateAsync,
    isLoading,
  };
};
