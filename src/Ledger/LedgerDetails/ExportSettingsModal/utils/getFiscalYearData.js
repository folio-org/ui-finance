import { FISCAL_YEARS_API } from '../../../../common/const';

export const getFiscalYearData = (ky) => (fiscalYearId) => ky.get(`${FISCAL_YEARS_API}/${fiscalYearId}`).json();
