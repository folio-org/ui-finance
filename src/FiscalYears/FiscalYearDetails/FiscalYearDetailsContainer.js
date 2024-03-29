import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  batchFetch,
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  fiscalYearResource,
  fiscalYearsResource,
  fundsResource,
  groupSummariesResource,
  ledgersResource,
} from '../../common/resources';
import {
  FISCAL_YEAR_ROUTE,
} from '../../common/const';
import FiscalYearDetails from './FiscalYearDetails';

const buildLedgersQueryByFYIds = (fiscalYears) => {
  const query = fiscalYears
    .map(({ id }) => `fiscalYearOneId==${id}`)
    .join(' or ');

  return query || '';
};

export const FiscalYearDetailsContainer = ({
  mutator,
  match,
  location,
  history,
  refreshList,
}) => {
  const fiscalYearId = match.params.id;
  const [fiscalYear, setFiscalYear] = useState({});
  const [funds, setFunds] = useState([]);
  const [groupSummaries, setGroupSummaries] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowCallout();

  useEffect(
    () => {
      setIsLoading(true);
      setFiscalYear({});
      setFunds([]);
      setGroupSummaries([]);
      setLedgers([]);

      const fiscalYearPromise = mutator.fiscalYear.GET();
      const groupSummariesPromise = mutator.fyGroupSummaries.GET({
        params: {
          query: `fiscalYearId==${fiscalYearId}`,
          limit: `${LIMIT_MAX}`,
        },
      });
      const fyFundsPromise = mutator.fyFunds.GET({
        params: {
          query: `budget.fiscalYearId==${fiscalYearId}`,
          limit: `${LIMIT_MAX}`,
        },
      });

      Promise.all([fiscalYearPromise, groupSummariesPromise, fyFundsPromise])
        .then(([fy, groupSummariesResponse, fyFundsResponse]) => {
          setFiscalYear(fy);
          setGroupSummaries(groupSummariesResponse);
          setFunds(fyFundsResponse);

          return fy.series
            ? mutator.fiscalYearsBySeries.GET({
              params: {
                query: `series==${fy.series}`,
                limit: `${LIMIT_MAX}`,
              },
            })
            : [];
        })
        .then(fiscalYears => {
          return batchFetch(mutator.fyLedgers, fiscalYears, buildLedgersQueryByFYIds, { fiscalYear: fiscalYearId });
        })
        .then(setLedgers)
        .catch(() => {
          showToast({ messageId: 'ui-finance.fiscalYear.actions.load.error', type: 'error' });
        })
        .finally(() => setIsLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYearId],
  );

  const closePane = useCallback(
    () => {
      history.push({
        pathname: FISCAL_YEAR_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const editFiscalYear = useCallback(
    () => {
      history.push({
        pathname: `${FISCAL_YEAR_ROUTE}/${fiscalYearId}/edit`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYearId, location.search],
  );

  const openLedger = useCallback(
    (e, ledger) => {
      const path = `/finance/ledger/${ledger.id}/view`;

      history.push(path);
    },
    [history],
  );

  const removeFiscalYear = useCallback(
    () => {
      mutator.fiscalYear.DELETE({ id: fiscalYear.id }, { silent: true })
        .then(() => {
          showToast({ messageId: 'ui-finance.fiscalYear.actions.remove.success' });
          history.replace({
            pathname: FISCAL_YEAR_ROUTE,
            search: location.search,
          });

          refreshList();
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.fiscalYear.actions.remove.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYear.id, showToast, history, location.search, refreshList],
  );

  if (isLoading) {
    return (
      <LoadingPane
        id="pane-fiscal-year-details"
        onClose={closePane}
      />
    );
  }

  return (
    <FiscalYearDetails
      fiscalYear={fiscalYear}
      groupSummaries={groupSummaries}
      funds={funds}
      onClose={closePane}
      onEdit={editFiscalYear}
      onRemove={removeFiscalYear}
      openLedger={openLedger}
      ledgers={ledgers}
    />
  );
};

FiscalYearDetailsContainer.manifest = Object.freeze({
  fiscalYear: {
    ...fiscalYearResource,
    params: {
      withFinancialSummary: true,
    },
    accumulate: true,
    fetch: false,
  },
  fyFunds: {
    ...fundsResource,
    accumulate: true,
    fetch: false,
  },
  fyGroupSummaries: groupSummariesResource,
  fyLedgers: {
    ...ledgersResource,
    accumulate: true,
    fetch: false,
  },
  fiscalYearsBySeries: {
    ...fiscalYearsResource,
    accumulate: true,
    fetch: false,
  },
});

FiscalYearDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(FiscalYearDetailsContainer));
