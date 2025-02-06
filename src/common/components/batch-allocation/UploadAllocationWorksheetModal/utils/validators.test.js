import { ALLOCATION_WORKSHEET_REQUIRED_FIELDS } from '../../../../const';
import {
  composeValidators,
  isCsvFile,
  hasRows,
  hasRequiredHeaders,
  hasConsistentFieldValues,
  validateFile,
} from './validators';

describe('composeValidators', () => {
  it('should return the first error encountered', () => {
    const error1 = 'Error 1';
    const error2 = 'Error 2';
    const validator1 = jest.fn(() => error1);
    const validator2 = jest.fn(() => error2);
    const composed = composeValidators(validator1, validator2);
    const result = composed('test-value');

    expect(result).toBe(error1);
    expect(validator1).toHaveBeenCalledWith('test-value');
    expect(validator2).not.toHaveBeenCalled();
  });

  it('should return undefined if no errors', () => {
    const validator1 = jest.fn(() => undefined);
    const validator2 = jest.fn(() => undefined);
    const composed = composeValidators(validator1, validator2);
    const result = composed('test-value');

    expect(result).toBeUndefined();
  });
});

describe('isCsvFile', () => {
  const intl = {
    formatMessage: jest.fn(({ id }) => id),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if file is not CSV', () => {
    const validator = isCsvFile({ intl });
    const result = validator({ fileName: 'file.txt' });

    expect(result).toEqual('ui-finance.batchAllocations.uploadWorksheet.validation.error.invalidFileType');
  });

  it('should return undefined for CSV file', () => {
    const validator = isCsvFile({ intl });
    const result = validator({ fileName: 'file.csv' });

    expect(result).toBeUndefined();
  });
});

describe('hasRows', () => {
  const intl = {
    formatMessage: jest.fn(({ id }) => id),
  };

  it('should return error if data is not an array', () => {
    const validator = hasRows({ intl });
    const result = validator({ data: null });

    expect(result).toEqual('ui-finance.batchAllocations.uploadWorksheet.validation.error.emptyFile');
  });

  it('should return error if data is empty', () => {
    const validator = hasRows({ intl });
    const result = validator({ data: [] });

    expect(result).toEqual('ui-finance.batchAllocations.uploadWorksheet.validation.error.emptyFile');
  });

  it('should return undefined if data has rows', () => {
    const validator = hasRows({ intl });
    const result = validator({ data: [{}] });

    expect(result).toBeUndefined();
  });
});

describe('hasRequiredHeaders', () => {
  const intl = {
    formatMessage: jest.fn(({ id }, values) => `${id} ${values.headers}`),
  };

  it('should return error if headers are missing', () => {
    const validator = hasRequiredHeaders({ intl, requiredHeaders: ['field1', 'field2'] });
    const result = validator({ data: [{ field1: 'value' }] }); // Missing field2

    expect(result).toContain('ui-finance.batchAllocations.uploadWorksheet.validation.error.requiredHeaders');
  });

  it('should return undefined if all headers are present', () => {
    const validator = hasRequiredHeaders({ intl, requiredHeaders: ['field1', 'field2'] });
    const result = validator({ data: [{ field1: 'v1', field2: 'v2' }] });

    expect(result).toBeUndefined();
  });
});

describe('hasConsistentFieldValues', () => {
  const intl = {
    formatMessage: jest.fn(({ id }, values) => `${id} ${values.field}`),
  };

  it('should return error if field values are inconsistent', () => {
    const validator = hasConsistentFieldValues({ intl, fields: ['fiscalYear'] });
    const data = [
      { fiscalYear: 'FY2020' },
      { fiscalYear: 'FY2021' },
    ];
    const result = validator({ data });

    expect(result).toContain('ui-finance.batchAllocations.uploadWorksheet.validation.error.inconsistentField');
  });

  it('should return undefined if field values are consistent', () => {
    const validator = hasConsistentFieldValues({ intl, fields: ['fiscalYear'] });
    const data = [
      { fiscalYear: 'FY2020' },
      { fiscalYear: 'FY2020' },
    ];
    const result = validator({ data });

    expect(result).toBeUndefined();
  });
});

describe('validateFile', () => {
  const intl = {
    formatMessage: jest.fn(({ id }) => id),
  };

  const stubData = Object.values(ALLOCATION_WORKSHEET_REQUIRED_FIELDS).reduce((acc, val) => {
    acc[val] = 'stub';

    return acc;
  }, {});

  const validFile = {
    fileName: 'allocations.csv',
    data: [
      { ...stubData, fiscalYear: 'FY2020' },
      { ...stubData, fiscalYear: 'FY2020' },
    ],
  };

  it('should return undefined for valid file', () => {
    const validator = validateFile({ intl });
    const result = validator(validFile);

    expect(result).toBeUndefined();
  });

  it('should return error for non-CSV file', () => {
    const validator = validateFile({ intl });
    const result = validator({ ...validFile, fileName: 'file.txt' });

    expect(result).toEqual('ui-finance.batchAllocations.uploadWorksheet.validation.error.invalidFileType');
  });

  it('should return error for empty data', () => {
    const validator = validateFile({ intl });
    const result = validator({ ...validFile, data: [] });

    expect(result).toEqual('ui-finance.batchAllocations.uploadWorksheet.validation.error.emptyFile');
  });

  it('should return error for missing headers', () => {
    const validator = validateFile({ intl });
    const result = validator({ ...validFile, data: [{ field1: 'v1' }] });

    expect(result).toEqual('ui-finance.batchAllocations.uploadWorksheet.validation.error.requiredHeaders');
  });

  it('should return error for inconsistent fiscalYear', () => {
    const validator = validateFile({ intl });
    const data = [
      { ...validFile.data[0], fiscalYear: 'FY2020' },
      { ...validFile.data[1], fiscalYear: 'FY2021' },
    ];
    const result = validator({ ...validFile, data });

    expect(result).toEqual('ui-finance.batchAllocations.uploadWorksheet.validation.error.inconsistentField');
  });
});
