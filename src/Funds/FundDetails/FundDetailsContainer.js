import React, { useCallback, useEffect, useState } from 'react';
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
  Col,
  ConfirmationModal,
  ExpandAllButton,
  LoadingPane,
  MenuSection,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  baseManifest,
  Tags,
  TagsBadge,
  useAccordionToggle,
  useModalToggle,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../common/DetailsActions';
import { fundResource } from '../../common/resources';
import {
  FUNDS_ROUTE,
  LEDGERS_API,
} from '../../common/const';
import AddBudgetModal from '../../components/Budget/AddBudgetModal';
import { SECTIONS_FUND } from '../constants';
import FundDetails from './FundDetails';
import FundCurrentBudget from './FundCurrentBudget';
import FundPlannedBudgetsContainer from './FundPlannedBudgets';
import FundPreviousBudgetsContainer from './FundPreviousBudgets';

const FundDetailsContainer = ({
  history,
  match: { params },
  location,
  mutator,
  stripes: { currency },
}) => {
  const [compositeFund, setCompositeFund] = useState({ fund: {}, groupIds: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [currentFY, setCurrentFY] = useState();

  const fetchFund = useCallback(
    () => {
      setIsLoading(true);
      mutator.fund.GET()
        .then(fundResponse => {
          setCompositeFund(fundResponse);

          return mutator.fundCurrentFY.GET({
            path: `${LEDGERS_API}/${fundResponse.fund.ledgerId}/current-fiscal-year`,
          });
        })
        .then(setCurrentFY)
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

  const closePane = useCallback(
    () => {
      history.push({
        pathname: FUNDS_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const editGroup = useCallback(
    () => {
      history.push({
        pathname: `${FUNDS_ROUTE}/edit/${params.id}`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, params.id],
  );

  const removeFund = useCallback(
    () => {
      mutator.fund.DELETE({ id: fund.id })
        .then(() => {
          showToast('ui-finance.fund.actions.remove.success');
          history.replace({
            pathname: FUNDS_ROUTE,
            search: location.search,
          });
        })
        .catch(() => {
          showToast('ui-finance.fund.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, fund.id],
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
          onEdit={editGroup}
          toggleActionMenu={onToggle}
        />
        <DetailsRemoveAction
          perm="finance.funds.item.delete"
          toggleActionMenu={onToggle}
          onRemove={toggleRemoveConfirmation}
        />
      </MenuSection>
    ),
    [editGroup, toggleRemoveConfirmation],
  );

  const openNewBudgetModal = useCallback((status) => {
    setBudgetStatusModal(status);
  }, []);

  const lastMenu = (
    <PaneMenu>
      <TagsBadge
        tagsToggle={toggleTagsPane}
        tagsQuantity={tags.length}
      />
    </PaneMenu>
  );

  if (isLoading) {
    return (
      <LoadingPane onClose={closePane} />
    );
  }

  return (
    <>
      <Pane
        actionMenu={renderActionMenu}
        defaultWidth="fill"
        dismissible
        id="pane-fund-details"
        lastMenu={lastMenu}
        onClose={closePane}
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

          {currentFY && (
            <FundCurrentBudget
              currency={currency}
              currentFY={currentFY}
              fundId={fund.id}
              history={history}
              openNewBudgetModal={openNewBudgetModal}
            />
          )}
          {currentFY && (
            <FundPlannedBudgetsContainer
              currency={currency}
              currentFY={currentFY}
              fundId={fund.id}
              history={history}
              openNewBudgetModal={openNewBudgetModal}
            />
          )}
          {currentFY && (
            <FundPreviousBudgetsContainer
              currency={currency}
              currentFY={currentFY}
              fundId={fund.id}
              history={history}
            />
          )}
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
    </>
  );
};

FundDetailsContainer.manifest = Object.freeze({
  fund: {
    ...fundResource,
    accumulate: true,
    fetch: false,
  },
  fundCurrentFY: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
});

FundDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default stripesConnect(FundDetailsContainer);
