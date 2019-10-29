import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  MenuSection,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  LoadingPane,
  useAccordionToggle,
  useModalToggle,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../../common/DetailsActions';
import {
  budgetsResource,
  fundResource,
  fundsResource,
  fundTypesResource,
  groupsResource,
  ledgersResource,
} from '../../../common/resources';
import { FUNDS_ROUTE } from '../../../common/const';
import ConnectionListing from '../../ConnectionListing';
import { BUDGET_STATUSES } from '../../Budget/constants';
import { SECTIONS_FUND } from '../constants';
import FundDetails from './FundDetails';
import AddBudgetModal from '../../Budget/AddBudgetModal/AddBudgetModal';

const FundDetailsContainer = ({
  history,
  match: { params },
  mutator,
  onClose,
  onEdit,
  resources,
}) => {
  useEffect(() => {
    mutator.fund.reset();
    mutator.fundType.reset();
    mutator.ledger.reset();
    mutator.allocatedFrom.reset();
    mutator.allocatedTo.reset();
    mutator.group.reset();
    mutator.budgets.reset();

    mutator.fund.GET().then(response => {
      const {
        ledgerId,
        fundTypeId,
        allocatedFromIds,
        allocatedToIds,
      } = response;

      if (fundTypeId) {
        mutator.fundType.GET({
          params: {
            query: `id==${fundTypeId}`,
          },
        });
      }

      if (ledgerId) {
        mutator.ledger.GET({
          params: {
            query: `id==${ledgerId}`,
          },
        });
      }

      if (allocatedFromIds.length) {
        mutator.allocatedFrom.GET({
          params: {
            query: allocatedFromIds.map(fundId => `id==${fundId}`).join(' or '),
          },
        });
      }

      if (allocatedToIds.length) {
        mutator.allocatedTo.GET({
          params: {
            query: allocatedToIds.map(fundId => `id==${fundId}`).join(' or '),
          },
        });
      }
    });

    mutator.group.GET();
    mutator.budgets.GET();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const showToast = useShowToast();
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const [budgetStatusModal, setBudgetStatusModal] = useState('');

  const fund = get(resources, ['fund', 'records', 0], {});
  const ledger = get(resources, ['ledger', 'records', 0], {});
  const fundType = get(resources, ['fundType', 'records', 0, 'name'], '');
  const allocatedFrom = get(resources, ['allocatedFrom', 'records'], []).map(f => f.name).join(', ');
  const allocatedTo = get(resources, ['allocatedTo', 'records'], []).map(f => f.name).join(', ');
  const budgets = get(resources, ['budgets', 'records'], []);
  const activeBudgets = budgets.filter(b => b.budgetStatus === BUDGET_STATUSES.ACTIVE);
  const plannedBudgets = budgets.filter(b => b.budgetStatus === BUDGET_STATUSES.PLANNED);
  const closedBudgets = budgets.filter(b => b.budgetStatus === BUDGET_STATUSES.CLOSED);
  const budgetColumns = ['name', 'allocated', 'unavailable', 'available'];

  const isLoading = (
    !get(resources, ['fund', 'hasLoaded']) &&
    !get(resources, ['ledger', 'hasLoaded']) &&
    !get(resources, ['allocatedFrom', 'hasLoaded']) &&
    !get(resources, ['allocatedTo', 'hasLoaded']) &&
    !get(resources, ['budgets', 'hasLoaded'])
  );

  const removeFund = useCallback(
    () => {
      mutator.fund.DELETE(fund)
        .then(() => {
          showToast('ui-finance.fund.actions.remove.success');
          history.push(FUNDS_ROUTE);
        })
        .catch(() => {
          showToast('ui-finance.fund.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, fund, mutator.fund],
  );

  const onRemove = useCallback(
    () => {
      toggleRemoveConfirmation();
      removeFund();
    },
    [removeFund, toggleRemoveConfirmation],
  );

  const renderActionMenu = useCallback(
    ({ onToggle }) => (
      <MenuSection id="fund-details-actions">
        <DetailsEditAction
          perm="finance-storage.funds.item.put"
          onEdit={onEdit}
          toggleActionMenu={onToggle}
        />
        <DetailsRemoveAction
          perm="finance-storage.funds.item.delete"
          toggleActionMenu={onToggle}
          onRemove={toggleRemoveConfirmation}
        />
      </MenuSection>
    ),
    [onEdit, toggleRemoveConfirmation],
  );

  const openBudget = useCallback(
    (e, budget) => {
      const path = `/finance/budget/${budget.id}/view`;

      history.push(path);
    },
    [history],
  );

  const addBudgetButton = useCallback((status, count) => {
    return !count && (
      <Button
        data-test-add-budget-button
        onClick={() => setBudgetStatusModal(status)}
      >
        <FormattedMessage id="ui-finance.budget.button.new" />
      </Button>
    );
  }, []);

  const lastMenu = (
    <PaneMenu>
      <Button
        marginBottom0
        buttonStyle="primary"
        onClick={onEdit}
      >
        <FormattedMessage id="ui-finance.actions.edit" />
      </Button>
    </PaneMenu>
  );

  if (isLoading) {
    return (
      <LoadingPane onClose={onClose} />
    );
  }

  return (
    <Pane
      actionMenu={renderActionMenu}
      defaultWidth="fill"
      dismissible
      id="pane-fund-details"
      lastMenu={lastMenu}
      onClose={onClose}
      paneSub={fund.code}
      paneTitle={fund.name}
    >
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>
      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
        <Accordion
          label={<FormattedMessage id="ui-finance.fund.information.title" />}
          id={SECTIONS_FUND.INFORMATION}
        >
          {fund.metadata && <ViewMetaData metadata={fund.metadata} />}
          <FundDetails
            acqUnitIds={fund.acqUnitIds}
            allocatedFrom={allocatedFrom}
            allocatedTo={allocatedTo}
            currency={ledger.currency}
            fund={fund}
            fundType={fundType}
            ledgerName={ledger.name}
          />
        </Accordion>

        <Accordion
          label={<FormattedMessage id="ui-finance.fund.currentBudget.title" />}
          displayWhenOpen={addBudgetButton(BUDGET_STATUSES.ACTIVE, activeBudgets.length)}
          id={SECTIONS_FUND.CURRENT_BUDGET}
        >
          <ConnectionListing
            items={activeBudgets}
            currency={ledger.currency}
            openItem={openBudget}
            visibleColumns={budgetColumns}
          />
        </Accordion>

        <Accordion
          label={<FormattedMessage id="ui-finance.fund.plannedBudget.title" />}
          displayWhenOpen={addBudgetButton(BUDGET_STATUSES.PLANNED, plannedBudgets.length)}
          id={SECTIONS_FUND.PLANNED_BUDGET}
        >
          <ConnectionListing
            items={plannedBudgets}
            currency={ledger.currency}
            openItem={openBudget}
            visibleColumns={budgetColumns}
          />
        </Accordion>

        <Accordion
          label={<FormattedMessage id="ui-finance.fund.previousBudgets.title" />}
          id={SECTIONS_FUND.PREVIOUS_BUDGETS}
        >
          <ConnectionListing
            items={closedBudgets}
            currency={ledger.currency}
            openItem={openBudget}
            visibleColumns={budgetColumns}
          />
        </Accordion>
      </AccordionSet>
      {budgetStatusModal && (
        <AddBudgetModal
          budgetStatus={budgetStatusModal}
          onClose={() => setBudgetStatusModal('')}
          fund={fund}
          history={history}
        />
      )}
      {isRemoveConfirmation && (
        <ConfirmationModal
          id="fund-remove-confirmation"
          confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
          heading={<FormattedMessage id="ui-finance.fund.remove.heading" />}
          message={<FormattedMessage id="ui-finance.fund.remove.message" />}
          onCancel={toggleRemoveConfirmation}
          onConfirm={onRemove}
          open
        />
      )}
    </Pane>
  );
};

FundDetailsContainer.manifest = Object.freeze({
  fund: {
    ...fundResource,
    accumulate: true,
    fetch: false,
  },
  allocatedFrom: {
    ...fundsResource,
    accumulate: true,
    fetch: false,
  },
  allocatedTo: {
    ...fundsResource,
    accumulate: true,
    fetch: false,
  },
  fundType: {
    ...fundTypesResource,
    accumulate: true,
    fetch: false,
  },
  ledger: {
    ...ledgersResource,
    accumulate: true,
    fetch: false,
  },
  group: {
    ...groupsResource,
    GET: {
      params: {
        query: 'fundId==:{id}',
      },
    },
    accumulate: true,
    fetch: false,
  },
  budgets: {
    ...budgetsResource,
    GET: {
      params: {
        query: 'fundId==:{id}',
      },
    },
    accumulate: true,
    fetch: false,
  },
  query: {},
});

FundDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FundDetailsContainer);
