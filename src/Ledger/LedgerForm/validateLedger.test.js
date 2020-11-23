import '@folio/stripes-acq-components/test/jest/__mock__';

import { validateLedger } from './validateLedger';

describe('validateLedger fn', () => {
  let mutatorFn;

  beforeEach(() => {
    mutatorFn = {
      GET: jest.fn(),
    };
  });

  it('should call API if all params are passed', () => {
    validateLedger(mutatorFn, 'ledgerId', 'code', 'code');

    expect(mutatorFn.GET).toHaveBeenCalled();
  });

  it('should call API if ledger id is not passed', () => {
    validateLedger(mutatorFn, undefined, 'code', 'code');

    expect(mutatorFn.GET).toHaveBeenCalled();
  });

  it('should not call API if value is not passed', () => {
    validateLedger(mutatorFn, 'ledgerId', undefined, 'code');

    expect(mutatorFn.GET).not.toHaveBeenCalled();
  });
});
