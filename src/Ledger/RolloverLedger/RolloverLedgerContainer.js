import React, { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ConfirmationModal,
  LoadingView,
} from '@folio/stripes/components';
import {
  INVOICES_API,
  INVOICE_STATUS,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  LEDGER_ROLLOVER_TYPES,
} from '../../common/const';
import {
  budgetsResource,
  fundsResource,
  fundTypesResource,
  ledgerByUrlIdResource,
  ledgerCurrentFiscalYearResource,
  ledgerRolloverProgressResource,
  ledgerRolloverResource,
} from '../../common/resources';
import RolloverLedger from './RolloverLedger';
import { UnpaidInvoiceListModal } from './UnpaidInvoiceListModal';
import {
  useRolloverData,
  useRolloverErrorHandler,
  useRolloverFiscalYears,
} from './hooks';
import {
  ADD_AVAILABLE_TO,
  ORDER_TYPE,
} from '../constants';

const ifRolloverPreview = (ledger) => {
  return ledger.rolloverType === LEDGER_ROLLOVER_TYPES.preview;
};

export const RolloverLedgerContainer = ({ resources, mutator, match, history, location, stripes }) => {
  const ky = useOkapiKy();
  const ledgerId = match.params.id;

  const showCallout = useShowCallout();
  const [showRolloverConfirmation, toggleRolloverConfirmation] = useModalToggle();
  const [showTestRolloverConfirmation, toggleTestRolloverConfirmation] = useModalToggle();
  const [showUnpaidInvoiceList, toggleUnpaidInvoiceList] = useModalToggle();
  const [savingValues, setSavingValues] = useState();
  const {
    budgets,
    currentFiscalYear,
    funds,
    fundTypesMap,
  } = useRolloverData(mutator);

  const isLoading = !resources.rolloverLedger.hasLoaded;
  const ledger = resources.rolloverLedger.records[0];
  const { toFiscalYearId, toFiscalYearSeries } = location.state || {};
  const series = currentFiscalYear?.series;

  const handleRolloverErrors = useRolloverErrorHandler({ ledger, currentFiscalYear });

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

      return mutator.ledgerRollover.POST({
        ...rolloverValues,
        encumbrancesRollover,
      });
    },
    [mutator.ledgerRollover],
  );

  const testRollover = useCallback(
    (rolloverValues) => {
      return rollover(rolloverValues)
        .then(() => showCallout({
          messageId: 'ui-finance.ledger.rolloverTest.start.success',
          values: { ledgerName: ledger?.name },
        }));
    },
    [ledger, rollover, showCallout],
  );

  const showConfirmation = useCallback(async (rolloverValues) => {
    setSavingValues(rolloverValues);

    const fyQuery = `metadata.createdDate>=${currentFiscalYear?.periodStart} and metadata.createdDate<=${currentFiscalYear?.periodEnd}`;
    const invoiceStatuses = [INVOICE_STATUS.open, INVOICE_STATUS.approved, INVOICE_STATUS.reviewed];
    const query = invoiceStatuses.map(status => `(status=="${status}" and ${fyQuery})`).join(' or ');
    const hasUnpaidInvoices = await ky.get(INVOICES_API, { searchParams: {
      limit: 1,
      query,
    } }).json().then(({ totalRecords }) => Boolean(totalRecords)).catch(() => false);

    const toggleConfirmationModal = rolloverValues?.isPreview
      ? toggleTestRolloverConfirmation
      : toggleRolloverConfirmation;

    return hasUnpaidInvoices ? toggleUnpaidInvoiceList() : toggleConfirmationModal();
  }, [toggleTestRolloverConfirmation, toggleRolloverConfirmation, toggleUnpaidInvoiceList, currentFiscalYear, ky]);

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
      restrictEncumbrance: true,
      restrictExpenditures: true,
    };

    if (toFiscalYearId && toFiscalYearSeries === series) {
      initValues.toFiscalYearId = toFiscalYearId;
    }

    return initValues;
  }, [ledger, budgets, toFiscalYearId, toFiscalYearSeries, series, funds, currentFiscalYear]);

  const callRollover = useCallback(() => {
    const rolloverCb = ifRolloverPreview(savingValues) ? testRollover : rollover;

    return rolloverCb(savingValues)
      .catch(handleRolloverErrors)
      .finally(close);
  }, [
    close,
    handleRolloverErrors,
    rollover,
    savingValues,
    testRollover,
  ]);

  const goToCreateFY = useCallback(() => {
    history.push({
      pathname: `${LEDGERS_ROUTE}/${ledgerId}/rollover-create-fy`,
      search: location.search,
    });
  }, [history, ledgerId, location.search]);

  const { fiscalYears } = useRolloverFiscalYears(series);

  const toggleConfirmation = useCallback(() => {
    toggleUnpaidInvoiceList();

    return savingValues?.isPreview ? toggleTestRolloverConfirmation() : toggleRolloverConfirmation();
  }, [savingValues, toggleTestRolloverConfirmation, toggleRolloverConfirmation, toggleUnpaidInvoiceList]);

  if (isLoading || !budgets || !currentFiscalYear || !funds || !fundTypesMap) {
    return (
      <LoadingView onClose={close} />
    );
  }

  return (
    <>
      <RolloverLedger
        currentFiscalYear={currentFiscalYear}
        fiscalYears={fiscalYears}
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
          confirmLabel={<FormattedMessage id="ui-finance.ledger.rollover.confirm.btn" />}
          heading={<FormattedMessage id="ui-finance.ledger.rollover.confirm.heading" />}
          message={(
            <FormattedMessage
              id="ui-finance.ledger.rollover.confirm.message"
              values={{
                ledgerName: ledger?.name,
                currentFYCode: currentFiscalYear?.code,
                chosenFYCode: fiscalYears?.find(({ id }) => id === savingValues?.toFiscalYearId)?.code,
              }}
            />
          )}
          onCancel={toggleRolloverConfirmation}
          onConfirm={() => {
            toggleRolloverConfirmation();
            callRollover();
          }}
          open
        />
      )}
      {showTestRolloverConfirmation && (
        <ConfirmationModal
          id="test-rollover-confirmation"
          confirmLabel={<FormattedMessage id="ui-finance.ledger.rollover.confirm.btn" />}
          heading={<FormattedMessage id="ui-finance.ledger.rolloverTest.confirm.heading" />}
          message={(
            <FormattedMessage
              id="ui-finance.ledger.rolloverTest.confirm.message"
              values={{ email: stripes.user?.user?.email }}
            />
          )}
          onCancel={toggleTestRolloverConfirmation}
          onConfirm={() => {
            toggleTestRolloverConfirmation();
            callRollover();
          }}
          open
        />
      )}
      {showUnpaidInvoiceList && (
        <UnpaidInvoiceListModal
          fiscalYear={currentFiscalYear}
          onContinue={toggleConfirmation}
          onCancel={toggleUnpaidInvoiceList}
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
});

RolloverLedgerContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(RolloverLedgerContainer));
