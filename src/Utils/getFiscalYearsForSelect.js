import { get } from 'lodash';

export default (resources) => get(resources, ['fiscalYears', 'records'], []).map(({ name, code, id }) => ({
  label: code,
  value: id,
  code,
}));
