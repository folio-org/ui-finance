import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { useLocalStorage } from '@rehooks/local-storage';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes/components';
import {
  fetchAllRecords,
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
} from '../../common/const';
import {
  fiscalYearsResource,
  fundsResource,
  ledgerByUrlIdResource,
  ledgerCurrentFiscalYearResource,
  ledgerRolloverErrorsResource,
  ledgerRolloverProgressResource,
  ledgerRolloverResource,
} from '../../common/resources';
import { LedgerRolloverProgress } from './LedgerRolloverProgress';
import useRolloverProgressPolling from './useRolloverProgressPolling';
import LedgerDetails from './LedgerDetails';

export const LedgerDetailsContainer = ({
  mutator,
  match,
  history,
  location,
  stripes,
  refreshList,
}) => {
  const ledgerId = match.params.id;
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowCallout();
  const [{ ledger, funds, currentFiscalYear }, setLedgerData] = useState({});
  const [rolloverErrors, setRolloverErrors] = useState();
  const { rolloverStatus, isLoadingRolloverStatus, rollover, rolloverToFY } = useRolloverProgressPolling({
    ledgerId,
    mutatorLedgerRolloverProgress: mutator.ledgerRolloverProgress,
    mutatorLedgerRollover: mutator.ledgerRollover,
    mutatorToFiscalYear: mutator.toFiscalYear,
  });

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

  const fromFiscalYearId = rollover?.fromFiscalYearId;
  const currentFiscalYearId = currentFiscalYear?.id;
  const rolloverId = rollover?.id;

  useEffect(
    () => {
      if (fromFiscalYearId && fromFiscalYearId === currentFiscalYearId) {
        fetchAllRecords(mutator.ledgerRolloverErrors, `ledgerRolloverId==${rolloverId}`).then(
          setRolloverErrors,
          () => {
            setRolloverErrors();
          },
        );
      }
    },
    [currentFiscalYearId, fromFiscalYearId, rolloverId],
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

          refreshList();
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.ledger.actions.remove.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ledgerId, showToast, history, location.search, refreshList],
  );

  const onBatchAllocationLogs = useCallback(() => {
    history.push({
      pathname: `${LEDGERS_ROUTE}/batch-allocations/logs`,
      state: { search: location.search }
    });
  }, [history, location.search]);

  const onRollover = useCallback(
    () => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${ledgerId}/rollover`,
        search: location.search,
      });
    },
    [history, location.search, ledgerId],
  );

  const onRolloverLogs = useCallback(
    () => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${ledgerId}/rollover-logs`,
        state: { search: location.search },
      });
    },
    [history, ledgerId, location.search],
  );

  const [isClosedProgress] = useLocalStorage(`LedgerRolloverProgress-${rollover?.id}`);

  if (isLoading || isLoadingRolloverStatus) {
    return (
      <LoadingPane
        id="pane-ledger-details"
        onClose={closePane}
      />
    );
  }

  if (
    !isClosedProgress &&
    rollover &&
    rollover.fromFiscalYearId === currentFiscalYear?.id &&
    stripes.hasPerm('ui-finance.ledger.rollover.execute')
  ) {
    return (
      <LedgerRolloverProgress
        errors={rolloverErrors}
        fromYearCode={currentFiscalYear?.code}
        ledgerName={ledger?.name}
        onClose={closePane}
        rollover={rollover}
        rolloverStatus={rolloverStatus}
        rolloverToFY={rolloverToFY}
      />
    );
  }

  return (
    <LedgerDetails
      fiscalYear={currentFiscalYear}
      funds={funds}
      ledger={ledger}
      onBatchAllocationLogs={onBatchAllocationLogs}
      onClose={closePane}
      onDelete={removeLedger}
      onEdit={editLedger}
      onRollover={onRollover}
      onRolloverLogs={onRolloverLogs}
      rolloverErrors={rolloverErrors}
      rolloverToFY={rolloverToFY}
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
  ledgerRollover: ledgerRolloverResource,
  ledgerRolloverErrors: ledgerRolloverErrorsResource,
  toFiscalYear: {
    ...fiscalYearsResource,
    accumulate: true,
    fetch: false,
  },
});

LedgerDetailsContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  stripes: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(LedgerDetailsContainer));
