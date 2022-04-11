import {
  chunk,
  keyBy,
} from 'lodash/fp';

import {
  EXPENSE_CLASSES_API,
  fetchExportDataByIds,
} from '@folio/stripes-acq-components';

import { BUDGETS_API } from '../../../../common/const';
import { EXPORT_EXPENSE_CLASS_STATUSES_MAP } from '../constants';
import { getUniqItems } from './getUniqItems';

const CONCURRENT_REQUESTS_COUNT = 5;

const getBudgetExpenseClassTotals = (ky) => async ({ budgetIds, expenseClassesConfig }) => {
  const budgetExpenseClassTotalsData = await chunk(CONCURRENT_REQUESTS_COUNT, budgetIds)
    .reduce(async (acc, budgetIdsChunk) => {
      const accResolved = await acc;

      const chunkResponsesMap = await Promise.all(budgetIdsChunk.map(budgetId => (
        ky
          .get(`${BUDGETS_API}/${budgetId}/expense-classes-totals`)
          .json()
          .then(({ budgetExpenseClassTotals }) => {
            return budgetExpenseClassTotals.filter(
              ({ expenseClassStatus }) => (
                EXPORT_EXPENSE_CLASS_STATUSES_MAP[expenseClassesConfig]?.includes(expenseClassStatus)
              ),
            );
          })
          .then((budgetExpenseClassTotals) => ({ budgetId, budgetExpenseClassTotals }))
      )))
        .then(responses => {
          return responses.reduce((responsesMap, { budgetId, budgetExpenseClassTotals }) => {
            return {
              ...responsesMap,
              [budgetId]: budgetExpenseClassTotals,
            };
          }, {});
        });

      return Promise
        .resolve({ ...accResolved, ...chunkResponsesMap });
    }, Promise.resolve({}));

  return budgetExpenseClassTotalsData;
};

const getExpenseClasses = (ky) => async (expenseClassIds) => {
  const expenseClasses = await fetchExportDataByIds({
    api: EXPENSE_CLASSES_API,
    ids: expenseClassIds,
    ky,
    records: 'expenseClasses',
  });

  return keyBy('id', expenseClasses);
};

export const getBudgetExpenseClassesExportData = (ky) => async ({
  budgetsData,
  expenseClasses: expenseClassesConfig,
}) => {
  if (!EXPORT_EXPENSE_CLASS_STATUSES_MAP[expenseClassesConfig]) return Promise.resolve([]);

  const budgetIds = Object.keys(budgetsData);
  const budgetExpenseClassTotalsMap = await getBudgetExpenseClassTotals(ky)({ budgetIds, expenseClassesConfig });

  const expenseClassIds = getUniqItems(
    budgetExpenseClassTotalsMap,
    (expenseClasses) => expenseClasses.map(({ id }) => id),
  );

  const expenseClassesMap = await getExpenseClasses(ky)(expenseClassIds);

  const expenseClassesExportData = Object.entries(budgetExpenseClassTotalsMap).reduce(
    (acc, [budgetId, totals]) => {
      return {
        ...acc,
        [budgetId]: totals.map((budgetExpenseClassTotal) => {
          return {
            ...expenseClassesMap[budgetExpenseClassTotal.id],
            ...budgetExpenseClassTotal,
          };
        }),
      };
    },
    {},
  );

  return expenseClassesExportData;
};
