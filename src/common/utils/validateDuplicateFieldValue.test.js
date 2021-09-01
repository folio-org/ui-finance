import { validateDuplicateFieldValue } from './validateDuplicateFieldValue';

const params = {
  api: 'api',
  fieldValue: 'value',
  fieldName: 'code',
};

describe('validateDuplicateFieldValue fn', () => {
  let ky;

  beforeEach(() => {
    ky = {
      get: jest.fn(),
    };
  });

  it('should not call API if no value passed', () => {
    validateDuplicateFieldValue({ ky });

    expect(ky.get).not.toHaveBeenCalled();
  });

  it('should call API if value passed', () => {
    ky.get.mockClear();

    validateDuplicateFieldValue({ ...params, ky, id: 'id' });

    expect(ky.get).toHaveBeenCalled();
  });

  it('should return validate required error', async () => {
    const result = await validateDuplicateFieldValue({ ...params, ky, fieldValue: '' });

    expect(result.props).toHaveProperty('id', 'stripes-acq-components.validation.required');
  });

  it('should return validate colon error', async () => {
    const result = await validateDuplicateFieldValue({ ...params, ky, fieldValue: 'co:de' });

    expect(result.props).toHaveProperty('id', 'ui-finance.validation.mustNotIncludeColon');
  });
});
