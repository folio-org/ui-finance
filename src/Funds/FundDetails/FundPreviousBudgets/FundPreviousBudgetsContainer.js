import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Icon,
} from '@folio/stripes/components';
import { LIMIT_MAX, useShowCallout } from '@folio/stripes-acq-components';

import { budgetsResource } from '../../../common/resources';
import FundBudgets from '../FundBudgets';
import { BUDGET_STATUSES } from '../../../components/Budget/constants';
import { SECTIONS_FUND } from '../../constants';

const FundPreviousBudgetsContainer = ({
  currency,
  fundId,
  history,
  location,
  mutator,
  currentFY,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previousBudgets, setPreviousBudgets] = useState([]);
  const showToast = useShowCallout();

  useEffect(() => {
    setIsLoading(true);
    setPreviousBudgets([]);
    mutator.fundPreviousBudgets.GET({
      params: {
        limit: `${LIMIT_MAX}`,
        query: `fundId==${fundId} and fiscalYear.periodStart < ${currentFY.periodStart}`,
      },
    })
      .then(setPreviousBudgets)
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

  if (isLoading) {
    return (
      <Accordion
        label={<FormattedMessage id="ui-finance.fund.previousBudgets.title" />}
        id={SECTIONS_FUND.PREVIOUS_BUDGETS}
      >
        <Icon icon="spinner-ellipsis" />
      </Accordion>
    );
  }

  return (
    <FundBudgets
      budgets={previousBudgets}
      budgetStatus={BUDGET_STATUSES.CLOSED}
      currency={currency}
      labelId="ui-finance.fund.previousBudgets.title"
      openBudget={openBudget}
      sectionId={SECTIONS_FUND.PREVIOUS_BUDGETS}
    />
  );
};

FundPreviousBudgetsContainer.manifest = Object.freeze({
  fundPreviousBudgets: {
    ...budgetsResource,
    accumulate: true,
    fetch: false,
  },
});

FundPreviousBudgetsContainer.propTypes = {
  currency: PropTypes.string.isRequired,
  currentFY: PropTypes.object.isRequired,
  fundId: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(FundPreviousBudgetsContainer);
