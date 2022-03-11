import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';
import { stripesConnect } from '@folio/stripes/core';

import BudgetAddModalForm from './AddBudgetModalForm';
import {
  budgetResource,
} from '../../../common/resources';
import { getPlannedFiscalYears } from '../../../Funds/utils';
import { BUDGET_STATUSES } from '../constants';

const AddBudgetModal = ({
  budgetStatus,
  currentFY,
  fiscalYears,
  fund,
  history,
  mutator,
  location,
  onClose,
  plannedBudgets,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const isCurrentBudget = budgetStatus === BUDGET_STATUSES.ACTIVE;

  const plannedFiscalYears = useMemo(
    () => getPlannedFiscalYears(fiscalYears, plannedBudgets),
    [fiscalYears, plannedBudgets],
  );

  const fiscalYearsOptions = useMemo(
    () => (
      (isCurrentBudget ? fiscalYears : plannedFiscalYears)
        .map(({ code, id }) => ({
          label: code,
          value: id,
        }))
    ),
    [
      fiscalYears,
      isCurrentBudget,
      plannedFiscalYears,
    ],
  );

  const getFiscalYearOption = useCallback((fiscalYearId) => {
    return fiscalYears.find(year => year.id === fiscalYearId);
  }, [fiscalYears]);

  const createBudget = useCallback(
    async (formValue) => {
      try {
        const fiscalYearOption = getFiscalYearOption(formValue.fiscalYearId);
        const budget = await mutator.budget.POST({
          ...formValue,
          fundId: fund.id,
          name: `${fund.code}-${fiscalYearOption.code}`,
        });
        const { name, id } = budget;

        showCallout({ messageId: 'ui-finance.budget.hasBeenCreated', values: { name, fundName: fund.name } });
        const path = `/finance/budget/${id}/view`;

        history.push({
          pathname: path,
          search: location.search,
        });
      } catch (e) {
        showCallout({ messageId: 'ui-finance.budget.hasNotBeenCreated', type: 'error' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getFiscalYearOption, fund.id, fund.code, fund.name, showCallout, history, location.search],
  );

  const budgetModalLabel = isCurrentBudget
    ? intl.formatMessage({ id: 'ui-finance.fund.currentBudget.title' })
    : intl.formatMessage({ id: 'ui-finance.fund.plannedBudget.title' });

  const plannedFYId = plannedFiscalYears[0]?.id || '';
  const modalLabel = intl.formatMessage({ id: 'ui-finance.fund.plannedBudget.noUpcomingFY.label' });

  if (!isCurrentBudget && !plannedFYId) {
    const footer = (
      <ModalFooter>
        <Button
          data-test-confirmation-modal-cancel-button
          buttonStyle="primary"
          id="clickable-modal-no-upcoming-fy-cancel"
          onClick={onClose}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
      </ModalFooter>
    );

    return (
      <Modal
        id="modal-no-upcoming-fy"
        aria-label={modalLabel}
        label={modalLabel}
        open
        scope="module"
        size="small"
        footer={footer}
      >
        <p style={{ margin: 0 }}>
          <FormattedMessage id="ui-finance.fund.plannedBudget.noUpcomingFY.message" />
        </p>
      </Modal>
    );
  }

  const initialValues = {
    fiscalYearId: isCurrentBudget ? currentFY?.id : plannedFYId,
    budgetStatus,
    allowableExpenditure: 100,
    allowableEncumbrance: 100,
  };

  return (
    <BudgetAddModalForm
      disabled={isCurrentBudget || plannedFiscalYears?.length <= 1}
      fiscalYears={fiscalYearsOptions}
      initialValues={initialValues}
      label={budgetModalLabel}
      onClose={onClose}
      onSubmit={createBudget}
    />
  );
};

AddBudgetModal.manifest = Object.freeze({
  budget: {
    ...budgetResource,
    fetch: false,
    accumulate: true,
  },
});

AddBudgetModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  currentFY: PropTypes.object.isRequired,
  fiscalYears: PropTypes.arrayOf(PropTypes.object).isRequired,
  fund: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  budgetStatus: PropTypes.string,
  plannedBudgets: PropTypes.arrayOf(PropTypes.object),
};

export default stripesConnect(AddBudgetModal);
