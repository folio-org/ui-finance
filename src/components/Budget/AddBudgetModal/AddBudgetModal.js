import React, { useCallback, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  Spinner,
} from '@folio/stripes/components';
import {
  baseManifest,
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';
import { stripesConnect } from '@folio/stripes/core';

import BudgetAddModalForm from './AddBudgetModalForm';
import {
  budgetResource,
  fiscalYearsResource,
} from '../../../common/resources';
import { LEDGERS_API } from '../../../common/const';
import { BUDGET_STATUSES } from '../constants';

// `FYoptions` here is expected as an array sorted by `periodStart`
const getPlannedFYId = (currentFYId, FYoptions = []) => {
  const currentFYindex = FYoptions.findIndex(d => d.id === currentFYId);

  return currentFYindex !== -1 && FYoptions[currentFYindex + 1]
    ? FYoptions[currentFYindex + 1].id
    : '';
};

const AddBudgetModal = ({ history, mutator, onClose, fund, budgetStatus, ledgerId, location }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentFYId, setCurrentFYId] = useState('');
  const [fiscalYearsOptions, setFiscalYearsOptions] = useState();
  const showCallout = useShowCallout();
  const isCurrentBudget = budgetStatus === BUDGET_STATUSES.ACTIVE;

  useEffect(() => {
    setIsLoading(true);
    setCurrentFYId('');
    mutator.currentFiscalYear.GET()
      .then(({ id, series }) => {
        setCurrentFYId(id);

        return series;
      })
      .catch(() => {
        showCallout({ messageId: 'ui-finance.fiscalYear.actions.load.error', type: 'error' });
      })
      .then(series => {
        return series
          ? mutator.fiscalYears.GET({
            params: {
              limit: `${LIMIT_MAX}`,
              query: `series==${series} sortby periodStart`,
            },
          })
          : [];
      })
      .then(setFiscalYearsOptions)
      .finally(() => setIsLoading(false));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [ledgerId]);

  const getFiscalYearOption = useCallback((fiscalYearId) => {
    return fiscalYearsOptions.find(year => year.id === fiscalYearId);
  }, [fiscalYearsOptions]);

  const _getPlannedFYId = useCallback(getPlannedFYId, [currentFYId, fiscalYearsOptions]);

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

  if (isLoading) {
    return <Spinner />;
  }

  const budgetModalLabel = isCurrentBudget
    ? <FormattedMessage id="ui-finance.fund.currentBudget.title" />
    : <FormattedMessage id="ui-finance.fund.plannedBudget.title" />;

  const plannedFYId = _getPlannedFYId(currentFYId, fiscalYearsOptions);

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
        label={<FormattedMessage id="ui-finance.fund.plannedBudget.noUpcomingFY.label" />}
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
    fiscalYearId: isCurrentBudget ? currentFYId : plannedFYId,
    budgetStatus,
    allowableExpenditure: 100,
    allowableEncumbrance: 100,
  };

  return (
    <BudgetAddModalForm
      initialValues={initialValues}
      label={budgetModalLabel}
      onClose={onClose}
      onSubmit={createBudget}
      disabled
    />
  );
};

AddBudgetModal.manifest = Object.freeze({
  fiscalYears: {
    ...fiscalYearsResource,
    accumulate: true,
    fetch: false,
  },
  budget: {
    ...budgetResource,
    fetch: false,
    accumulate: true,
  },
  currentFiscalYear: {
    ...baseManifest,
    path: `${LEDGERS_API}/!{ledgerId}/current-fiscal-year`,
    accumulate: true,
    fetch: false,
  },
});

AddBudgetModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  fund: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  budgetStatus: PropTypes.string,
  ledgerId: PropTypes.string,
};

export default stripesConnect(AddBudgetModal);
