import { useLocalStorage } from '@rehooks/local-storage';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  fetchAllRecords,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { LEDGERS_ROUTE } from '../../common/const';
import {
  useLedger,
  useLedgerCurrentFiscalYear,
  useLedgerFunds,
} from '../../common/hooks';
import {
  fiscalYearsResource,
  ledgerByUrlIdResource,
  ledgerRolloverErrorsResource,
  ledgerRolloverProgressResource,
  ledgerRolloverResource,
} from '../../common/resources';
import { LedgerRolloverProgress } from './LedgerRolloverProgress';
import useRolloverProgressPolling from './useRolloverProgressPolling';
import LedgerDetails from './LedgerDetails';

export const LedgerDetailsContainer = ({
  history,
  match,
  mutator,
  location,
  refreshList,
  stripes,
}) => {
  const ledgerId = match.params.id;
  const showToast = useShowCallout();

  const [selectedFiscalYear, setSelectedFiscalYear] = useState();
  const [rolloverErrors, setRolloverErrors] = useState();

  const {
    isLoading: isCurrentFiscalYearLoading,
    currentFiscalYear,
  } = useLedgerCurrentFiscalYear(ledgerId, {
    onError: () => {
      showToast({ messageId: 'ui-finance.fiscalYear.actions.load.error', type: 'error' });
    },
  });

  const {
    isLoading: isLedgerLoading,
    ledger,
  } = useLedger(ledgerId, {
    enabled: Boolean(selectedFiscalYear && currentFiscalYear),
    fiscalYearId: selectedFiscalYear,
    onError: () => {
      showToast({ messageId: 'ui-finance.ledger.actions.load.error', type: 'error' });
    },
  });

  const {
    isLoading: isFundsLoading,
    funds,
  } = useLedgerFunds(ledgerId, {
    onError: () => {
      showToast({ messageId: 'ui-finance.fund.actions.load.error', type: 'error' });
    },
  });

  const {
    isLoadingRolloverStatus,
    rollover,
    rolloverStatus,
    rolloverToFY,
  } = useRolloverProgressPolling({
    ledgerId,
    mutatorLedgerRolloverProgress: mutator.ledgerRolloverProgress,
    mutatorLedgerRollover: mutator.ledgerRollover,
    mutatorToFiscalYear: mutator.toFiscalYear,
  });

  useEffect(() => {
    // Set initial selected fiscal year
    if (!selectedFiscalYear && currentFiscalYear?.id) {
      setSelectedFiscalYear(currentFiscalYear.id);
    }
  }, [currentFiscalYear, selectedFiscalYear]);

  const fromFiscalYearId = rollover?.fromFiscalYearId;
  const currentFiscalYearId = currentFiscalYear?.id;
  const rolloverId = rollover?.id;

  useEffect(() => {
    if (fromFiscalYearId && fromFiscalYearId === currentFiscalYearId) {
      fetchAllRecords(mutator.ledgerRolloverErrors, `ledgerRolloverId==${rolloverId}`).then(
        setRolloverErrors,
        () => {
          setRolloverErrors();
        },
      );
    }
  }, [currentFiscalYearId, fromFiscalYearId, mutator.ledgerRolloverErrors, rolloverId]);

  const closePane = useCallback(() => {
    history.push({
      pathname: LEDGERS_ROUTE,
      search: location.search,
    });
  }, [history, location.search]);

  const editLedger = useCallback(() => {
    history.push({
      pathname: `${LEDGERS_ROUTE}/${ledgerId}/edit`,
      search: location.search,
    });
  }, [history, location.search, ledgerId]);

  const removeLedger = useCallback(() => {
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
  }, [mutator.ledgerDetails, ledgerId, showToast, history, location.search, refreshList]);

  const onRollover = useCallback(() => {
    history.push({
      pathname: `${LEDGERS_ROUTE}/${ledgerId}/rollover`,
      search: location.search,
    });
  }, [history, location.search, ledgerId]);

  const onRolloverLogs = useCallback(() => {
    history.push({
      pathname: `${LEDGERS_ROUTE}/${ledgerId}/rollover-logs`,
      state: { search: location.search },
    });
  }, [history, ledgerId, location.search]);

  const [isClosedProgress] = useLocalStorage(`LedgerRolloverProgress-${rollover?.id}`);

  const isLoading = (
    !ledger
    || isLedgerLoading
    || isFundsLoading
    || isCurrentFiscalYearLoading
  );

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
      onClose={closePane}
      onDelete={removeLedger}
      onEdit={editLedger}
      onRollover={onRollover}
      onRolloverLogs={onRolloverLogs}
      onSelectFiscalYear={setSelectedFiscalYear}
      rolloverErrors={rolloverErrors}
      rolloverToFY={rolloverToFY}
      selectedFiscalYear={selectedFiscalYear}
    />
  );
};

LedgerDetailsContainer.manifest = Object.freeze({
  ledgerDetails: {
    ...ledgerByUrlIdResource,
    fetch: false,
  },
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
