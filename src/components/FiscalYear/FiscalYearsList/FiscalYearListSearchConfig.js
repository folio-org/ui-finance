import { generateQueryTemplate } from '@folio/stripes-acq-components';

const indexes = [
  'name',
  'code',
];

const keywordIndex = {
  label: 'keyword',
  value: '',
};

export const searchableIndexes = [keywordIndex, ...indexes.map(index => ({ label: index, value: index }))];
export const fiscalYearSearchTemplate = generateQueryTemplate(indexes);
