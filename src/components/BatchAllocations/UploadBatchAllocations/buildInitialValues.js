import { BUDGET_STATUSES } from '../../Budget/constants';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
} from '../constants';

const TAGS_SEPARATOR = ';';

const buildRowKey = (item) => `${item.fundId}-${item.fundCode}-${item.fundName}-${item.budgetId}-${item.budgetName}`;

const getBudgetStatus = (item) => {
  if (item[BATCH_ALLOCATION_FIELDS.budgetStatus] === BUDGET_STATUSES.ACTIVE) {
    return item[BATCH_ALLOCATION_FIELDS.budgetStatus];
  }

  const shouldSetActive = (
    item[BATCH_ALLOCATION_FIELDS.budgetAllocationChange] > 0
    && !item[BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]
    && !item[BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]
  );

  return shouldSetActive
    ? BUDGET_STATUSES.ACTIVE
    : item[BATCH_ALLOCATION_FIELDS.budgetStatus];
};

export const buildInitialValues = (fileData = [], financeData = [], fiscalYear = {}) => {
  const actualFundIdsSet = new Set(financeData.map((item) => item.fundId));
  const uploadedFundIdsSet = new Set(fileData.map((item) => item.fundId));

  const fileDataMap = fileData.reduce((acc, item) => {
    acc.set(buildRowKey(item), item);

    return acc;
  }, new Map());

  const fyFinanceData = financeData.map((item) => {
    const isFundMissedInFile = !uploadedFundIdsSet.has(item.fundId);
    const dataItem = isFundMissedInFile
      ? item
      : fileDataMap.get(buildRowKey(item)) || {};

    return {
      ...BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
      ...dataItem,
      fiscalYearId: fiscalYear.id,
      fiscalYearCode: fiscalYear.code,
      fundDescription: dataItem.fundDescription || item.fundDescription || '',
      [BATCH_ALLOCATION_FIELDS.budgetStatus]: getBudgetStatus(dataItem),
      [BATCH_ALLOCATION_FIELDS.transactionTag]: {
        tagList: (
          dataItem[BATCH_ALLOCATION_FIELDS.transactionTag]
            ?.split(TAGS_SEPARATOR)
            ?.map((tag) => tag.trim())
            ?.filter(Boolean)
        ) || [],
      },
      _isMissed: isFundMissedInFile,
    };
  });

  const invalidFunds = fileData.filter((item) => !actualFundIdsSet.has(item.fundId));

  return {
    calculatedFinanceData: null,
    fyFinanceData,
    invalidFunds,
  };
};
