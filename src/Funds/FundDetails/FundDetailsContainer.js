import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  TitleManager,
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  LoadingPane,
  MenuSection,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  baseManifest,
  handleKeyCommand,
  Tags,
  TagsBadge,
  useAcqRestrictions,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../common/DetailsActions';
import {
  budgetsResource,
  fundResource,
} from '../../common/resources';
import {
  FUNDS_ROUTE,
  LEDGERS_API,
  TRANSACTIONS_ROUTE,
} from '../../common/const';
import AddBudgetModal from '../../components/Budget/AddBudgetModal';
import { SECTIONS_FUND } from '../constants';
import { useBudgetsFiscalYears } from '../hooks';
import FundDetails from './FundDetails';
import FundCurrentBudget from './FundCurrentBudget';
import FundPlannedBudgetsContainer from './FundPlannedBudgets';
import FundPreviousBudgetsContainer from './FundPreviousBudgets';
import { FundExpenseClasses } from './FundExpenseClasses';

export const FundDetailsContainer = ({
  history,
  match: { params },
  location,
  mutator,
  stripes,
  refreshList,
}) => {
  const [compositeFund, setCompositeFund] = useState({ fund: {}, groupIds: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [currentFY, setCurrentFY] = useState();
  const [currentBudget, setCurrentBudget] = useState();
  const [plannedBudgets, setPlannedBudgets] = useState();
  const showToast = useShowCallout();
  const accordionStatusRef = useRef();
  const {
    fiscalYears: budgetsFiscalYears,
    isLoading: isFiscalYearsLoading,
  } = useBudgetsFiscalYears(currentFY);

  const { restrictions, isLoading: isRestrictionsLoading } = useAcqRestrictions(
    compositeFund.fund.id, compositeFund.fund.acqUnitIds,
  );

  const fetchFund = useCallback(
    () => {
      setIsLoading(true);
      mutator.fund.GET()
        .then(fundResponse => {
          setCompositeFund(fundResponse);

          return mutator.fundCurrentFY.GET({
            path: `${LEDGERS_API}/${fundResponse.fund.ledgerId}/current-fiscal-year`,
          });
        }, () => {
          showToast({ messageId: 'ui-finance.fund.actions.load.error', type: 'error' });

          setCompositeFund({ fund: {}, groupIds: [] });
        })
        .then(currentFYResponse => {
          setCurrentFY(currentFYResponse);

          return mutator.currentBudget.GET({
            params: {
              query: `fundId==${params.id} and fiscalYearId==${currentFYResponse.id}`,
            },
          });
        }, () => {
          showToast({ messageId: 'ui-finance.fiscalYear.actions.load.error', type: 'error' });

          setCurrentFY();
        })
        .then((budgetResponse) => setCurrentBudget(budgetResponse[0]), () => {
          showToast({ messageId: 'ui-finance.budget.actions.load.error', type: 'error' });
        })
        .finally(() => setIsLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id, showToast],
  );

  useEffect(fetchFund, [params.id]);

  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();
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

  const editFund = useCallback(
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
      mutator.fund.DELETE({ id: fund.id }, { silent: true })
        .then(() => {
          showToast({ messageId: 'ui-finance.fund.actions.remove.success' });
          history.replace({
            pathname: FUNDS_ROUTE,
            search: location.search,
          });

          refreshList();
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.fund.actions.remove.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fund.id, showToast, history, location.search, refreshList],
  );

  const onRemove = useCallback(
    async () => {
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

  const goToTransactions = useCallback(
    () => {
      history.push(`${TRANSACTIONS_ROUTE}/fund/${params.id}/budget/${currentBudget.id}`);
    },
    [params.id, currentBudget, history],
  );

  const toggleTagsPane = () => setIsTagsPaneOpened(!isTagsPaneOpened);

  const renderActionMenu = useCallback(
    ({ onToggle }) => (
      <MenuSection id="fund-details-actions">
        <DetailsEditAction
          perm="finance.funds.item.put"
          onEdit={editFund}
          toggleActionMenu={onToggle}
          disabled={isRestrictionsLoading || restrictions.protectUpdate}
        />
        {currentBudget?.id && (
          <Button
            buttonStyle="dropdownItem"
            data-test-details-view-transactions-action
            onClick={goToTransactions}
          >
            <Icon
              size="small"
              icon="eye-open"
            >
              <FormattedMessage id="ui-finance.fund.actions.viewTransactions" />
            </Icon>
          </Button>
        )}
        <DetailsRemoveAction
          perm="finance.funds.item.delete"
          toggleActionMenu={onToggle}
          onRemove={toggleRemoveConfirmation}
          disabled={isRestrictionsLoading || restrictions.protectDelete}
        />
      </MenuSection>
    ),
    [
      editFund, toggleRemoveConfirmation, currentBudget, goToTransactions,
      isRestrictionsLoading, restrictions.protectDelete, restrictions.protectUpdate,
    ],
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

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-finance.fund-budget.create')) {
          history.push(`${FUNDS_ROUTE}/create`);
        }
      }),
    },
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (
          stripes.hasPerm('ui-finance.fund-budget.edit') &&
          !isRestrictionsLoading &&
          !restrictions.protectUpdate
        ) editFund();
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
  ];

  if (isLoading || isFiscalYearsLoading) {
    return (
      <LoadingPane
        id="pane-fund-details"
        onClose={closePane}
      />
    );
  }

  return (
    <>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <TitleManager record={fund.name} />
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
          <AccordionStatus ref={accordionStatusRef}>
            <Row end="xs">
              <Col xs={12}>
                <ExpandAllButton />
              </Col>
            </Row>
            <AccordionSet>
              <Accordion
                label={<FormattedMessage id="ui-finance.fund.information.title" />}
                id={SECTIONS_FUND.INFORMATION}
              >
                <ViewMetaData metadata={fund.metadata} />
                <FundDetails
                  acqUnitIds={fund.acqUnitIds}
                  currency={stripes.currency}
                  fund={fund}
                  groupIds={compositeFund.groupIds}
                />
              </Accordion>

              {currentFY && (
                <FundCurrentBudget
                  budget={currentBudget}
                  currency={currentFY.currency}
                  history={history}
                  location={location}
                  openNewBudgetModal={openNewBudgetModal}
                />
              )}
              <FundExpenseClasses
                budgetId={currentBudget?.id}
                currency={currentFY?.currency}
              />
              {currentFY && (
                <FundPlannedBudgetsContainer
                  currentFY={currentFY}
                  fiscalYears={budgetsFiscalYears}
                  fundId={fund.id}
                  history={history}
                  location={location}
                  openNewBudgetModal={(status, budgets) => {
                    setPlannedBudgets(budgets);
                    openNewBudgetModal(status, budgets);
                  }}
                />
              )}
              {currentFY && (
                <FundPreviousBudgetsContainer
                  currentFY={currentFY}
                  fundId={fund.id}
                  history={history}
                  location={location}
                />
              )}
            </AccordionSet>
          </AccordionStatus>
          {budgetStatusModal && (
            <AddBudgetModal
              budgetStatus={budgetStatusModal}
              currentFY={currentFY}
              fiscalYears={budgetsFiscalYears}
              onClose={() => setBudgetStatusModal('')}
              fund={fund}
              history={history}
              ledgerId={fund.ledgerId}
              location={location}
              plannedBudgets={plannedBudgets}
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
      </HasCommand>
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
  currentBudget: {
    ...budgetsResource,
    fetch: false,
    accumulate: true,
  },
});

FundDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  refreshList: PropTypes.func.isRequired,
};

export default stripesConnect(FundDetailsContainer);
