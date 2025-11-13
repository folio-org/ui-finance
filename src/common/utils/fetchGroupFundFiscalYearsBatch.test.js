import { GROUP_FUND_FISCAL_YEARS_BATCH_API } from '../const';
import { fetchGroupFundFiscalYearsBatch } from './fetchGroupFundFiscalYearsBatch';

describe('fetchGroupFundFiscalYearsBatch', () => {
  let httpClient;
  let mockPost;
  let mockJson;

  beforeEach(() => {
    mockJson = jest.fn();
    mockPost = jest.fn().mockReturnValue({ json: mockJson });
    httpClient = { post: mockPost };
  });

  it('should call httpClient.post with correct API endpoint and data', async () => {
    const fundIds = ['fund1', 'fund2'];
    const filters = { fiscalYearId: 'fy1', groupId: 'group1' };
    
    fetchGroupFundFiscalYearsBatch(httpClient)(fundIds, filters);

    expect(mockPost).toHaveBeenCalledWith(GROUP_FUND_FISCAL_YEARS_BATCH_API, {
      json: {
        fiscalYearId: 'fy1',
        fundIds: ['fund1', 'fund2'],
        groupId: 'group1',
      },
    });
  });

  it('should call json() on the response', () => {
    const fundIds = ['fund1'];
    
    fetchGroupFundFiscalYearsBatch(httpClient)(fundIds);

    expect(mockJson).toHaveBeenCalled();
  });

  it('should handle empty filters', () => {
    const fundIds = ['fund1', 'fund2'];
    
    fetchGroupFundFiscalYearsBatch(httpClient)(fundIds);

    expect(mockPost).toHaveBeenCalledWith(GROUP_FUND_FISCAL_YEARS_BATCH_API, {
      json: {
        fiscalYearId: undefined,
        fundIds: ['fund1', 'fund2'],
        groupId: undefined,
      },
    });
  });

  it('should pass additional options to httpClient.post', () => {
    const fundIds = ['fund1'];
    const filters = { fiscalYearId: 'fy1' };
    const options = { signal: new AbortController().signal };
    
    fetchGroupFundFiscalYearsBatch(httpClient)(fundIds, filters, options);

    expect(mockPost).toHaveBeenCalledWith(GROUP_FUND_FISCAL_YEARS_BATCH_API, {
      json: {
        fiscalYearId: 'fy1',
        fundIds: ['fund1'],
        groupId: undefined,
      },
      signal: options.signal,
    });
  });

  it('should return the result from json()', async () => {
    const expectedData = { data: 'test' };
    mockJson.mockResolvedValue(expectedData);
    const fundIds = ['fund1'];
    
    const result = fetchGroupFundFiscalYearsBatch(httpClient)(fundIds);

    expect(result).resolves.toEqual(expectedData);
  });

  it('should handle partial filters', () => {
    const fundIds = ['fund1'];
    const filters = { fiscalYearId: 'fy1' };
    
    fetchGroupFundFiscalYearsBatch(httpClient)(fundIds, filters);

    expect(mockPost).toHaveBeenCalledWith(GROUP_FUND_FISCAL_YEARS_BATCH_API, {
      json: {
        fiscalYearId: 'fy1',
        fundIds: ['fund1'],
        groupId: undefined,
      },
    });
  });
});