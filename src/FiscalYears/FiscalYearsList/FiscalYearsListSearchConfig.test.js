import { getKeywordQuery } from './FiscalYearsListSearchConfig';

test('getKeywordQuery', () => {
  const query = getKeywordQuery('query');

  expect(query).toBe('name="query*" or code="query*" or description="query*"');
});
