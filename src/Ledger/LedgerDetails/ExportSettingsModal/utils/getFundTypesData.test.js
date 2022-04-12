import { keyBy } from 'lodash';

import { fundsData } from '../../../../../test/jest/fixtures/export';

import { getFundTypesData } from './getFundTypesData';

const fundData = Object.values(fundsData)[0];

const ky = {
  get: () => ({
    json: jest.fn(() => Promise.resolve({ fundTypes: [fundData.fundType] })),
  }),
};

describe('getFundTypesData', () => {
  it('should return fund types export data', async () => {
    const exportData = await getFundTypesData(ky)(fundsData);

    expect(exportData).toEqual(keyBy([fundData.fundType], 'id'));
  });
});
