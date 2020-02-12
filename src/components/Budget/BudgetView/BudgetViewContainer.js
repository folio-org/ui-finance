import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Button,
  Col,
  Icon,
  Paneset,
  MenuSection,
  Pane,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  budgetResource,
  fiscalYearResource,
} from '../../../common/resources';
import {
  FISCAL_YEARS_API,
  TRANSACTION_TYPES,
} from '../../../common/const';
import CreateTransaction from '../../../Transactions/CreateTransaction';

import BudgetView from './BudgetView';

const BudgetViewContainer = ({ history, match, mutator }) => {
  const budgetId = match.params.id;
  const [budget, setBudget] = useState({});
  const [fiscalYear, setFiscalYear] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () => {
      setIsLoading(true);
      setBudget({});
      setFiscalYear({});

      mutator.budgetById.GET()
        .then(budgetResponse => {
          setBudget(budgetResponse);

          return mutator.budgetFiscalYear.GET({
            path: `${FISCAL_YEARS_API}/${budgetResponse.fiscalYearId}`,
          });
        })
        .then(fyResponse => {
          setFiscalYear(fyResponse);
        })
        .finally(() => setIsLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [budgetId],
  );

  const paneTitle = get(budget, 'name');

  const [isTransferModalOpened, toggleTransferModal] = useModalToggle();
  const [isAllocateModalOpened, toggleAllocateModal] = useModalToggle();

  const editBudget = useCallback(
    () => {
      const path = `/finance/budget/${budget.id}/edit`;

      history.push(path);
    },
    [history, budget],
  );

  const goToFundDetails = useCallback(
    () => {
      const path = `/finance/fund/view/${budget.fundId}`;

      history.push(path);
    },
    [history, budget],
  );

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = ({ onToggle }) => (
    <MenuSection id="budget-actions">
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

      <Button
        buttonStyle="dropdownItem"
        data-test-add-allocation-menu-button
        onClick={() => {
          onToggle();
          toggleAllocateModal();
        }}
      >
        <FormattedMessage id="ui-finance.transaction.allocate" />
      </Button>

      <Button
        buttonStyle="dropdownItem"
        data-test-add-transfer-menu-button
        onClick={() => {
          onToggle();
          toggleTransferModal();
        }}
      >
        <FormattedMessage id="ui-finance.transaction.button.transfer" />
      </Button>
    </MenuSection>
  );

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane onClose={goToFundDetails} />
      </Paneset>
    );
  }

  return (
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
              budget={budget}
              fiscalStart={fiscalYear.periodStart}
              fiscalEnd={fiscalYear.periodEnd}
            />
          </Col>
        </Row>
      </Pane>

      {isTransferModalOpened && (
        <CreateTransaction
          fundId={budget.fundId}
          budgetName={budget.name}
          transactionType={TRANSACTION_TYPES.transfer}
          fiscalYearId={fiscalYear.id}
          onClose={toggleTransferModal}
        />
      )}

      {isAllocateModalOpened && (
        <CreateTransaction
          fundId={budget.fundId}
          budgetName={budget.name}
          transactionType={TRANSACTION_TYPES.allocation}
          fiscalYearId={fiscalYear.id}
          onClose={toggleAllocateModal}
        />
      )}
    </Paneset>
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
});

BudgetViewContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(BudgetViewContainer);
