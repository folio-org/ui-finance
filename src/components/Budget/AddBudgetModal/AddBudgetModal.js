import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useShowToast } from '@folio/stripes-acq-components';
import { stripesConnect } from '@folio/stripes/core';

import BudgetAddModalForm from './AddBudgetModalForm';
import {
  budgetResource,
  fiscalYearsResource,
} from '../../../common/resources';
import getFiscalYearsForSelect from '../../../Utils/getFiscalYearsForSelect';
import { BUDGET_STATUSES } from '../constants';

const AddBudgetModal = ({ history, mutator, resources, onClose, fund, budgetStatus }) => {
  const showCallout = useShowToast();
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
          name: `${fund.code}-${fiscalYear.code}`,
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

  const budgetModalLabel = budgetStatus === BUDGET_STATUSES.ACTIVE
    ? <FormattedMessage id="ui-finance.fund.currentBudget.title" />
    : <FormattedMessage id="ui-finance.fund.plannedBudget.title" />;

  return (
    <BudgetAddModalForm
      initialValues={{
        budgetStatus,
      }}
      label={budgetModalLabel}
      fiscalYears={fiscalYears}
      onClose={onClose}
      onSubmit={createBudget}
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
});

AddBudgetModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  fund: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  budgetStatus: PropTypes.string,
};

export default stripesConnect(AddBudgetModal);
