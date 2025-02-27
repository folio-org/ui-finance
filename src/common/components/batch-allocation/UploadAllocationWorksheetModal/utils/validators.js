import {
  ALLOCATION_WORKSHEET_REQUIRED_FIELDS,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS,
  FILE_EXTENSIONS,
} from '../../../../const';
import { composeValidators } from '../../../../utils';

export const isCsvFile = ({ intl }) => ({ fileName }) => {
  if (!fileName.endsWith(FILE_EXTENSIONS.csv)) {
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

export const hasRequiredHeaders = ({ intl, headers }) => ({ data }) => {
  const fileHeaders = Object.keys(data[0] || {});
  const missingHeaders = (
    headers
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

export const hasRequiredFieldValues = ({ intl, fields }) => ({ data, fileName }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return undefined;
  }

  return data.some((row) => fields.some((field) => !row[field]))
    ? intl.formatMessage(
      { id: 'ui-finance.batchAllocations.uploadWorksheet.validation.error.parseFailed' },
      { fileName },
    )
    : undefined;
};

export const validateFile = ({ intl }) => (value) => {
  if (!value) return undefined;

  return composeValidators(
    isCsvFile({ intl }),
    hasRows({ intl }),
    hasRequiredHeaders({
      intl,
      headers: ALLOCATION_WORKSHEET_REQUIRED_FIELDS,
    }),
    hasRequiredFieldValues({
      intl,
      fields: [
        EXPORT_ALLOCATION_WORKSHEET_FIELDS.fiscalYear,
        EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundId,
      ],
    }),
    hasConsistentFieldValues({
      intl,
      fields: [EXPORT_ALLOCATION_WORKSHEET_FIELDS.fiscalYear],
    }),
  )(value);
};
