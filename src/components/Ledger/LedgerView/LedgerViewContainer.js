import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import moment from 'moment';

import { stripesConnect } from '@folio/stripes/core';
import {
  DATE_FORMAT,
  LoadingPane,
} from '@folio/stripes-acq-components';

import {
  LEDGER_EDIT_ROUTE,
  LEDGERS_ROUTE,
} from '../../../common/const';
import {
  ledgerByUrlIdResource,
  fiscalYearsResource,
  fundsResource,
} from '../../../common/resources';

import LedgerView from './LedgerView';

const LedgerViewContainer = ({
  mutator,
  resources,
  match,
  history,
  onClose,
}) => {
  const ledgerId = match.params.id;
  const ledger = get(resources, ['ledgerDetails', 'records', '0']);

  useEffect(
    () => {
      mutator.ledgerDetails.reset();
      mutator.currentFiscalYears.reset();
      mutator.ledgerDetails.GET();
      mutator.currentFiscalYears.GET();
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
      mutator.ledgerDetails.DELETE(ledger)
        .then(() => history.push(LEDGERS_ROUTE));
    },
    [history, ledger, mutator.ledgerDetails],
  );

  const isLoading = !(
    get(resources, ['ledgerDetails', 'hasLoaded']) &&
    get(resources, ['funds', 'hasLoaded']) &&
    get(resources, ['currentFiscalYears', 'hasLoaded'])
  );

  if (isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  const fiscalYears = get(resources, ['currentFiscalYears', 'records'], []);
  const fiscalYear = fiscalYears.map(({ code: fyCode }) => fyCode).join(', ');
  const funds = get(resources, ['funds', 'records'], []);

  return (
    <LedgerView
      ledger={ledger}
      fiscalYear={fiscalYear}
      fiscalYears={fiscalYears}
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
        query: 'query=(ledgerId=":{id}")'
      }
    }
  },
  currentFiscalYears: {
    ...fiscalYearsResource,
    accumulate: true,
    GET: {
      params: {
        query: () => {
          const currentDate = moment.utc().format(DATE_FORMAT);

          return `(periodEnd>=${currentDate} and periodStart<=${currentDate})`;
        },
      },
    },
  },
});

LedgerViewContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(LedgerViewContainer));
