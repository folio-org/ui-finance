import { keyBy } from 'lodash';

import { fundsData } from '../../../../../test/jest/fixtures/export';

import { getAllocatableFunds } from './getAllocatableFunds';

const fundData = Object.values(fundsData)[0];

const ky = {
  get: () => ({
    json: jest.fn(() => Promise.resolve({ funds: fundData.transferTo })),
  }),
};

describe('getAllocatableFunds', () => {
  it('should return allocatable funds export data', async () => {
    const exportData = await getAllocatableFunds(ky)(fundsData);

    expect(exportData).toEqual(keyBy(fundData.transferTo, 'id'));
  });
});
