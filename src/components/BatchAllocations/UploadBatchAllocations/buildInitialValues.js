import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../constants';

const TAGS_SEPARATOR = ';';

const valueOrEmptyString = (value) => (value || '').trim();

const buildRowKey = (item) => [
  valueOrEmptyString(item.fundId),
  valueOrEmptyString(item.fundCode),
  valueOrEmptyString(item.fundName),
  valueOrEmptyString(item.budgetId),
  valueOrEmptyString(item.budgetName),
].join('-');

export const buildInitialValues = (fileData = [], financeData = [], fiscalYear = {}) => {
  const actualFundIdsSet = new Set(financeData.map((item) => item.fundId));
  const uploadedFundIdsSet = new Set(fileData.map((item) => item.fundId));

  const fileDataMap = fileData.reduce((acc, item) => {
    acc.set(buildRowKey(item), item);

    return acc;
  }, new Map());

  const fyFinanceData = financeData
    .map((item) => {
      const isFundMissedInFile = !uploadedFundIdsSet.has(item.fundId);
      const dataItem = isFundMissedInFile
        ? item
        : fileDataMap.get(buildRowKey(item)) || {};

      return {
        ...item,
        ...BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
        ...dataItem,
        fiscalYearId: fiscalYear.id,
        fiscalYearCode: fiscalYear.code,
        fundDescription: dataItem.fundDescription || item.fundDescription || '',
        [BATCH_ALLOCATION_FIELDS.transactionTag]: {
          tagList: (
            dataItem[BATCH_ALLOCATION_FIELDS.transactionTag]
              ?.split(TAGS_SEPARATOR)
              ?.map((tag) => tag.trim())
              ?.filter(Boolean)
          ) || [],
        },
        [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isMissed]: isFundMissedInFile,
      };
    })
    .sort((a, b) => a.fundName.localeCompare(b.fundName));

  const invalidFunds = fileData.filter((item) => !actualFundIdsSet.has(item.fundId));

  return {
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.calculatedFinanceData]: null,
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: fyFinanceData,
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.invalidFunds]: invalidFunds,
  };
};
