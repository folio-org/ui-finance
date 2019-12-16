import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  LEDGER_EDIT_ROUTE,
  LEDGERS_ROUTE,
} from '../../../common/const';
import {
  ledgerByUrlIdResource,
  fundsResource,
  ledgerCurrentFiscalYearResource,
} from '../../../common/resources';

import LedgerView from './LedgerView';

const LedgerViewContainer = ({
  mutator,
  match,
  history,
  onClose,
}) => {
  const ledgerId = match.params.id;
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  const [{ ledger, funds, currentFiscalYear }, setLedgerData] = useState({});

  useEffect(
    () => {
      Promise.all([
        mutator.funds.GET(),
        mutator.ledgerCurrentFiscalYear.GET()
          .catch(() => {
            showToast('ui-finance.ledger.actions.load.error.noFiscalYear', 'error');

            return {};
          }),
      ])
        .then(([fundsResponse, currentFiscalYearResponse]) => {
          const { id: fyID } = currentFiscalYearResponse;
          const ledgerPromise = mutator.ledgerDetails.GET({
            params: {
              fiscalYear: fyID,
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
          showToast('ui-finance.ledger.actions.load.error', 'error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ledgerId],
  );

  const editLedger = useCallback(
    () => {
      history.push(`${LEDGER_EDIT_ROUTE}${ledgerId}`);
    },
    [history, ledgerId],
  );

  const removeLedger = useCallback(
    () => {
      mutator.ledgerDetails.DELETE({ id: ledgerId })
        .then(() => {
          showToast('ui-finance.ledger.actions.remove.success');
          history.push(LEDGERS_ROUTE);
        })
        .catch(() => {
          showToast('ui-finance.ledger.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, ledgerId],
  );

  if (isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  return (
    <LedgerView
      ledger={ledger}
      fiscalYear={currentFiscalYear}
      onClose={onClose}
      editLedger={editLedger}
      removeLedger={removeLedger}
      funds={funds}
    />
  );
};

LedgerViewContainer.manifest = Object.freeze({
  ledgerDetails: {
    ...ledgerByUrlIdResource,
    accumulate: true,
  },
  funds: {
    ...fundsResource,
    GET: {
      params: {
        query: 'ledgerId==":{id}"',
      },
    },
    accumulate: true,
  },
  ledgerCurrentFiscalYear: ledgerCurrentFiscalYearResource,
});

LedgerViewContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(LedgerViewContainer));
