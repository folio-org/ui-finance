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
import { useShowCallout } from '@folio/stripes-acq-components';

import { budgetsResource } from '../../../common/resources';
import FundBudgets from '../FundBudgets';
import { BUDGET_STATUSES } from '../../../components/Budget/constants';
import { SECTIONS_FUND } from '../../constants';

const FundPlannedBudgetsContainer = ({
  currency,
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
        query: `fundId=${fundId} and fiscalYear.periodStart > ${currentFY.periodStart}`,
      },
    })
      .then(setPlannedBudgets)
      .catch(() => {
        showToast({ messageId: 'ui-finance.budget.actions.load.error', type: 'error' });
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
      currency={currency}
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
});

FundPlannedBudgetsContainer.propTypes = {
  currency: PropTypes.string.isRequired,
  currentFY: PropTypes.object.isRequired,
  fundId: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  openNewBudgetModal: PropTypes.func.isRequired,
};

export default stripesConnect(FundPlannedBudgetsContainer);
