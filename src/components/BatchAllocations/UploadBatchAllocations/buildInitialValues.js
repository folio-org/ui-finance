import { BUDGET_STATUSES } from '../../Budget/constants';
import { isBudgetStatusShouldBeSet } from '../BatchAllocationsForm/utils';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../constants';
import { parseNumberOrInitial } from '../utils';

const TAGS_SEPARATOR = ';';

const {
  budgetAllocationChange: ALLOCATION_CHANGE,
  budgetAllowableEncumbrance: ALLOWABLE_ENCUMBRANCE,
  budgetAllowableExpenditure: ALLOWABLE_EXPENDITURE,
  budgetStatus: BUDGETS_STATUS,
  fundStatus: FUNDS_STATUS,
  transactionDescription: TRANSACTION_DESCRIPTION,
  transactionTag: TRANSACTION_TAGS,
} = BATCH_ALLOCATION_FIELDS;

const valueOrEmptyString = (value) => (value || '').trim();

const getInitialBudgetStatus = (item, fiscalYear, currentFiscalYear) => {
  const shouldSetStatus = isBudgetStatusShouldBeSet(item);

  if (shouldSetStatus) {
    return new Date(fiscalYear?.periodStart) > new Date(currentFiscalYear?.periodStart)
      ? BUDGET_STATUSES.PLANNED
      : BUDGET_STATUSES.ACTIVE;
  }

  return item[BUDGETS_STATUS] || undefined;
};

const buildRowKey = (item, fiscalYear) => [
  valueOrEmptyString(fiscalYear.id),
  valueOrEmptyString(item.fundId),
  valueOrEmptyString(item.budgetId),
].join('-');

export const buildInitialValues = (
  fileData = [],
  financeData = [],
  fiscalYear = {}, // Selected fiscal year for which the batch allocation is being uploaded.
  currentFiscalYears = [], // Current fiscal years for the source (group or ledger) to which the batch allocation belongs.
) => {
  const actualFundIdsSet = new Set(financeData.map((item) => item.fundId));
  const uploadedFundIdsSet = new Set(fileData.map((item) => item.fundId));

  const fileDataMap = fileData.reduce((acc, item) => {
    acc.set(buildRowKey(item, fiscalYear), item);

    return acc;
  }, new Map());

  const currentFiscalYear = currentFiscalYears.find(({ series }) => series === fiscalYear.series);

  const fyFinanceData = financeData
    .map((item) => {
      const isFundMissedInFile = !uploadedFundIdsSet.has(item.fundId);
      const dataItem = isFundMissedInFile
        ? item
        : fileDataMap.get(buildRowKey(item, fiscalYear)) || {};

      /* Fields from the CSV file that the form should take into account */
      const dataItemFields = {
        [ALLOCATION_CHANGE]: parseNumberOrInitial(dataItem[ALLOCATION_CHANGE]),
        [ALLOWABLE_ENCUMBRANCE]: parseNumberOrInitial(dataItem[ALLOWABLE_ENCUMBRANCE]),
        [ALLOWABLE_EXPENDITURE]: parseNumberOrInitial(dataItem[ALLOWABLE_EXPENDITURE]),
        [BUDGETS_STATUS]: getInitialBudgetStatus(dataItem, fiscalYear, currentFiscalYear),
        [FUNDS_STATUS]: dataItem[FUNDS_STATUS] || undefined,
        [TRANSACTION_DESCRIPTION]: dataItem[TRANSACTION_DESCRIPTION] || undefined,
        [TRANSACTION_TAGS]: {
          tagList: (
            dataItem[TRANSACTION_TAGS]
              ?.split(TAGS_SEPARATOR)
              ?.map((tag) => tag.trim())
              ?.filter(Boolean)
          ) || [],
        },
      };

      return {
        ...structuredClone(BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES),
        ...item,
        ...dataItemFields,
        fiscalYearId: fiscalYear.id,
        fiscalYearCode: fiscalYear.code,
        [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isMissed]: isFundMissedInFile,
      };
    });

  const invalidFunds = fileData.filter((item) => !actualFundIdsSet.has(item.fundId));

  return {
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.calculatedFinanceData]: null,
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: fyFinanceData,
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.invalidFunds]: invalidFunds,
  };
};
