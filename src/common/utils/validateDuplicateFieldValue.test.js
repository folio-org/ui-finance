import { validateDuplicateFieldValue } from './validateDuplicateFieldValue';

describe('validateDuplicateFieldValue fn', () => {
  let ky;

  beforeEach(() => {
    ky = {
      get: jest.fn(),
    };
  });

  it('should not call API if no value passed', () => {
    validateDuplicateFieldValue(ky);

    expect(ky.get).not.toHaveBeenCalled();
  });

  it('should call API if value passed', () => {
    validateDuplicateFieldValue(ky, 'api', 'id', 'value');
    validateDuplicateFieldValue(ky, 'api', undefined, 'value');

    expect(ky.get).toHaveBeenCalled();
  });
});
