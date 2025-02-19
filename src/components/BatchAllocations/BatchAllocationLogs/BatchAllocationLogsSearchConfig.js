const indexes = [
  'jobName',
  'jobNumber',
];

export const searchableIndexes = [
  {
    labelId: 'ui-finance.allocation.batch.logs.search.keyword',
    value: '',
  },
  ...indexes.map(index => ({ labelId: `ui-finance.allocation.batch.logs.search.${index}`, value: index })),
];

export const getKeywordQuery = query => [...indexes].reduce(
  (acc, sIndex) => {
    if (acc) {
      return `${acc} or ${sIndex}="${query}*"`;
    } else {
      return `${sIndex}="${query}*"`;
    }
  },
  '',
);
