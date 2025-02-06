import { FISCAL_YEARS_API } from '../../../../const';

export const resolveFiscalYearId = (httpClient) => async (parsed) => {
  const fiscalYearCode = parsed.find(({ fiscalYear }) => Boolean(fiscalYear))?.fiscalYear;
  const searchParams = {
    query: `(code==${fiscalYearCode})`,
    limit: 1,
  };

  const response = await httpClient.get(FISCAL_YEARS_API, { searchParams }).json();

  return response.fiscalYears[0]?.id;
};
