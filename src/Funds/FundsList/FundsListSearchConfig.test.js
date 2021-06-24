import { getKeywordQuery } from './FundsListSearchConfig';

test('getKeywordQuery', () => {
  const query = getKeywordQuery('query');

  expect(query).toBe('name="query*" or code="query*" or externalAccountNo="query*" or description="query*"');
});
