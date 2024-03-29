import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfPermission,
  stripesConnect,
} from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';

import FundBudgets from '../FundBudgets';
import {
  BUDGET_ROUTE,
  BUDGET_VIEW_ROUTE,
} from '../../../common/const';
import { BUDGET_STATUSES } from '../../../components/Budget/constants';
import { SECTIONS_FUND } from '../../constants';

export const FundCurrentBudgetContainer = ({
  budget,
  currency,
  history,
  location,
  openNewBudgetModal,
}) => {
  const openBudget = useCallback(
    (e, { id }) => {
      const path = `${BUDGET_ROUTE}${id}${BUDGET_VIEW_ROUTE}`;

      history.push({
        pathname: path,
        search: location.search,
      });
    },
    [history, location.search],
  );

  const addBudgetButton = useCallback((status, budgets) => {
    return !budgets.length
      ? (
        <IfPermission perm="finance.budgets.item.post">
          <Button
            data-test-add-current-budget-button
            onClick={() => openNewBudgetModal(status)}
          >
            <FormattedMessage id="ui-finance.budget.button.new" />
          </Button>
        </IfPermission>
      )
      : null;
  }, [openNewBudgetModal]);

  return (
    <FundBudgets
      addBudgetButton={addBudgetButton}
      budgets={budget?.id ? [budget] : []}
      budgetStatus={BUDGET_STATUSES.ACTIVE}
      currency={currency}
      labelId="ui-finance.fund.currentBudget.title"
      openBudget={openBudget}
      sectionId={SECTIONS_FUND.CURRENT_BUDGET}
    />
  );
};

FundCurrentBudgetContainer.propTypes = {
  budget: PropTypes.object,
  currency: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  openNewBudgetModal: PropTypes.func.isRequired,
};

export default stripesConnect(FundCurrentBudgetContainer);
