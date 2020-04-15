import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes/components';
import {
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
} from '../../common/const';
import {
  ledgerByUrlIdResource,
  fundsResource,
  ledgerCurrentFiscalYearResource,
} from '../../common/resources';

import LedgerDetails from './LedgerDetails';

const LedgerDetailsContainer = ({
  mutator,
  match,
  history,
  location,
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
          showToast('ui-finance.ledger.actions.remove.success');
          history.replace({
            pathname: LEDGERS_ROUTE,
            search: location.search,
          });
        })
        .catch(() => {
          showToast('ui-finance.ledger.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, ledgerId],
  );

  if (isLoading) {
    return <LoadingPane onClose={closePane} />;
  }

  return (
    <LedgerDetails
      ledger={ledger}
      fiscalYear={currentFiscalYear}
      onClose={closePane}
      onEdit={editLedger}
      onDelete={removeLedger}
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
});

LedgerDetailsContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(LedgerDetailsContainer));
