import { BATCH_ALLOCATION_COLUMNS } from '../constants';

export const getBatchAllocationColumnMapping = ({ intl }) => {
  return BATCH_ALLOCATION_COLUMNS.reduce((acc, column) => {
    return { ...acc, [column]: intl.formatMessage({ id: `ui-finance.transaction.allocation.batch.columns.${column}` }) };
  }, {});
};

export const getFormattedOptions = (intl, dataOptions) => dataOptions.map(({ labelId, ...rest }) => ({
  label: intl.formatMessage({ id: labelId }),
  ...rest,
}));
