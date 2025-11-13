import { fundsData } from 'fixtures/export';
import {
  GROUPS_API,
  GROUP_FUND_FISCAL_YEARS_BATCH_API,
} from '../../../../common/const';
import { getFundGroupsData } from './getFundGroupsData';

const fundData = Object.values(fundsData)[0];

const ky = {
  get: (url) => ({
    json: jest.fn(() => Promise.resolve(
      ({
        [GROUPS_API]: { groups: fundData.fundGroups },
      })[url],
    )),
  }),
  post: (url) => ({
    json: jest.fn(() => Promise.resolve(
      ({
        [GROUP_FUND_FISCAL_YEARS_BATCH_API]: {
          groupFundFiscalYears: fundData.fundGroups.map(({ id }) => ({ fundId: fundData.id, groupId: id })),
        },
      })[url],
    )),
  }),
};

describe('getFundGroupsData', () => {
  it('should return fund groups export data', async () => {
    const exportData = await getFundGroupsData(ky)(fundsData, 'fiscalYearId');

    expect(exportData).toEqual({ [fundData.id]: fundData.fundGroups });
  });
});
