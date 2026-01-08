import {
  chunk,
  keyBy,
} from 'lodash';

import {
  EXPENSE_CLASSES_API,
  fetchExportDataByIds,
} from '@folio/stripes-acq-components';

import { BUDGETS_API } from '../../../../common/const';
import { getUniqItems } from '../../../../common/utils';
import { EXPORT_EXPENSE_CLASS_STATUSES_MAP } from '../constants';

const CONCURRENT_REQUESTS_COUNT = 5;

const fetchBudgetExpenseClassesTotals = (ky) => ({ budgetId, expenseClassesConfig }) => (
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
);

const getBudgetsExpenseClassesTotals = (ky) => async ({ budgetIds, expenseClassesConfig }) => {
  return (
    chunk(budgetIds, CONCURRENT_REQUESTS_COUNT)
      .reduce(async (acc, budgetIdsChunk) => {
        const accResolved = await acc;

        const chunkResponsesMap = await Promise.all(budgetIdsChunk.map(budgetId => {
          return fetchBudgetExpenseClassesTotals(ky)({ budgetId, expenseClassesConfig });
        }))
          .then(responses => {
            return responses.reduce((responsesMap, { budgetId, budgetExpenseClassTotals }) => ({
              ...responsesMap,
              [budgetId]: budgetExpenseClassTotals,
            }), {});
          });

        return Promise.resolve({ ...accResolved, ...chunkResponsesMap });
      }, Promise.resolve({}))
  );
};

const getExpenseClasses = (ky) => async (expenseClassIds) => {
  const expenseClasses = await fetchExportDataByIds({
    api: EXPENSE_CLASSES_API,
    ids: expenseClassIds,
    ky,
    records: 'expenseClasses',
  });

  return keyBy(expenseClasses, 'id');
};

export const getBudgetExpenseClassesExportData = (ky) => async ({
  budgetsData,
  expenseClasses: expenseClassesConfig,
}) => {
  if (!EXPORT_EXPENSE_CLASS_STATUSES_MAP[expenseClassesConfig]) return Promise.resolve([]);

  const budgetsExpenseClassesTotalsMap = await getBudgetsExpenseClassesTotals(ky)({
    budgetIds: Object.keys(budgetsData),
    expenseClassesConfig,
  });

  const expenseClassIds = getUniqItems(
    budgetsExpenseClassesTotalsMap,
    (expenseClasses) => expenseClasses.map(({ id }) => id),
  );

  const expenseClassesMap = await getExpenseClasses(ky)(expenseClassIds);

  return Object.entries(budgetsExpenseClassesTotalsMap).reduce(
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
};
