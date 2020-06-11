import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Button,
  Icon,
} from '@folio/stripes/components';
import { batchFetch, LIMIT_MAX, useShowCallout } from '@folio/stripes-acq-components';

import { budgetsResource, fiscalYearsResource } from '../../../common/resources';
import FundBudgets from '../FundBudgets';
import { BUDGET_STATUSES } from '../../../components/Budget/constants';
import { SECTIONS_FUND } from '../../constants';

const FundPlannedBudgetsContainer = ({
  fundId,
  history,
  location,
  mutator,
  openNewBudgetModal,
  currentFY,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [plannedBudgets, setPlannedBudgets] = useState([]);
  const showToast = useShowCallout();

  useEffect(() => {
    setIsLoading(true);
    setPlannedBudgets([]);
    mutator.fundPlannedBudgets.GET({
      params: {
        limit: `${LIMIT_MAX}`,
        query: `fundId=${fundId} and fiscalYear.periodStart > ${currentFY.periodStart}`,
      },
    })
      .then(budgets => {
        setPlannedBudgets(budgets);

        return batchFetch(mutator.budgetsFiscalYears, budgets.map(({ fiscalYearId }) => fiscalYearId));
      }, () => {
        showToast({ messageId: 'ui-finance.budget.actions.load.error', type: 'error' });
      })
      .then(fiscalYears => {
        setPlannedBudgets(budgets => budgets.map((budget) => {
          const fiscalYear = fiscalYears.find(({ id }) => id === budget.fiscalYearId);

          return {
            ...budget,
            currency: fiscalYear?.currency,
          };
        }));
      })
      .finally(() => setIsLoading(false));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [currentFY, fundId]);

  const openBudget = useCallback(
    (e, { id }) => {
      const path = `/finance/budget/${id}/view`;

      history.push({
        pathname: path,
        search: location.search,
      });
    },
    [history, location.search],
  );

  const addBudgetButton = useCallback((status, count) => {
    return !count
      ? (
        <Button
          data-test-add-planned-budget-button
          onClick={() => openNewBudgetModal(status)}
        >
          <FormattedMessage id="ui-finance.budget.button.new" />
        </Button>
      )
      : null;
  }, [openNewBudgetModal]);

  if (isLoading) {
    return (
      <Accordion
        label={<FormattedMessage id="ui-finance.fund.plannedBudget.title" />}
        id={SECTIONS_FUND.PLANNED_BUDGET}
      >
        <Icon icon="spinner-ellipsis" />
      </Accordion>
    );
  }

  return (
    <FundBudgets
      addBudgetButton={addBudgetButton}
      budgets={plannedBudgets}
      budgetStatus={BUDGET_STATUSES.PLANNED}
      labelId="ui-finance.fund.plannedBudget.title"
      openBudget={openBudget}
      sectionId={SECTIONS_FUND.PLANNED_BUDGET}
    />
  );
};

FundPlannedBudgetsContainer.manifest = Object.freeze({
  fundPlannedBudgets: {
    ...budgetsResource,
    accumulate: true,
    fetch: false,
  },
  budgetsFiscalYears: {
    ...fiscalYearsResource,
    accumulate: true,
    fetch: false,
  },
});

FundPlannedBudgetsContainer.propTypes = {
  currentFY: PropTypes.object.isRequired,
  fundId: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  openNewBudgetModal: PropTypes.func.isRequired,
};

export default stripesConnect(FundPlannedBudgetsContainer);
