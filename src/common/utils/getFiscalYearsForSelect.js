import { get } from 'lodash';

export function mapFiscalYearsToOptions(fiscalYears) {
  return fiscalYears
    ? fiscalYears.map(({ code, id }) => ({
      label: code,
      value: id,
    }))
    : [];
}

export function getFiscalYearsForSelect(resources) {
  return mapFiscalYearsToOptions(get(resources, ['fiscalYears', 'records'], []));
}
