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
  ExpandAllButton,
  MenuSection,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { LoadingPane } from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../../common/DetailsActions';
import {
  acqUnitsResource,
  budgetsResource,
  fundResource,
  fundsResource,
  fundTypesResource,
  groupsResource,
  ledgersResource,
} from '../../../common/resources';
import {
  expandAll,
  toggleSection,
} from '../../../common/utils';
import { BUDGET_STATUSES } from '../../Budget/constants';
import { SECTIONS_FUND } from '../constants';
import FundDetails from './FundDetails';
import BudgetDetails from '../BudgetDetails/BudgetDetails';

const FundDetailsContainer = ({
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
    mutator.acqUnits.reset();
    mutator.budgets.reset();

    mutator.fund.GET().then(response => {
      const {
        ledgerId,
        fundTypeId,
        allocatedFromIds,
        allocatedToIds,
        acqUnitIds,
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

      if (acqUnitIds.length) {
        mutator.acqUnits.GET({
          params: {
            query: acqUnitIds.map(id => `id==${id}`).join(' or '),
          },
        });
      }
    });

    mutator.group.GET();
    mutator.budgets.GET();
  }, [params.id]);

  const [sections, setSections] = useState({});

  const fund = get(resources, ['fund', 'records', 0], {});
  const ledger = get(resources, ['ledger', 'records', 0], {});
  const fundType = get(resources, ['fundType', 'records', 0, 'name'], '');
  const allocatedFrom = get(resources, ['allocatedFrom', 'records'], []).map(f => f.name).join(', ');
  const allocatedTo = get(resources, ['allocatedTo', 'records'], []).map(f => f.name).join(', ');
  const acqUnits = get(resources, ['acqUnits', 'records'], []).map(u => u.name).join(', ');
  const budgets = get(resources, ['budgets', 'records'], []);
  const activeBudgets = budgets.filter(b => b.budgetStatus === BUDGET_STATUSES.ACTIVE);
  const plannedBudgets = budgets.filter(b => b.budgetStatus === BUDGET_STATUSES.PLANNED);
  const closedBudgets = budgets.filter(b => b.budgetStatus === BUDGET_STATUSES.CLOSED);

  const isLoading = (
    !get(resources, ['fund', 'hasLoaded']) &&
    !get(resources, ['ledger', 'hasLoaded']) &&
    !get(resources, ['allocatedFrom', 'hasLoaded']) &&
    !get(resources, ['allocatedTo', 'hasLoaded']) &&
    !get(resources, ['acqUnits', 'hasLoaded']) &&
    !get(resources, ['budgets', 'hasLoaded'])
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
        />
      </MenuSection>
    ),
    [],
  );

  const openBudget = useCallback(
    (e, budget) => {
      const _path = `/finance/budget/${budget.id}/view`;

      mutator.query.update({ _path });
    },
    [],
  );

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
            onToggle={(allSections) => expandAll(allSections, setSections)}
          />
        </Col>
      </Row>
      <AccordionSet
        accordionStatus={sections}
        onToggle={({ id }) => toggleSection(id, setSections)}
      >
        <Accordion
          label={<FormattedMessage id="ui-finance.fund.information.title" />}
          id={SECTIONS_FUND.INFORMATION}
        >
          {fund.metadata && <ViewMetaData metadata={fund.metadata} />}
          <FundDetails
            acqUnits={acqUnits}
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
          id={SECTIONS_FUND.CURRENT_BUDGET}
        >
          <BudgetDetails
            budgets={activeBudgets}
            currency={ledger.currency}
            openBudget={openBudget}
          />
        </Accordion>

        <Accordion
          label={<FormattedMessage id="ui-finance.fund.plannedBudget.title" />}
          id={SECTIONS_FUND.PLANNED_BUDGET}
        >
          <BudgetDetails
            budgets={plannedBudgets}
            currency={ledger.currency}
            openBudget={openBudget}
          />
        </Accordion>

        <Accordion
          label={<FormattedMessage id="ui-finance.fund.previousBudgets.title" />}
          id={SECTIONS_FUND.PREVIOUS_BUDGETS}
        >
          <BudgetDetails
            budgets={closedBudgets}
            currency={ledger.currency}
            openBudget={openBudget}
          />
        </Accordion>
      </AccordionSet>
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
  acqUnits: {
    ...acqUnitsResource,
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
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FundDetailsContainer);
