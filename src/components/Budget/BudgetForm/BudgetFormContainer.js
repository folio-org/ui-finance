import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { LoadingView } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  budgetResource,
  fiscalYearResource,
} from '../../../common/resources';
import { FISCAL_YEARS_API } from '../../../common/const';
import BudgetForm from './BudgetForm';

const BudgetFormContainer = ({ history, resources, mutator, location }) => {
  const showCallout = useShowCallout();
  const budget = get(resources, ['budget', 'records', 0]);
  const isLoading = !get(resources, ['budget', 'hasLoaded']) && !get(resources, ['fiscalYear', 'hasLoaded']);

  const goToBudgetView = useCallback(
    () => {
      const path = `/finance/budget/${budget.id}/view`;

      history.push({
        pathname: path,
        search: location.search,
      });
    },
    [history, budget, location.search],
  );

  const saveBudget = useCallback(
    async (formValue) => {
      const saveMethod = formValue.id ? 'PUT' : 'POST';
      const { name } = formValue;

      try {
        await mutator.budget[saveMethod](formValue);
        showCallout({ messageId: 'ui-finance.budget.hasBeenSaved', values: { name } });
        setTimeout(() => goToBudgetView(), 0);
      } catch (e) {
        showCallout({ messageId: 'ui-finance.budget.hasNotBeenSaved', type: 'error', values: { name } });
      }
    },
    [mutator.budget, showCallout, goToBudgetView],
  );

  if (isLoading) {
    return (
      <LoadingView onClose={goToBudgetView} />
    );
  }

  return (
    <BudgetForm
      initialValues={budget}
      parentResources={resources}
      onSubmit={saveBudget}
      onClose={goToBudgetView}
    />
  );
};

BudgetFormContainer.manifest = Object.freeze({
  budget: budgetResource,
  fiscalYear: {
    ...fiscalYearResource,
    path: (queryParams, pathComponents, resourceData, logger, props) => {
      const fiscalYearId = get(props, ['resources', 'budget', 'records', 0, 'fiscalYearId']);

      return fiscalYearId ? `${FISCAL_YEARS_API}/${fiscalYearId}` : null;
    },
  },
});

BudgetFormContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(BudgetFormContainer);
