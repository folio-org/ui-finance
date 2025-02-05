import {
  ALLOCATION_WORKSHEET_REQUIRED_FIELDS,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS,
} from '../../../../const';

export const composeValidators = (...validators) => (value) => {
  return validators.reduce((error, validator) => error || validator(value), undefined);
};

export const isCsvFile = ({ intl }) => ({ fileName }) => {
  if (!fileName.endsWith('.csv')) {
    return intl.formatMessage({ id: 'ui-finance.batchAllocations.uploadWorksheet.validation.error.invalidFileType' });
  }

  return undefined;
};

export const hasRows = ({ intl }) => ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return intl.formatMessage({ id: 'ui-finance.batchAllocations.uploadWorksheet.validation.error.emptyFile' });
  }

  return undefined;
};

export const hasRequiredHeaders = ({ intl, requiredHeaders }) => ({ data }) => {
  const fileHeaders = Object.keys(data[0] || {});
  const missingHeaders = (
    requiredHeaders
      .filter((header) => !fileHeaders.includes(header))
      .map((header) => EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS[header])
  );

  if (missingHeaders.length > 0) {
    return intl.formatMessage(
      { id: 'ui-finance.batchAllocations.uploadWorksheet.validation.error.requiredHeaders' },
      { headers: missingHeaders.join(', ') },
    );
  }

  return undefined;
};

export const hasConsistentFieldValues = ({ intl, fields }) => ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return undefined;
  }

  for (const field of fields) {
    const uniqueValues = new Set(data.map((row) => row[field]));

    if (uniqueValues.size > 1) {
      return intl.formatMessage(
        { id: 'ui-finance.batchAllocations.uploadWorksheet.validation.error.inconsistentField' },
        { field },
      );
    }
  }

  return undefined;
};

export const validateFile = ({ intl }) => (value) => {
  if (!value) return undefined;

  return composeValidators(
    isCsvFile({ intl }),
    hasRows({ intl }),
    hasRequiredHeaders({ intl, requiredHeaders: ALLOCATION_WORKSHEET_REQUIRED_FIELDS }),
    hasConsistentFieldValues({ intl, fields: [EXPORT_ALLOCATION_WORKSHEET_FIELDS.fiscalYear] }),
  )(value);
};
