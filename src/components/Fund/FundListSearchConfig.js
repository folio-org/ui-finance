import { generateQueryTemplate } from '@folio/stripes-acq-components';

const indexes = [
  'name',
  'code',
  'externalAccountNo',
];

export const searchableIndexes = indexes.map(index => ({ label: index, value: index }));
export const fundSearchTemplate = generateQueryTemplate(['name']);
