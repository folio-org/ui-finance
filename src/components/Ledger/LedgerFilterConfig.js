// import LanguageList from './Languages';
// import CountryList from './Country';
const Filters = () => {
  // const CL = CountryList.map(item => ({ name: item.label, cql: item.value }));
  // const LL = LanguageList.map(item => ({ name: item.label, cql: item.value }));

  return [
    {
      label: 'Fiscal Year(s)',
      name: 'fiscal_years',
      cql: 'fiscal_years',
      values: []
    },
    {
      label: 'Tags',
      name: 'tags',
      cql: 'tags',
      values: []
    }
  ];
};

const SearchableIndexes = [
  { label: 'All', value: 'all', makeQuery: term => `(name="${term}*" or code="${term}*" or tags="${term}*")` },
  { label: 'Name', value: 'name', makeQuery: term => `(name="${term}*")` },
  { label: 'Code', value: 'code', makeQuery: term => `(code="${term}*")` },
  // { label: 'Tags', value: 'tags', makeQuery: term => `(tags="${term}*")` }
];

export { Filters, SearchableIndexes };
