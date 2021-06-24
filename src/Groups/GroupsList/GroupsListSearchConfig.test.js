import { getKeywordQuery } from './GroupsListSearchConfig';

test('getKeywordQuery', () => {
  const query = getKeywordQuery('query');

  expect(query).toBe('name="query*" or code="query*" or description="query*"');
});
