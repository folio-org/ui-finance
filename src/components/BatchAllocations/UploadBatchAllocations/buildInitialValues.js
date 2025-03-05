import isFinite from 'lodash/isFinite';

import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../constants';

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
const numberOrInitialValue = (value) => (value ?? isFinite(Number(value)) ? Number(value) : value);

const buildRowKey = (item, fiscalYear) => [
  valueOrEmptyString(fiscalYear.id),
  valueOrEmptyString(item.fundId),
  valueOrEmptyString(item.budgetId),
].join('-');

export const buildInitialValues = (fileData = [], financeData = [], fiscalYear = {}) => {
  const actualFundIdsSet = new Set(financeData.map((item) => item.fundId));
  const uploadedFundIdsSet = new Set(fileData.map((item) => item.fundId));

  const fileDataMap = fileData.reduce((acc, item) => {
    acc.set(buildRowKey(item, fiscalYear), item);

    return acc;
  }, new Map());

  const fyFinanceData = financeData
    .map((item) => {
      const isFundMissedInFile = !uploadedFundIdsSet.has(item.fundId);
      const dataItem = isFundMissedInFile
        ? item
        : fileDataMap.get(buildRowKey(item, fiscalYear)) || {};

      /* Fields from the CSV file that the form should take into account */
      const dataItemFields = {
        [ALLOCATION_CHANGE]: numberOrInitialValue(dataItem[ALLOCATION_CHANGE]),
        [ALLOWABLE_ENCUMBRANCE]: numberOrInitialValue(dataItem[ALLOWABLE_ENCUMBRANCE]),
        [ALLOWABLE_EXPENDITURE]: numberOrInitialValue(dataItem[ALLOWABLE_EXPENDITURE]),
        [BUDGETS_STATUS]: dataItem[BUDGETS_STATUS] || undefined,
        [FUNDS_STATUS]: dataItem[FUNDS_STATUS] || undefined,
        [TRANSACTION_DESCRIPTION]: dataItem[TRANSACTION_DESCRIPTION],
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
        ...BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
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
