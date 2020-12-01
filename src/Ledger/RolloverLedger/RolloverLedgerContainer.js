import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
} from '../../common/const';
import { ledgerByUrlIdResource } from '../../common/resources';
import RolloverLedger from './RolloverLedger';

const RolloverLedgerContainer = ({ resources, mutator, match, history, location }) => {
  const ledgerId = match.params.id;

  const showToast = useShowCallout();

  const close = useCallback(
    () => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${ledgerId}/view`,
        search: location.search,
      });
    },
    [history, location.search, ledgerId],
  );

  const rollover = useCallback(
    async (roloverValues) => {
      close();
    },
    [close],
  );

  const goToCreateFY = useCallback(() => {
    history.push({
      pathname: `${LEDGERS_ROUTE}/${ledgerId}/fiscalyear/create`,
      search: location.search,
    });
  }, [history, ledgerId, location.search]);

  const isLoading = !resources.rolloverLedger.hasLoaded;
  const ledger = resources.rolloverLedger.records[0];
  const fiscalYearOneId = location?.state?.fiscalYearOneId;

  if (isLoading) {
    return (
      <LoadingView onClose={close} />
    );
  }

  if (fiscalYearOneId) ledger.fiscalYearOneId = fiscalYearOneId;

  return (
    <RolloverLedger
      goToCreateFY={goToCreateFY}
      initialValues={{}}
      ledger={ledger}
      onCancel={close}
      onSubmit={rollover}
    />
  );
};

RolloverLedgerContainer.manifest = Object.freeze({
  rolloverLedger: {
    ...ledgerByUrlIdResource,
  },
});

RolloverLedgerContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(RolloverLedgerContainer));
