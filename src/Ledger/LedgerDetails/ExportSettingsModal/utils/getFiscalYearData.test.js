import { getFiscalYearData } from './getFiscalYearData';

const FY = {
  id: 'fiscalYearId',
};

const ky = {
  get: () => ({
    json: jest.fn(() => FY),
  }),
};

describe('getFiscalYearData', () => {
  it('should return FY data', () => {
    expect(getFiscalYearData(ky)('fiscalYearId')).toEqual(FY);
  });
});
