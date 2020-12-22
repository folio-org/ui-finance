import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes/components';
import {
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  OVERALL_ROLLOVER_STATUS,
} from '../../common/const';
import {
  ledgerByUrlIdResource,
  fundsResource,
  ledgerCurrentFiscalYearResource,
  ledgerRolloverProgressResource,
} from '../../common/resources';
import { LedgerRolloverProgress } from './LedgerRolloverProgress';
import useRolloverProgressPolling from './useRolloverProgressPolling';
import LedgerDetails from './LedgerDetails';

const LedgerDetailsContainer = ({
  mutator,
  match,
  history,
  location,
}) => {
  const ledgerId = match.params.id;
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowCallout();
  const [{ ledger, funds, currentFiscalYear }, setLedgerData] = useState({});
  const [rolloverStatus, isLoadingRolloverStatus] = useRolloverProgressPolling(
    ledgerId,
    mutator.ledgerRolloverProgress,
  );

  useEffect(
    () => {
      Promise.all([
        mutator.funds.GET(),
        mutator.ledgerCurrentFiscalYear.GET()
          .catch(() => {
            showToast({ messageId: 'ui-finance.ledger.actions.load.error.noFiscalYear', type: 'error' });

            return {};
          }),
      ])
        .then(([fundsResponse, currentFiscalYearResponse]) => {
          const { id: fyID } = currentFiscalYearResponse;
          const ledgerPromise = mutator.ledgerDetails.GET({
            params: {
              fiscalYear: fyID,
              limit: `${LIMIT_MAX}`,
            },
          });

          return Promise.all([fundsResponse, ledgerPromise, currentFiscalYearResponse]);
        })
        .then(([fundsResponse, ledgerResponse, currentFiscalYearResponse]) => {
          setLedgerData({
            funds: fundsResponse,
            ledger: ledgerResponse,
            currentFiscalYear: currentFiscalYearResponse,
          });
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.ledger.actions.load.error', type: 'error' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ledgerId],
  );
  const closePane = useCallback(
    () => {
      history.push({
        pathname: LEDGERS_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const editLedger = useCallback(
    () => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${ledgerId}/edit`,
        search: location.search,
      });
    },
    [history, location.search, ledgerId],
  );

  const removeLedger = useCallback(
    () => {
      mutator.ledgerDetails.DELETE({ id: ledgerId })
        .then(() => {
          showToast({ messageId: 'ui-finance.ledger.actions.remove.success' });
          history.replace({
            pathname: LEDGERS_ROUTE,
            search: location.search,
          });
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.ledger.actions.remove.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ledgerId, showToast, history, location.search],
  );

  const rollover = useCallback(
    () => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${ledgerId}/rollover`,
        search: location.search,
      });
    },
    [history, location.search, ledgerId],
  );

  if (isLoading || isLoadingRolloverStatus) {
    return <LoadingPane onClose={closePane} />;
  }

  if (rolloverStatus.overallRolloverStatus === OVERALL_ROLLOVER_STATUS.inProgress) {
    return (
      <LedgerRolloverProgress
        fromYearCode={currentFiscalYear?.code}
        ledgerName={ledger?.name}
        onClose={closePane}
        rolloverStatus={rolloverStatus}
      />
    );
  }

  return (
    <LedgerDetails
      ledger={ledger}
      fiscalYear={currentFiscalYear}
      onClose={closePane}
      onEdit={editLedger}
      onDelete={removeLedger}
      onRollover={rollover}
      funds={funds}
    />
  );
};

LedgerDetailsContainer.manifest = Object.freeze({
  ledgerDetails: {
    ...ledgerByUrlIdResource,
    accumulate: true,
  },
  funds: {
    ...fundsResource,
    GET: {
      params: {
        query: 'ledgerId==":{id}" sortby name',
      },
    },
    accumulate: true,
  },
  ledgerCurrentFiscalYear: ledgerCurrentFiscalYearResource,
  ledgerRolloverProgress: {
    ...ledgerRolloverProgressResource,
  },
});

LedgerDetailsContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(LedgerDetailsContainer));
