import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  LIMIT_MAX,
  LoadingPane,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  fiscalYearResource,
  fundsResource,
  groupSummariesResource,
  ledgersResource,
} from '../../common/resources';
import {
  FISCAL_YEAR_ROUTE,
} from '../../common/const';
import FiscalYearDetails from './FiscalYearDetails';

const FiscalYearDetailsContainer = ({
  mutator,
  match,
  location,
  history,
}) => {
  const fiscalYearId = match.params.id;
  const [fiscalYear, setFiscalYear] = useState({});
  const [funds, setFunds] = useState([]);
  const [groupSummaries, setGroupSummaries] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(
    () => {
      setIsLoading(true);
      setFiscalYear({});
      setFunds([]);
      setGroupSummaries([]);

      const fiscalYearPromise = mutator.fiscalYear.GET();
      const groupSummariesPromise = mutator.fyGroupSummaries.GET({
        params: {
          query: `fiscalYearId=${fiscalYearId}`,
          limit: `${LIMIT_MAX}`,
        },
      });
      const ledgersPromise = mutator.fyLedgers.GET();

      Promise.all([fiscalYearPromise, groupSummariesPromise, ledgersPromise])
        .then(([fy, groupSummariesResponse, ledgersResponse]) => {
          setFiscalYear(fy);
          setGroupSummaries(groupSummariesResponse);
          setLedgers(ledgersResponse);

          const fyFundsPromise = mutator.fyFunds.GET({
            params: {
              query: `budget.fiscalYearId=${fy.id}`,
              limit: `${LIMIT_MAX}`,
            },
          });

          return fy.id ? fyFundsPromise : [];
        })
        .then(response => setFunds(response))
        .catch(() => {
          showToast('ui-finance.fiscalYear.actions.load.error', 'error');
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
      mutator.fiscalYear.DELETE(fiscalYear)
        .then(() => {
          showToast('ui-finance.fiscalYear.actions.remove.success');
          history.replace({
            pathname: FISCAL_YEAR_ROUTE,
            search: location.search,
          });
        })
        .catch(() => {
          showToast('ui-finance.fiscalYear.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, fiscalYear],
  );

  if (isLoading) {
    return <LoadingPane onClose={closePane} />;
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
    params: {
      fiscalYear: ':{id}',
      limit: `${LIMIT_MAX}`,
      query: 'fiscalYearOneId==:{id} sortby name',
    },
  },
});

FiscalYearDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(FiscalYearDetailsContainer));
