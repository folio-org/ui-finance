import { FISCAL_YEARS_API } from '../../../../common/const';

export const getFiscalYearData = (ky) => (fiscalYearId) => {
  return ky.get(`${FISCAL_YEARS_API}/${fiscalYearId}`).json();
};
