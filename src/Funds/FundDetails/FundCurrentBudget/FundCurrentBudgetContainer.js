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
import {
  useShowToast,
} from '@folio/stripes-acq-components';

import { budgetsResource } from '../../../common/resources';
import FundBudgets from '../FundBudgets';
import { BUDGET_STATUSES } from '../../../components/Budget/constants';
import { SECTIONS_FUND } from '../../constants';

const FundCurrentBudgetContainer = ({
  currency,
  currentFY,
  fundId,
  history,
  mutator,
  openNewBudgetModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    setIsLoading(true);
    setBudget([]);
    mutator.currentBudget.GET({
      params: {
        query: `fundId=${fundId} and fiscalYearId=${currentFY.id}`,
      },
    })
      .then(b => setBudget(b))
      .catch(() => {
        showToast('ui-finance.budget.actions.load.error', 'error');
      })
      .finally(() => setIsLoading(false));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [currentFY, fundId]);

  const openBudget = useCallback(
    (e, { id }) => {
      const path = `/finance/budget/${id}/view`;

      history.push(path);
    },
    [history],
  );

  const addBudgetButton = useCallback((status, count) => {
    return !count
      ? (
        <Button
          data-test-add-current-budget-button
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
        label={<FormattedMessage id="ui-finance.fund.currentBudget.title" />}
        id={SECTIONS_FUND.CURRENT_BUDGET}
      >
        <Icon icon="spinner-ellipsis" />
      </Accordion>
    );
  }

  return (
    <FundBudgets
      addBudgetButton={addBudgetButton}
      budgets={budget}
      budgetStatus={BUDGET_STATUSES.ACTIVE}
      currency={currency}
      labelId="ui-finance.fund.currentBudget.title"
      openBudget={openBudget}
      sectionId={SECTIONS_FUND.CURRENT_BUDGET}
    />
  );
};

FundCurrentBudgetContainer.manifest = Object.freeze({
  currentBudget: {
    ...budgetsResource,
    accumulate: true,
    fetch: false,
  },
});

FundCurrentBudgetContainer.propTypes = {
  currency: PropTypes.string.isRequired,
  currentFY: PropTypes.object.isRequired,
  fundId: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
  openNewBudgetModal: PropTypes.func.isRequired,
};

export default stripesConnect(FundCurrentBudgetContainer);
