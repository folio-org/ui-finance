import { validateFYCode } from './validateFYCode';

describe('validateFYCode fn', () => {
  let ky;

  beforeEach(() => {
    ky = {
      get: jest.fn(),
    };
  });

  it('should not call API if no value passed', () => {
    validateFYCode(ky);

    expect(ky.get).not.toHaveBeenCalled();
  });

  it('should call API if value passed', () => {
    validateFYCode(ky, 'fiscalYearId', 'someValue');
    validateFYCode(ky, undefined, 'someValue');

    expect(ky.get).toHaveBeenCalled();
  });
});
