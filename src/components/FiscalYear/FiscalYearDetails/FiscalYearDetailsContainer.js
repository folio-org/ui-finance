import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

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
} from '../../../common/resources';
import {
  FISCAL_YEAR_ROUTE,
  FISCAL_YEAR_EDIT_ROUTE,
} from '../../../common/const';
import FiscalYearDetails from './FiscalYearDetails';

const FiscalYearDetailsContainer = ({
  mutator,
  match,
  onClose,
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

  const editFiscalYear = useCallback(
    () => {
      history.push(`${FISCAL_YEAR_EDIT_ROUTE}${fiscalYearId}`);
    },
    [history, fiscalYearId],
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
          history.push(FISCAL_YEAR_ROUTE);
        })
        .catch(() => {
          showToast('ui-finance.fiscalYear.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, fiscalYear, mutator.fiscalYear],
  );

  if (isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  return (
    <FiscalYearDetails
      fiscalYear={fiscalYear}
      groupSummaries={groupSummaries}
      funds={funds}
      onClose={onClose}
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
      query: 'cql.allRecords=1 sortby name',
    },
  },
});

FiscalYearDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRouter(FiscalYearDetailsContainer);
