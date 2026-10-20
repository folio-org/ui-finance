import React, { useCallback, useMemo } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Route, withRouter, Redirect, useRouteMatch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { TitleManager, useStripes } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  ResetButton,
  ResultsPane,
  useFiltersToogle,
  useModalToggle,
  useLocationFilters,
} from '@folio/stripes-acq-components';

import {
  BROWSE_ROUTE,
  BROWSE_LEDGER_VIEW_ROUTE,
  BROWSE_GROUP_VIEW_ROUTE,
  BROWSE_FUND_VIEW_ROUTE,
  BROWSE_BUDGET_VIEW_ROUTE,
} from '../common/const';
import CheckPermission from '../common/CheckPermission';
import LedgerDetailsContainer from '../Ledger/LedgerDetails';
import { GroupDetailsContainer } from '../Groups/GroupDetails';
import { FundDetailsContainer } from '../Funds/FundDetails';
import BudgetViewContainer from '../components/Budget/BudgetView';
import { useBrowseTabEnabled, useFiscalYear } from '../common/hooks';
import { getInitialRoute } from '../components/Main/utils';
import { SearchBrowseSegmentedControl } from './SearchBrowseSegmentedControl';
import { BrowseFilters } from './BrowseFilters';
import { BrowseActionsMenu } from './BrowseActionsMenu';
import { BrowseTransfer } from './BrowseTransfer';
import { BrowseHierarchy } from './BrowseHierarchy';
import { useBrowseHierarchy } from './hooks';
import { BROWSE_TABS, BROWSE_FILTERS } from './constants';

const resetData = () => {};
const noop = () => {};

const centeredMessageStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  flexDirection: 'row',
  gap: '8px',
};

const Browse = ({ history, location }) => {
  const stripes = useStripes();
  const { isBrowseTabEnabled, isLoading: isSettingsLoading } = useBrowseTabEnabled();

  const [
    filters,,
    applyFilters,
    ,,
    resetFilters,
  ] = useLocationFilters(location, history, resetData);

  const [isTransferModalOpened, toggleTransferModal] = useModalToggle();
  const budgetMatch = useRouteMatch(BROWSE_BUDGET_VIEW_ROUTE);
  const openBudgetId = budgetMatch?.params?.budgetId;

  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/browse/filters');

  const handleTabChange = useCallback((tab) => {
    if (tab === BROWSE_TABS.SEARCH) {
      history.push(getInitialRoute(stripes));
    }
    // If browse, stay on current page
  }, [history, stripes]);

  // Get selected fiscal year ID
  const selectedFiscalYearId = filters[BROWSE_FILTERS.FISCAL_YEAR]?.[0];

  // Fetch fiscal year details to get the code
  const { fiscalYear, isLoading: isFiscalYearLoading } = useFiscalYear(selectedFiscalYearId);

  // Fetch hierarchy data
  const {
    hierarchy,
    counts,
    isLoading: isHierarchyLoading,
  } = useBrowseHierarchy(selectedFiscalYearId);

  const isLoading = isFiscalYearLoading || isHierarchyLoading;

  const renderActionMenu = useCallback(({ onToggle }) => (
    <BrowseActionsMenu
      isTransferDisabled={!openBudgetId}
      onToggle={onToggle}
      onTransfer={toggleTransferModal}
    />
  ), [openBudgetId, toggleTransferModal]);

  // Build subtitle with counts
  const subTitle = useMemo(() => {
    if (!selectedFiscalYearId || isLoading) {
      return <FormattedMessage id="ui-finance.browse.subtitle" />;
    }

    return (
      <FormattedMessage
        id="ui-finance.browse.subtitle.withCounts"
        values={{
          ledgers: counts.ledgers,
          groups: counts.groups,
          funds: counts.funds,
          budgets: counts.budgets,
          expenseClasses: counts.expenseClasses,
        }}
      />
    );
  }, [selectedFiscalYearId, isLoading, counts]);

  if (isSettingsLoading) return null;

  if (!isBrowseTabEnabled) return <Redirect to={getInitialRoute(stripes)} />;

  const renderContent = ({ height }) => {
    // Show prompt to select fiscal year if none selected
    if (!selectedFiscalYearId) {
      return (
        <div style={{ ...centeredMessageStyles, height }}>
          <Icon icon="arrow-left" size="medium" />
          <span>
            <FormattedMessage id="ui-finance.browse.selectFiscalYear" />
          </span>
        </div>
      );
    }

    // Show hierarchy
    return (
      <div style={{ height, overflow: 'auto' }}>
        <BrowseHierarchy
          hierarchy={hierarchy}
          counts={counts}
          fiscalYearCode={fiscalYear?.code || ''}
          isLoading={isLoading}
        />
      </div>
    );
  };

  return (
    <>
      <TitleManager page="Finance - Browse" />
      <PersistedPaneset
        appId="ui-finance"
        id="browse-paneset"
        data-test-browse
      >
        {isFiltersOpened && (
          <FiltersPane
            id="browse-filters-pane"
            toggleFilters={toggleFilters}
            width="350px"
          >
            <SearchBrowseSegmentedControl
              activeTab={BROWSE_TABS.BROWSE}
              onTabChange={handleTabChange}
            />

            <ResetButton
              id="reset-browse-filters"
              reset={resetFilters}
              disabled={!location.search}
            />

            <BrowseFilters
              activeFilters={filters}
              applyFilters={applyFilters}
            />
          </FiltersPane>
        )}

        <ResultsPane
          id="browse-results-pane"
          autosize
          title={<FormattedMessage id="ui-finance.browse.title" />}
          subTitle={subTitle}
          count={counts.ledgers + counts.groups + counts.funds + counts.budgets + counts.expenseClasses}
          renderActionMenu={renderActionMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
        >
          {renderContent}
        </ResultsPane>

        <Route
          path={BROWSE_LEDGER_VIEW_ROUTE}
          render={(routeProps) => (
            <CheckPermission perm="ui-finance.ledger.view">
              <LedgerDetailsContainer
                key={routeProps.match.params?.id}
                closePath={BROWSE_ROUTE}
                refreshList={noop}
              />
            </CheckPermission>
          )}
        />

        <Route
          path={BROWSE_GROUP_VIEW_ROUTE}
          render={(routeProps) => (
            <CheckPermission perm="ui-finance.group.view">
              <GroupDetailsContainer
                key={routeProps.match.params?.id}
                closePath={BROWSE_ROUTE}
                refreshList={noop}
              />
            </CheckPermission>
          )}
        />

        <Route
          path={BROWSE_FUND_VIEW_ROUTE}
          render={(routeProps) => (
            <CheckPermission perm="ui-finance.fund-budget.view">
              <FundDetailsContainer
                closePath={BROWSE_ROUTE}
                refreshList={noop}
                {...routeProps}
              />
            </CheckPermission>
          )}
        />

        {isTransferModalOpened && openBudgetId && (
          <BrowseTransfer
            budgetId={openBudgetId}
            onClose={toggleTransferModal}
          />
        )}

        <Route
          path={BROWSE_BUDGET_VIEW_ROUTE}
          render={(routeProps) => (
            <BudgetViewContainer
              closePath={BROWSE_ROUTE}
              {...routeProps}
            />
          )}
        />
      </PersistedPaneset>
    </>
  );
};

Browse.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(Browse);
