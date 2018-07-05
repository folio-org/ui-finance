const Filters = () => {
  return [];
};

const SearchableIndexes = [
  { label: 'All', value: 'all', makeQuery: term => `(id="${term}*" or amount="${term}*" or note="${term}* or timestamp="${term}* or tags="${term}*")` },
  { label: 'Amount', value: 'amount', makeQuery: term => `(amount="${term}*")` },
  { label: 'Note', value: 'note', makeQuery: term => `(note="${term}*")` },
  { label: 'Timestamp', value: 'timestamp', makeQuery: term => `(timestamp="${term}*")` },
  { label: 'Tags', value: 'tags', makeQuery: term => `(tags="${term}*")` },
];

export { Filters, SearchableIndexes };
