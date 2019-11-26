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

import { budgetsResource } from '../../../common/resources';
import FundBudgets from './FundBudgets';

const FundBudgetsContainer = ({
  budgetStatus,
  currency,
  fundId,
  hasNewBudgetButton,
  history,
  labelId,
  mutator,
  openNewBudgetModal,
  sectionId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    mutator.budgets.GET()
      .then(b => setBudgets(b))
      .catch(() => setBudgets([]))
      .finally(() => setIsLoading(false));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [fundId]);

  const openBudget = useCallback(
    (e, budget) => {
      const path = `/finance/budget/${budget.id}/view`;

      history.push(path);
    },
    [history],
  );

  const addBudgetButton = useCallback((status, count) => {
    return hasNewBudgetButton && !count
      ? (
        <Button
          data-test-add-budget-button
          onClick={() => openNewBudgetModal(status)}
        >
          <FormattedMessage id="ui-finance.budget.button.new" />
        </Button>
      )
      : null;
  }, [hasNewBudgetButton, openNewBudgetModal]);

  if (isLoading) {
    return (
      <Accordion
        label={<FormattedMessage id={labelId} />}
        id={sectionId}
      >
        <Icon icon="spinner-ellipsis" />
      </Accordion>
    );
  }

  return (
    <FundBudgets
      addBudgetButton={addBudgetButton}
      budgets={budgets}
      budgetStatus={budgetStatus}
      currency={currency}
      labelId={labelId}
      openBudget={openBudget}
      sectionId={sectionId}
    />
  );
};

FundBudgetsContainer.manifest = Object.freeze({
  budgets: {
    ...budgetsResource,
    GET: {
      params: {
        query: 'fundId==!{fundId} and budgetStatus==!{budgetStatus}',
      },
    },
    accumulate: true,
    fetch: false,
  },
});

FundBudgetsContainer.propTypes = {
  budgetStatus: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  fundId: PropTypes.string.isRequired,
  hasNewBudgetButton: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  labelId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  openNewBudgetModal: PropTypes.func.isRequired,
  sectionId: PropTypes.string.isRequired,
};

export default stripesConnect(FundBudgetsContainer);
