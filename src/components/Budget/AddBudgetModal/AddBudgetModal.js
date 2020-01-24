import React, { useCallback, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Button,
  Icon,
  Modal,
  ModalFooter,
  Spinner,
} from '@folio/stripes/components';
import {
  baseManifest,
  useShowToast,
} from '@folio/stripes-acq-components';
import { stripesConnect } from '@folio/stripes/core';

import BudgetAddModalForm from './AddBudgetModalForm';
import {
  budgetResource,
  fiscalYearsResource,
} from '../../../common/resources';
import { LEDGERS_API } from '../../../common/const';
import { mapFiscalYearsToOptions } from '../../../common/utils';
import { BUDGET_STATUSES } from '../constants';

// `FYoptions` here is expected as an array sorted by `periodStart`
const getPlannedFYId = (currentFYId, FYoptions = []) => {
  const currentFYindex = FYoptions.findIndex(d => d.value === currentFYId);

  return currentFYindex !== -1 && FYoptions[currentFYindex + 1]
    ? FYoptions[currentFYindex + 1].value
    : '';
};

const AddBudgetModal = ({ history, mutator, onClose, fund, budgetStatus, ledgerId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentFYId, setCurrentFYId] = useState('');
  const [fiscalYearsOptions, setFiscalYearsOptions] = useState();
  const showCallout = useShowToast();
  const isCurrentBudget = budgetStatus === BUDGET_STATUSES.ACTIVE;

  useEffect(() => {
    mutator.fiscalYears.GET()
      .then(fiscalYearsResponse => setFiscalYearsOptions(mapFiscalYearsToOptions(fiscalYearsResponse)))
      .catch(() => setFiscalYearsOptions([]));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  useEffect(() => {
    setIsLoading(true);
    setCurrentFYId('');
    mutator.currentFiscalYear.GET()
      .then(({ id }) => setCurrentFYId(id))
      .catch(() => {
        showCallout('ui-finance.fiscalYear.actions.load.error', 'error');
      })
      .finally(() => setIsLoading(false));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [ledgerId]);

  const getFiscalYearOption = useCallback((fiscalYearId) => {
    return fiscalYearsOptions.find(year => year.value === fiscalYearId);
  }, [fiscalYearsOptions]);

  const _getPlannedFYId = useCallback(getPlannedFYId, [currentFYId, fiscalYearsOptions]);

  const createBudget = useCallback(
    async (formValue) => {
      try {
        const fiscalYearOption = getFiscalYearOption(formValue.fiscalYearId);
        const budget = await mutator.budget.POST({
          ...formValue,
          fundId: fund.id,
          name: `${fund.code}-${fiscalYearOption.label}`,
        });
        const { name, id } = budget;

        showCallout('ui-finance.budget.hasBeenCreated', 'success', { name, fundName: fund.name });
        const path = `/finance/budget/${id}/view`;

        history.push(path);
      } catch (e) {
        showCallout('ui-finance.budget.hasNotBeenCreated', 'error');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getFiscalYearOption, fund.id, fund.code, fund.name, history],
  );

  if (isLoading) {
    return <Spinner />;
  }

  const budgetModalLabel = isCurrentBudget
    ? <FormattedMessage id="ui-finance.fund.currentBudget.title" />
    : <FormattedMessage id="ui-finance.fund.plannedBudget.title" />;

  const plannedFYId = _getPlannedFYId(currentFYId, fiscalYearsOptions);

  if (!isCurrentBudget && !plannedFYId) {
    const footer = (
      <ModalFooter>
        <Button
          data-test-confirmation-modal-cancel-button
          buttonStyle="primary"
          id="clickable-modal-no-upcoming-fy-cancel"
          onClick={onClose}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
      </ModalFooter>
    );

    return (
      <Modal
        id="modal-no-upcoming-fy"
        label={<FormattedMessage id="ui-finance.fund.plannedBudget.noUpcomingFY.label" />}
        open
        scope="module"
        size="small"
        footer={footer}
      >
        <p style={{ margin: 0 }}>
          <FormattedMessage id="ui-finance.fund.plannedBudget.noUpcomingFY.message" />
        </p>
      </Modal>
    );
  }

  const initialValues = {
    fiscalYearId: isCurrentBudget ? currentFYId : plannedFYId,
    budgetStatus,
  };

  return (
    <BudgetAddModalForm
      initialValues={initialValues}
      label={budgetModalLabel}
      onClose={onClose}
      onSubmit={createBudget}
      disabled
    />
  );
};

AddBudgetModal.manifest = Object.freeze({
  fiscalYears: {
    ...fiscalYearsResource,
    accumulate: true,
    fetch: false,
    params: {
      query: 'cql.allRecords=1 sortby periodStart',
    },
  },
  budget: {
    ...budgetResource,
    fetch: false,
    accumulate: true,
  },
  currentFiscalYear: {
    ...baseManifest,
    path: `${LEDGERS_API}/!{ledgerId}/current-fiscal-year`,
    accumulate: true,
    fetch: false,
  },
});

AddBudgetModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  fund: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
  budgetStatus: PropTypes.string,
  ledgerId: PropTypes.string,
};

export default stripesConnect(AddBudgetModal);
