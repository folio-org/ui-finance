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
    validateDuplicateFieldValue({ ...params, ky });
    validateDuplicateFieldValue({ ...params, ky, id: 'id' });

    expect(ky.get).toHaveBeenCalled();
  });
});
