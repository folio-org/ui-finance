import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
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
  Tags,
  TagsBadge,
  useAccordionToggle,
  useModalToggle,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../../common/DetailsActions';
import { fundResource } from '../../../common/resources';
import { FUNDS_ROUTE } from '../../../common/const';
import AddBudgetModal from '../../Budget/AddBudgetModal';
import { BUDGET_STATUSES } from '../../Budget/constants';
import { SECTIONS_FUND } from '../constants';
import FundBudgets from '../FundBudgets';
import FundCurrentBudget from '../FundCurrentBudget';
import FundDetails from './FundDetails';

const FundDetailsContainer = ({
  history,
  match: { params },
  mutator,
  onClose,
  onEdit,
  stripes: { currency },
}) => {
  const [compositeFund, setCompositeFund] = useState({ fund: {}, groupIds: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchFund = useCallback(
    () => {
      setIsLoading(true);
      mutator.fund.GET()
        .then(response => setCompositeFund(response))
        .catch(() => setCompositeFund({ fund: {}, groupIds: [] }))
        .finally(() => setIsLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id],
  );

  useEffect(fetchFund, [params.id]);

  const showToast = useShowToast();
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const [budgetStatusModal, setBudgetStatusModal] = useState('');
  const [isTagsPaneOpened, setIsTagsPaneOpened] = useState(false);

  const fund = compositeFund.fund;
  const tags = get(fund, ['tags', 'tagList'], []);

  const removeFund = useCallback(
    () => {
      mutator.fund.DELETE({ id: fund.id })
        .then(() => {
          showToast('ui-finance.fund.actions.remove.success');
          history.push(FUNDS_ROUTE);
        })
        .catch(() => {
          showToast('ui-finance.fund.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, fund.id],
  );

  const onRemove = useCallback(
    () => {
      toggleRemoveConfirmation();
      removeFund();
    },
    [removeFund, toggleRemoveConfirmation],
  );

  const updateFundTagList = async (updatedFund) => {
    await mutator.fund.PUT({
      ...compositeFund,
      fund: updatedFund,
    });
    fetchFund();
  };

  const toggleTagsPane = () => setIsTagsPaneOpened(!isTagsPaneOpened);

  const renderActionMenu = useCallback(
    ({ onToggle }) => (
      <MenuSection id="fund-details-actions">
        <DetailsEditAction
          perm="finance.funds.item.put"
          onEdit={onEdit}
          toggleActionMenu={onToggle}
        />
        <DetailsRemoveAction
          perm="finance.funds.item.delete"
          toggleActionMenu={onToggle}
          onRemove={toggleRemoveConfirmation}
        />
      </MenuSection>
    ),
    [onEdit, toggleRemoveConfirmation],
  );

  const openNewBudgetModal = useCallback((status) => {
    setBudgetStatusModal(status);
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
      <TagsBadge
        tagsToggle={toggleTagsPane}
        tagsQuantity={tags.length}
      />
    </PaneMenu>
  );

  if (isLoading) {
    return (
      <LoadingPane onClose={onClose} />
    );
  }

  return (
    <Fragment>
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
            <ViewMetaData metadata={fund.metadata} />
            <FundDetails
              acqUnitIds={fund.acqUnitIds}
              currency={currency}
              fund={fund}
              groupIds={compositeFund.groupIds}
            />
          </Accordion>

          <FundCurrentBudget
            budgetStatus={BUDGET_STATUSES.ACTIVE}
            fundId={fund.id}
            currency={currency}
            history={history}
            sectionId={SECTIONS_FUND.CURRENT_BUDGET}
            labelId="ui-finance.fund.currentBudget.title"
            hasNewBudgetButton
            openNewBudgetModal={openNewBudgetModal}
            ledgerId={fund.ledgerId}
          />

          <FundBudgets
            budgetStatus={BUDGET_STATUSES.PLANNED}
            fundId={fund.id}
            currency={currency}
            history={history}
            sectionId={SECTIONS_FUND.PLANNED_BUDGET}
            labelId="ui-finance.fund.plannedBudget.title"
            hasNewBudgetButton
            openNewBudgetModal={openNewBudgetModal}
          />

          <FundBudgets
            budgetStatus={BUDGET_STATUSES.CLOSED}
            fundId={fund.id}
            currency={currency}
            history={history}
            sectionId={SECTIONS_FUND.PREVIOUS_BUDGETS}
            labelId="ui-finance.fund.previousBudgets.title"
            hasNewBudgetButton={false}
          />
        </AccordionSet>
        {budgetStatusModal && (
          <AddBudgetModal
            budgetStatus={budgetStatusModal}
            onClose={() => setBudgetStatusModal('')}
            fund={fund}
            history={history}
            ledgerId={fund.ledgerId}
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
      {isTagsPaneOpened && (
        <Tags
          putMutator={updateFundTagList}
          recordObj={fund}
          onClose={toggleTagsPane}
        />
      )}
    </Fragment>
  );
};

FundDetailsContainer.manifest = Object.freeze({
  fund: {
    ...fundResource,
    accumulate: true,
    fetch: false,
  },
});

FundDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  stripes: stripesShape.isRequired,
};

export default stripesConnect(FundDetailsContainer);
