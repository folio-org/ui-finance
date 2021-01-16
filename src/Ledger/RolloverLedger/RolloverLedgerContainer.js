import React, { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  ConfirmationModal,
  LoadingView,
} from '@folio/stripes/components';
import {
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
} from '../../common/const';
import {
  budgetsResource,
  fiscalYearsResource,
  fundsResource,
  fundTypesResource,
  ledgerByUrlIdResource,
  ledgerCurrentFiscalYearResource,
  ledgerRolloverProgressResource,
  ledgerRolloverResource,
} from '../../common/resources';
import RolloverLedger from './RolloverLedger';
import useRolloverData from './useRolloverData';
import {
  ADD_AVAILABLE_TO,
  ORDER_TYPE,
} from '../constants';

const RolloverLedgerContainer = ({ resources, mutator, match, history, location }) => {
  const ledgerId = match.params.id;

  const showCallout = useShowCallout();
  const [showRolloverConfirmation, toggleRolloverConfirmation] = useModalToggle();
  const [savingValues, setSavingValues] = useState();

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
      const encumbrancesRollover = rolloverValues.encumbrancesRollover.filter(d => d.rollover);

      encumbrancesRollover.forEach((d) => delete d.rollover);
      try {
        await mutator.ledgerRollover.POST({
          ...rolloverValues,
          encumbrancesRollover,
        });
      } catch (e) {
        showCallout({ messageId: 'ui-finance.ledger.rollover.errorExecute', type: 'error' });
      }
      close();
    },
    [close, showCallout],
  );

  const showConfirmation = useCallback((rolloverValues) => {
    setSavingValues(rolloverValues);
    toggleRolloverConfirmation();
  }, [toggleRolloverConfirmation]);

  const callRollover = useCallback(() => {
    return rollover(savingValues);
  }, [rollover, savingValues]);

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
      budgetsRollover: [...(budgets?.reduce((fundTypeIdsSet, budget) => {
        fundTypeIdsSet.add(funds?.find(({ id }) => id === budget.fundId)?.fundTypeId);

        return fundTypeIdsSet;
      }, new Set()) || [])].map(fundTypeId => ({
        addAvailableTo: ADD_AVAILABLE_TO.transfer,
        fundTypeId,
      })),
      encumbrancesRollover: Object.values(ORDER_TYPE).map((orderType) => ({ orderType })),
      needCloseBudgets: true,
      fromFiscalYearId: currentFiscalYear?.id,
    };

    if (toFiscalYearId && toFiscalYearSeries === series) {
      initValues.toFiscalYearId = toFiscalYearId;
    }

    return initValues;
  }, [ledger, budgets, toFiscalYearId, toFiscalYearSeries, series, funds, currentFiscalYear]);

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
    <>
      <RolloverLedger
        currentFiscalYear={currentFiscalYear}
        fundTypesMap={fundTypesMap}
        goToCreateFY={goToCreateFY}
        initialValues={initial}
        ledger={ledger}
        onCancel={close}
        onSubmit={showConfirmation}
      />
      {showRolloverConfirmation && (
        <ConfirmationModal
          id="rollover-confirmation"
          confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
          heading={<FormattedMessage id="ui-finance.ledger.rollover.confirm.heading" />}
          message={(
            <FormattedMessage
              id="ui-finance.ledger.rollover.confirm.message"
              values={{
                ledgerName: ledger?.name,
                currentFYCode: currentFiscalYear?.code,
                chosenFYCode: resources.fiscalYears.records.find(({ id }) => id === savingValues?.toFiscalYearId)?.code,
              }}
            />
          )}
          onCancel={toggleRolloverConfirmation}
          onConfirm={callRollover}
          open
        />
      )}
    </>
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
  ledgerRollover: ledgerRolloverResource,
  ledgerRolloverProgress: ledgerRolloverProgressResource,
  fiscalYears: fiscalYearsResource,
});

RolloverLedgerContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(RolloverLedgerContainer));
