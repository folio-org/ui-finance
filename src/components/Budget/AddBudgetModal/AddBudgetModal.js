import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Icon } from '@folio/stripes/components';
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
import { getFiscalYearsForSelect } from '../../../common/utils';
import { BUDGET_STATUSES } from '../constants';

const AddBudgetModal = ({ history, mutator, resources, onClose, fund, budgetStatus, ledgerId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentFYId, setCurrentFYId] = useState('');
  const showCallout = useShowToast();
  const isCurrentBudget = budgetStatus === BUDGET_STATUSES.ACTIVE;

  useEffect(() => {
    if (isCurrentBudget) {
      setIsLoading(true);
      setCurrentFYId('');
      mutator.currentFiscalYear.GET()
        .then(({ id }) => setCurrentFYId(id))
        .catch(() => {
          showCallout('ui-finance.fiscalYear.actions.load.error', 'error');
        })
        .finally(() => setIsLoading(false));
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [ledgerId]);

  const fiscalYears = useMemo(() => getFiscalYearsForSelect(resources), [resources]);

  const getFiscalYear = useCallback((formValue) => {
    return fiscalYears.find(year => year.value === formValue.fiscalYearId);
  }, [fiscalYears]);

  const createBudget = useCallback(
    async (formValue) => {
      try {
        const fiscalYear = getFiscalYear(formValue);
        const budget = await mutator.budget.POST({
          ...formValue,
          fundId: fund.id,
          name: `${fund.code}-${fiscalYear.label}`,
        });
        const { name, id } = budget;

        showCallout('ui-finance.budget.hasBeenCreated', 'success', { name, fundName: fund.name });
        const path = `/finance/budget/${id}/view`;

        history.push(path);
      } catch (e) {
        showCallout('ui-finance.budget.hasNotBeenCreated', 'error');
      }
    },
    [getFiscalYear, mutator.budget, fund.id, fund.code, fund.name, showCallout, history],
  );

  const budgetModalLabel = isCurrentBudget
    ? <FormattedMessage id="ui-finance.fund.currentBudget.title" />
    : <FormattedMessage id="ui-finance.fund.plannedBudget.title" />;

  const initialValues = {
    fiscalYearId: isCurrentBudget ? currentFYId : '',
    budgetStatus,
  };

  if (isLoading) {
    return (<Icon icon="spinner-ellipsis" />);
  }

  return (
    <BudgetAddModalForm
      initialValues={initialValues}
      label={budgetModalLabel}
      onClose={onClose}
      onSubmit={createBudget}
      disabled={isCurrentBudget}
    />
  );
};

AddBudgetModal.manifest = Object.freeze({
  fiscalYears: fiscalYearsResource,
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
  resources: PropTypes.object.isRequired,
  budgetStatus: PropTypes.string,
  ledgerId: PropTypes.string,
};

export default stripesConnect(AddBudgetModal);
