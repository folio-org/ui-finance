import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingView } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  ERROR_CODE_CONFLICT,
  expenseClassesManifest,
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  budgetResource,
  fiscalYearResource,
} from '../../../common/resources';
import { FISCAL_YEARS_API } from '../../../common/const';
import BudgetForm from './BudgetForm';

const BudgetFormContainer = ({ history, mutator, location, match }) => {
  const budgetId = match.params.budgetId;
  const [budget, setBudget] = useState();
  const [fiscalYear, setFiscalYear] = useState();
  const [expenseClasses, setExpenseClasses] = useState();
  const [errorCode, setErrorCode] = useState();
  const showCallout = useShowCallout();

  useEffect(() => {
    setBudget();
    setExpenseClasses();
    setFiscalYear();

    Promise.all([mutator.budget.GET(), mutator.expenseClasses.GET()])
      .then(([budgetResponse, expenseClassesResponse]) => {
        setBudget(budgetResponse);
        setExpenseClasses(expenseClassesResponse);

        return mutator.fiscalYear.GET({
          path: `${FISCAL_YEARS_API}/${budgetResponse.fiscalYearId}`,
        });
      })
      .then(setFiscalYear)
      .catch(() => showCallout({
        messageId: 'ui-finance.budget.actions.load.error',
        type: 'error',
      }));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [budgetId, showCallout]);

  const isLoading = !(budget && fiscalYear && expenseClasses);

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
        const respErrorCode = await getErrorCodeFromResponse(e);

        if (respErrorCode === ERROR_CODE_CONFLICT) {
          setErrorCode(respErrorCode);
        } else {
          showCallout({ messageId: 'ui-finance.budget.hasNotBeenSaved', type: 'error', values: { name } });
        }
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
      expenseClasses={expenseClasses}
      fiscalYear={fiscalYear}
      initialValues={budget}
      onClose={goToBudgetView}
      onSubmit={saveBudget}
      errorCode={errorCode}
    />
  );
};

BudgetFormContainer.manifest = Object.freeze({
  budget: {
    ...budgetResource,
    fetch: false,
    accumulate: true,
  },
  fiscalYear: {
    ...fiscalYearResource,
    fetch: false,
    accumulate: true,
  },
  expenseClasses: {
    ...expenseClassesManifest,
    fetch: false,
    accumulate: true,
  },
});

BudgetFormContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(BudgetFormContainer);
