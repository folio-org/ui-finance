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
  baseManifest,
  useShowToast,
} from '@folio/stripes-acq-components';

import { LEDGERS_API } from '../../../common/const';
import { budgetsResource } from '../../../common/resources';
import FundBudgets from '../FundBudgets/FundBudgets';

const FundCurrentBudgetContainer = ({
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
  const [budget, setBudget] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    setIsLoading(true);
    setBudget([]);
    mutator.currentFY.GET()
      .then(({ id }) => {
        const currentBudgetPromise = mutator.currentBudget.GET({
          params: {
            query: `fundId=${fundId} and fiscalYearId=${id}`,
          },
        });

        return id ? currentBudgetPromise : [];
      })
      .then(b => setBudget(b))
      .catch(() => {
        showToast('ui-finance.budget.actions.load.error', 'error');
      })
      .finally(() => setIsLoading(false));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [fundId]);

  const openBudget = useCallback(
    (e, { id }) => {
      const path = `/finance/budget/${id}/view`;

      history.push(path);
    },
    [history],
  );

  const addBudgetButton = useCallback((status, count) => {
    return hasNewBudgetButton && !count
      ? (
        <Button
          data-test-add-current-budget-button
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
      budgets={budget}
      budgetStatus={budgetStatus}
      currency={currency}
      labelId={labelId}
      openBudget={openBudget}
      sectionId={sectionId}
    />
  );
};

FundCurrentBudgetContainer.manifest = Object.freeze({
  currentBudget: {
    ...budgetsResource,
    accumulate: true,
    fetch: false,
  },
  currentFY: {
    ...baseManifest,
    path: `${LEDGERS_API}/!{ledgerId}/current-fiscal-year`,
    accumulate: true,
    fetch: false,
  },
});

FundCurrentBudgetContainer.propTypes = {
  budgetStatus: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  fundId: PropTypes.string.isRequired,
  hasNewBudgetButton: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  labelId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  openNewBudgetModal: PropTypes.func.isRequired,
  sectionId: PropTypes.string.isRequired,
  // ledgerId prop is used in manifest
  // eslint-disable-next-line react/no-unused-prop-types
  ledgerId: PropTypes.string.isRequired,
};

export default stripesConnect(FundCurrentBudgetContainer);
