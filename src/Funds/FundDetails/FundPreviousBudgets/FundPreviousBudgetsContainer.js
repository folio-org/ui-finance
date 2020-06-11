import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Icon,
} from '@folio/stripes/components';
import { batchFetch, LIMIT_MAX, useShowCallout } from '@folio/stripes-acq-components';

import { budgetsResource, fiscalYearsResource } from '../../../common/resources';
import FundBudgets from '../FundBudgets';
import { BUDGET_STATUSES } from '../../../components/Budget/constants';
import { SECTIONS_FUND } from '../../constants';

const FundPreviousBudgetsContainer = ({
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
      .then(prevBudgets => {
        setPreviousBudgets(prevBudgets);

        return batchFetch(mutator.budgetsFiscalYears, prevBudgets.map(({ fiscalYearId }) => fiscalYearId));
      }, () => {
        showToast({ messageId: 'ui-finance.budget.actions.load.error', type: 'error' });
      })
      .then(fiscalYears => {
        setPreviousBudgets(prevBudgets => prevBudgets.map((budget) => {
          const fiscalYear = fiscalYears.find(({ id }) => id === budget.fiscalYearId);

          return {
            ...budget,
            currency: fiscalYear?.currency,
          };
        }));
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFY, fundId]);

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
  budgetsFiscalYears: {
    ...fiscalYearsResource,
    accumulate: true,
    fetch: false,
  },
});

FundPreviousBudgetsContainer.propTypes = {
  currentFY: PropTypes.object.isRequired,
  fundId: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(FundPreviousBudgetsContainer);
