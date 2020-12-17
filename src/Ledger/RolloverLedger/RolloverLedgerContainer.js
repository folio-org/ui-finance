import React, { useMemo, useCallback } from 'react';
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
import {
  budgetsResource,
  fundsResource,
  fundTypesResource,
  ledgerByUrlIdResource,
  ledgerCurrentFiscalYearResource,
} from '../../common/resources';
import RolloverLedger from './RolloverLedger';
import useRolloverData from './useRolloverData';
import {
  ADD_AVAILABLE_TO,
  ORDER_TYPE,
} from '../constants';

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
    async (rolloverValues) => {
      close();
    },
    [close],
  );

  const isLoading = !resources.rolloverLedger.hasLoaded;
  const ledger = resources.rolloverLedger.records[0];
  const {
    budgets,
    currentFiscalYear,
    funds,
    fundTypesMap,
  } = useRolloverData(mutator);
  const { toFiscalYearId, toFiscalYearSeries } = location.state || {};
  const series = currentFiscalYear?.series;

  const initial = useMemo(() => {
    const initValues = {
      ledgerId: ledger?.id,
      budgetsRollover: budgets?.map(b => ({
        addAvailableTo: ADD_AVAILABLE_TO.transfer,
        fundTypeId: funds?.find(({ id }) => id === b.fundId)?.fundTypeId,
      })),
      encumbrancesRollover: Object.values(ORDER_TYPE).map((orderType) => ({ orderType })),
    };

    if (toFiscalYearId && toFiscalYearSeries === series) {
      initValues.toFiscalYearId = toFiscalYearId;
    }

    return initValues;
  }, [ledger, budgets, toFiscalYearId, toFiscalYearSeries, series, funds]);

  const goToCreateFY = useCallback(() => {
    history.push({
      pathname: `${LEDGERS_ROUTE}/${ledgerId}/rollover-create-fy`,
      search: location.search,
    });
  }, [history, ledgerId, location.search]);

  if (isLoading || !budgets || !currentFiscalYear || !funds || !fundTypesMap) {
    return (
      <LoadingView onClose={close} />
    );
  }

  return (
    <RolloverLedger
      currentFiscalYear={currentFiscalYear}
      fundTypesMap={fundTypesMap}
      goToCreateFY={goToCreateFY}
      initialValues={initial}
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
  currentBudgets: {
    ...budgetsResource,
    fetch: false,
    accumulate: true,
  },
  fundTypes: {
    ...fundTypesResource,
    accumulate: true,
    clear: true,
    fetch: false,
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
