import { useState, useEffect } from 'react';

import { batchFetch } from '@folio/stripes-acq-components';

export const useRolloverData = (mutator) => {
  const [budgets, setBudgets] = useState();
  const [currentFiscalYear, setCurrentFiscalYear] = useState();
  const [funds, setFunds] = useState();
  const [fundTypesMap, setFundTypesMap] = useState();

  useEffect(
    () => {
      Promise.all([
        mutator.funds.GET(),
        mutator.ledgerCurrentFiscalYear.GET(),
      ])
        .then(([fundsResponse, currentFiscalYearResponse]) => {
          setCurrentFiscalYear(currentFiscalYearResponse);
          setFunds(fundsResponse);

          const fundTypeIds = new Set(fundsResponse.map(({ fundTypeId }) => fundTypeId));
          const fundTypesPromise = batchFetch(mutator.fundTypes, Array.from(fundTypeIds));

          const budgetsPromise = batchFetch(mutator.currentBudgets, fundsResponse, (fundsChunk) => {
            const budgetIdsQuery = fundsChunk
              .map(({ id }) => `fundId==${id}`)
              .join(' or ');

            return budgetIdsQuery ? `(${budgetIdsQuery}) and fiscalYearId==${currentFiscalYearResponse.id}` : '';
          });

          return Promise.all([budgetsPromise, fundTypesPromise]);
        })
        .then(([budgetsResp, fundTypesResp]) => {
          setBudgets(budgetsResp);
          setFundTypesMap(new Map(fundTypesResp.map(obj => [obj.id, obj])));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    budgets,
    currentFiscalYear,
    funds,
    fundTypesMap,
  };
};
