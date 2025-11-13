import keyBy from 'lodash/keyBy';

import { fundsData } from 'fixtures/export';
import { getAcqUnitsData } from './getAcqUnitsData';

const fundData = Object.values(fundsData)[0];

const ky = {
  get: () => ({
    json: jest.fn(() => Promise.resolve({ acquisitionsUnits: fundData.acqUnits })),
  }),
};

describe('getAcqUnitsData', () => {
  it('should return acq units export data', async () => {
    const exportData = await getAcqUnitsData(ky)(fundsData);

    expect(exportData).toEqual(keyBy(fundData.acqUnits, 'id'));
  });
});
