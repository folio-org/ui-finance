import { validateFYName } from './validateFYName';

describe('validateFYName fn', () => {
  let ky;

  beforeEach(() => {
    ky = {
      get: jest.fn(),
    };
  });

  it('should call API if no value passed', () => {
    validateFYName(ky);

    expect(ky.get).not.toHaveBeenCalled();
  });

  it('should call API if value passed', () => {
    validateFYName(ky, 'fiscalYearId', 'someValue');
    validateFYName(ky, undefined, 'someValue');

    expect(ky.get).toHaveBeenCalled();
  });
});
