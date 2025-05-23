import { chunk, uniqBy } from 'lodash/fp';

import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { LEDGERS_API } from '../../common/const';

export const getGroupLedgers = (ky) => (groupId) => {
  return ky.get(LEDGERS_API, {
    searchParams: {
      query: `groupFundFY.groupId=="${groupId}"`,
      limit: LIMIT_MAX,
    },
  }).json();
};

export const getLedgersCurrentFiscalYears = (ky) => (ledgerIds = []) => {
  return chunk(5, ledgerIds)
    .reduce(async (acc, ledgerIdsChunk) => {
      const data = await acc;

      const currentFiscalYearsSettled = await Promise.allSettled(ledgerIdsChunk.map(ledgerId => {
        return ky.get(`finance/ledgers/${ledgerId}/current-fiscal-year`).json();
      }));

      const currentFiscalYears = currentFiscalYearsSettled
        .map(({ value }) => value)
        .filter(Boolean);

      return data.concat(currentFiscalYears);
    }, Promise.resolve([]))
    .then(uniqBy('id'));
};

export const getGroupSummary = (groupSummariesMutator, groupId, fiscalYearId) => {
  if (!fiscalYearId) {
    return Promise.resolve({});
  }

  return groupSummariesMutator.GET({
    params: {
      limit: `${LIMIT_MAX}`,
      query: `(groupFundFY.groupId==${groupId} or groupId==${groupId}) and fiscalYearId==${fiscalYearId}`,
    },
  })
    .then(groupSummaries => {
      return groupSummaries[0] || {};
    });
};

// sort by periodStart (desc) and series (asc)
export const sortGroupFiscalYears = (fiscalYears = []) => [...fiscalYears].sort((a, b) => {
  return new Date(b.periodStart) - new Date(a.periodStart) || a.series.localeCompare(b.series);
});

export const filterPreviousGroupFiscalYears = (fiscalYears = [], currentFiscalYears = []) => {
  const currentFiscalYearsMap = currentFiscalYears.reduce((acc, currentFiscalYear) => {
    acc[currentFiscalYear.series] = currentFiscalYear;

    return acc;
  }, {});

  return fiscalYears.filter(fiscalYear => {
    const currentFiscalYear = currentFiscalYearsMap[fiscalYear.series];

    return !currentFiscalYear || (
      fiscalYear.id !== currentFiscalYear.id
      && new Date(fiscalYear.periodEnd) <= new Date(currentFiscalYear.periodStart)
    );
  });
};
