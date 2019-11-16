import { get } from 'lodash';

function getFiscalYearsForSelect(resources) {
  return get(resources, ['fiscalYears', 'records'], []).map(({ code, id }) => ({
    label: code,
    value: id,
  }));
}

export default getFiscalYearsForSelect;
