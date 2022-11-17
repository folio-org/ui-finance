import { FUNDS_API } from '@folio/stripes-acq-components';

export const getFundActiveBudget = (ky) => (fundId) => {
  return ky.get(`${FUNDS_API}/${fundId}/budget`).json();
};
