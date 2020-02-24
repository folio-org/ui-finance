const indexes = [
  'name',
  'code',
  'externalAccountNo',
];

export const searchableIndexes = [
  {
    labelId: 'ui-finance.fund.search.keyword',
    value: '',
  },
  ...indexes.map(index => ({ labelId: `ui-finance.fund.search.${index}`, value: index })),
];

export const getKeywordQuery = query => [...indexes, 'description'].reduce(
  (acc, sIndex) => {
    if (acc) {
      return `${acc} or ${sIndex}="${query}*"`;
    } else {
      return `${sIndex}="${query}*"`;
    }
  },
  '',
);
