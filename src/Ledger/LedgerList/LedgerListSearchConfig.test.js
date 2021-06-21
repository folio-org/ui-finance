import { getKeywordQuery } from './LedgerListSearchConfig';

test('getKeywordQuery', () => {
  const query = getKeywordQuery('query');

  expect(query).toBe('name="query*" or code="query*" or description="query*"');
});
