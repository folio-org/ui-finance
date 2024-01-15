import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  expandAllSections,
  HasCommand,
  Icon,
  LoadingView,
  MenuSection,
  Pane,
  PaneHeader,
  Paneset,
  Row,
} from '@folio/stripes/components';
import {
  IfPermission,
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  baseManifest,
  handleKeyCommand,
  useModalToggle,
  useShowCallout,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import {
  budgetResource,
  fiscalYearResource,
} from '../../../common/resources';
import {
  BUDGETS_API,
  FISCAL_YEARS_API,
  FUNDS_ROUTE,
} from '../../../common/const';
import { ALLOCATION_TYPE } from '../../../Transactions/constants';
import CreateTransaction from '../../../Transactions/CreateTransaction';
import BudgetView from './BudgetView';
import {
  handleRecalculateTotalsErrorResponse,
  handleRemoveErrorResponse,
} from './utils';

export const BudgetViewContainer = ({ history, location, match, mutator, stripes }) => {
  const budgetId = match.params.budgetId;
  const [budget, setBudget] = useState({});
  const [fiscalYear, setFiscalYear] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [expenseClassesTotals, setExpenseClassesTotals] = useState();

  const ky = useOkapiKy();
  const intl = useIntl();
  const showCallout = useShowCallout();
  const accordionStatusRef = useRef();

  const fetchBudgetResources = useCallback(
    () => {
      setIsLoading(true);
      setBudget({});
      setExpenseClassesTotals([]);
      setFiscalYear({});

      Promise.all([mutator.budgetById.GET(), mutator.expenseClassesTotals.GET()])
        .then(([budgetResponse, expenseClassesTotalsResp]) => {
          setBudget(budgetResponse);
          setExpenseClassesTotals(expenseClassesTotalsResp);

          return mutator.budgetFiscalYear.GET({
            path: `${FISCAL_YEARS_API}/${budgetResponse.fiscalYearId}`,
          });
        })
        .then(setFiscalYear)
        .catch(() => showCallout({
          messageId: 'ui-finance.budget.actions.load.error',
          type: 'error',
        }))
        .finally(() => setIsLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [budgetId, showCallout],
  );

  useEffect(fetchBudgetResources, [budgetId]);

  const paneTitle = budget?.name;

  const [isTransferModalOpened, toggleTransferModal] = useModalToggle();
  const [isMoveAllocationModalOpened, toggleMoveAllocationModal] = useModalToggle();
  const [isIncreaseAllocationModalOpened, toggleIncreaseAllocationModal] = useModalToggle();
  const [isDecreaseAllocationModalOpened, toggleDecreaseAllocationModal] = useModalToggle();
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();

  const onRecalculateBudgetTotals = () => {
    return ky.post(`${BUDGETS_API}/${budgetId}/recalculate`)
      .json()
      .then(() => {
        showCallout({ messageId: 'ui-finance.budget.actions.recalculateTotals.success' });
      })
      .catch(async (e) => {
        await handleRecalculateTotalsErrorResponse(intl, showCallout, e);
      });
  };

  const editBudget = useCallback(
    () => {
      const path = `/finance/budget/${budget.id}/edit`;

      history.push({
        pathname: path,
        search: location.search,
      });
    },
    [history, budget, location.search],
  );

  const removeBudget = useCallback(
    () => {
      mutator.budgetById.DELETE({ id: budgetId }, { silent: true })
        .then(() => {
          showCallout({ messageId: 'ui-finance.budget.actions.remove.success', type: 'success' });
          history.replace({
            pathname: `${FUNDS_ROUTE}/view/${budget.fundId}`,
            search: location.search,
          });
        })
        .catch(async (response) => {
          await handleRemoveErrorResponse(intl, showCallout, response);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [budgetId, showCallout, history, budget.fundId, location.search, intl],
  );

  const onRemove = useCallback(
    () => {
      toggleRemoveConfirmation();
      removeBudget();
    },
    [removeBudget, toggleRemoveConfirmation],
  );

  const goToFundDetails = useCallback(
    () => {
      const path = `/finance/fund/view/${budget.fundId}`;

      history.push({
        pathname: path,
        search: location.search,
      });
    },
    [history, budget, location.search],
  );

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = ({ onToggle }) => (
    <MenuSection id="budget-actions">
      <IfPermission perm="finance.budgets.item.put">
        <Button
          buttonStyle="dropdownItem"
          data-test-edit-budget-button
          onClick={editBudget}
        >
          <Icon
            size="small"
            icon="edit"
          >
            <FormattedMessage id="ui-finance.actions.edit" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="finance.allocations.item.post">
        <Button
          buttonStyle="dropdownItem"
          data-testid="increase-allocation-button"
          onClick={() => {
            onToggle();
            toggleIncreaseAllocationModal();
          }}
        >
          <Icon
            size="small"
            icon="allocate"
          >
            <FormattedMessage id="ui-finance.transaction.increaseAllocation" />
          </Icon>
        </Button>

        <Button
          buttonStyle="dropdownItem"
          data-testid="decrease-allocation-button"
          onClick={() => {
            onToggle();
            toggleDecreaseAllocationModal();
          }}
        >
          <Icon
            size="small"
            icon="allocate"
          >
            <FormattedMessage id="ui-finance.transaction.decreaseAllocation" />
          </Icon>
        </Button>

        <Button
          buttonStyle="dropdownItem"
          data-test-move-allocation-menu-button
          data-testid="move-allocation-button"
          onClick={() => {
            onToggle();
            toggleMoveAllocationModal();
          }}
        >
          <Icon
            size="small"
            icon="allocate"
          >
            <FormattedMessage id="ui-finance.transaction.moveAllocation" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="finance.transfers.item.post">
        <Button
          buttonStyle="dropdownItem"
          data-test-add-transfer-menu-button
          onClick={() => {
            onToggle();
            toggleTransferModal();
          }}
        >
          <Icon
            size="small"
            icon="transfer"
          >
            <FormattedMessage id="ui-finance.transaction.button.transfer" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-finance.fund-budget.recalculateTotals">
        <Button
          data-testid="recalculate-budget-totals-button"
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            onRecalculateBudgetTotals();
          }}
        >
          <Icon
            size="small"
            icon="refresh"
          >
            <FormattedMessage id="ui-finance.budget.actions.recalculateBudgetTotals" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="finance.budgets.item.delete">
        <Button
          buttonStyle="dropdownItem"
          data-test-budget-remove-action
          onClick={() => {
            onToggle();
            toggleRemoveConfirmation();
          }}
        >
          <Icon
            size="small"
            icon="trash"
          >
            <FormattedMessage id="ui-finance.actions.remove" />
          </Icon>
        </Button>
      </IfPermission>
    </MenuSection>
  );

  const shortcuts = [
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-finance.fund-budget.edit')) editBudget();
      }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push(FUNDS_ROUTE)),
    },
  ];

  if (isLoading) {
    return (
      <LoadingView
        renderHeader={(props) => (
          <PaneHeader
            {...props}
            onClose={goToFundDetails}
          />
        )}
      />
    );
  }

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset>
        <Pane
          actionMenu={renderActionMenu}
          defaultWidth="fill"
          dismissible
          id="pane-budget"
          onClose={goToFundDetails}
          paneTitle={paneTitle}
        >
          <Row>
            <Col
              xs={12}
              md={8}
              mdOffset={2}
            >
              <BudgetView
                ref={accordionStatusRef}
                budget={budget}
                expenseClassesTotals={expenseClassesTotals}
                fiscalStart={fiscalYear.periodStart}
                fiscalEnd={fiscalYear.periodEnd}
                fiscalYearCurrency={fiscalYear.currency}
              />
            </Col>
          </Row>

          {isTransferModalOpened && (
            <CreateTransaction
              fundId={budget.fundId}
              budget={budget}
              budgetName={budget.name}
              transactionType={TRANSACTION_TYPES.transfer}
              fiscalYearId={fiscalYear.id}
              onClose={toggleTransferModal}
              fetchBudgetResources={fetchBudgetResources}
              fiscalYearCurrency={fiscalYear.currency}
              labelId="ui-finance.transaction.transfer.title"
            />
          )}

          {isMoveAllocationModalOpened && (
            <CreateTransaction
              fundId={budget.fundId}
              budget={budget}
              budgetName={budget.name}
              transactionType={TRANSACTION_TYPES.allocation}
              fiscalYearId={fiscalYear.id}
              onClose={toggleMoveAllocationModal}
              fetchBudgetResources={fetchBudgetResources}
              fiscalYearCurrency={fiscalYear.currency}
              labelId="ui-finance.transaction.moveAllocation"
            />
          )}

          {isIncreaseAllocationModalOpened && (
            <CreateTransaction
              fundId={budget.fundId}
              budget={budget}
              budgetName={budget.name}
              transactionType={TRANSACTION_TYPES.allocation}
              fiscalYearId={fiscalYear.id}
              onClose={toggleIncreaseAllocationModal}
              fetchBudgetResources={fetchBudgetResources}
              fiscalYearCurrency={fiscalYear.currency}
              labelId="ui-finance.transaction.increaseAllocation"
              allocationType={ALLOCATION_TYPE.increase}
            />
          )}

          {isDecreaseAllocationModalOpened && (
            <CreateTransaction
              fundId={budget.fundId}
              budget={budget}
              budgetName={budget.name}
              transactionType={TRANSACTION_TYPES.allocation}
              fiscalYearId={fiscalYear.id}
              onClose={toggleDecreaseAllocationModal}
              fetchBudgetResources={fetchBudgetResources}
              fiscalYearCurrency={fiscalYear.currency}
              labelId="ui-finance.transaction.decreaseAllocation"
              allocationType={ALLOCATION_TYPE.decrease}
            />
          )}

          {isRemoveConfirmation && (
            <ConfirmationModal
              id="budget-remove-confirmation"
              confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
              heading={<FormattedMessage id="ui-finance.budget.remove.heading" />}
              message={<FormattedMessage id="ui-finance.budget.remove.message" />}
              onCancel={toggleRemoveConfirmation}
              onConfirm={onRemove}
              open
            />
          )}
        </Pane>
      </Paneset>
    </HasCommand>
  );
};

BudgetViewContainer.manifest = Object.freeze({
  budgetById: {
    ...budgetResource,
    accumulate: true,
    fetch: false,
  },
  budgetFiscalYear: {
    ...fiscalYearResource,
    accumulate: true,
    fetch: false,
  },
  expenseClassesTotals: {
    ...baseManifest,
    path: `${BUDGETS_API}/:{budgetId}/expense-classes-totals`,
    records: 'budgetExpenseClassTotals',
    accumulate: true,
    fetch: false,
  },
});

BudgetViewContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default stripesConnect(BudgetViewContainer);
