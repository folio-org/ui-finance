import { FUNDS_API } from '@folio/stripes-acq-components';

import { getFundActiveBudget } from './getFundActiveBudget';

const fundId = 'fundId';
const budget = {
  id: 'budgetId',
  code: 'budgetCode',
  fundId,
};
const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve(budget),
  })),
};

describe('getFundActiveBudget', () => {
  it('should call API to get fund\'s current budget', async () => {
    const response = await getFundActiveBudget(kyMock)(fundId);

    expect(kyMock.get).toHaveBeenCalledWith(`${FUNDS_API}/${fundId}/budget`);
    expect(response).toEqual(budget);
  });
});
