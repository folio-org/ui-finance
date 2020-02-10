const indexes = [
  'name',
  'code',
];

export const searchableIndexes = [
  {
    labelId: 'ui-finance.groups.search.keyword',
    value: '',
  },
  ...indexes.map(index => ({ labelId: `ui-finance.groups.search.${index}`, value: index })),
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
