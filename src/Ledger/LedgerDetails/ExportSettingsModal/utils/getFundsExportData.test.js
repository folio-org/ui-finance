import { keyBy } from 'lodash';

import { fetchAllRecords } from '@folio/stripes-acq-components';

import { fundsData } from '../../../../../test/jest/fixtures/export';
import { getAcqUnitsData } from './getAcqUnitsData';
import { getAllocatableFunds } from './getAllocatableFunds';
import { getFundGroupsData } from './getFundGroupsData';
import { getFundsExportData } from './getFundsExportData';
import { getFundTypesData } from './getFundTypesData';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchAllRecords: jest.fn(),
}));
jest.mock('./getAcqUnitsData', () => ({ getAcqUnitsData: jest.fn(() => () => ({})) }));
jest.mock('./getAllocatableFunds', () => ({ getAllocatableFunds: jest.fn(() => () => ({})) }));
jest.mock('./getFundGroupsData', () => ({ getFundGroupsData: jest.fn() }));
jest.mock('./getFundTypesData', () => ({ getFundTypesData: jest.fn() }));

const params = {
  ledger: {},
  fiscalYearId: 'fiscalYearId',
};

const fundData = Object.values(fundsData)[0];

const ky = {
  get: () => ({
    json: jest.fn(() => Promise.resolve({ funds: [fundData] })),
  }),
};

describe('getFundsExportData', () => {
  beforeEach(() => {
    fetchAllRecords.mockClear().mockReturnValue([fundData]);
    getAcqUnitsData.mockClear().mockReturnValue(() => keyBy(fundData.acqUnits, 'id'));
    getAllocatableFunds.mockClear().mockReturnValue(() => keyBy(fundData.transferFrom, 'id'));
    getFundTypesData.mockClear().mockReturnValue(() => ({ [fundData.fundTypeId]: fundData.fundType }));
    getFundGroupsData.mockClear().mockReturnValue(() => ({ [fundData.id]: fundData.fundGroups }));
  });

  it('should return fund export data', async () => {
    const exportData = await getFundsExportData(ky)(params);

    expect(exportData).toEqual(fundsData);
  });
});
