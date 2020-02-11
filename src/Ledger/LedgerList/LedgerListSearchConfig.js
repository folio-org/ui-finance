const indexes = [
  'name',
  'code',
];

export const searchableIndexes = [
  {
    labelId: 'ui-finance.ledger.search.keyword',
    value: '',
  },
  ...indexes.map(index => ({ labelId: `ui-finance.ledger.search.${index}`, value: index })),
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
