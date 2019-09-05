import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useShowToast } from '@folio/stripes-acq-components';
import { stripesConnect } from '@folio/stripes/core';

import BudgetAddModalForm from './BudgetAddModalForm';
import {
  budgetResource,
  fiscalYearsResource
} from '../../../common/resources';
import getFiscalYearsForSelect from '../../../Utils/getFiscalYearsForSelect';
import { BUDGET_STATUSES } from '../../Budget/constants';


const BudgetAddModal = ({ history, mutator, resources, onClose, fund, budgetStatus }) => {
  const showCallout = useShowToast();
  const fiscalYears = getFiscalYearsForSelect(resources);

  const createBudget = useCallback(
    async (formValue) => {
      try {
        const fiscalYear = fiscalYears.find(year => year.value === formValue.fiscalYearId);
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
    [history, fiscalYears, fund, mutator]
  );

  const BudgetModalLabel = budgetStatus === BUDGET_STATUSES.ACTIVE
    ? <FormattedMessage id="ui-finance.fund.currentBudget.title" />
    : <FormattedMessage id="ui-finance.fund.planedBudget.title" />;

  return (
    <BudgetAddModalForm
      initialValues={{
        budgetStatus,
      }}
      label={BudgetModalLabel}
      fiscalYears={fiscalYears}
      onClose={onClose}
      onSubmit={createBudget}
    />
  );
};

BudgetAddModal.manifest = Object.freeze({
  fiscalYears: fiscalYearsResource,
  budget: {
    ...budgetResource,
    fetch: false,
    accumulate: true,
  }
});

BudgetAddModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  fund: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  budgetStatus: PropTypes.string,
};

export default stripesConnect(BudgetAddModal);
