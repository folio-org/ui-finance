import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  ResetButton,
  ResultsPane,
  useFiltersToogle,
  useLocationFilters,
} from '@folio/stripes-acq-components';

import { LEDGERS_ROUTE } from '../common/const';
import { useBrowseTabEnabled } from '../common/hooks';
import { SearchBrowseSegmentedControl } from './SearchBrowseSegmentedControl';
import { BrowseFilters } from './BrowseFilters';
import { BrowseActionsMenu } from './BrowseActionsMenu';
import { BROWSE_TABS, BROWSE_FILTERS } from './constants';

const resetData = () => {};

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
  const isBrowseEnabled = useBrowseTabEnabled();

  const [
    filters,
    ,
    applyFilters,
    ,
    ,
    resetFilters,
  ] = useLocationFilters(location, history, resetData);

  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/browse/filters');

  const handleTabChange = useCallback((tab) => {
    if (tab === BROWSE_TABS.SEARCH) {
      // Navigate to ledger (default search view)
      history.push(LEDGERS_ROUTE);
    }
    // If browse, stay on current page
  }, [history]);

  // Redirect to ledger if browse is not enabled
  if (!isBrowseEnabled) {
    return <Redirect to={LEDGERS_ROUTE} />;
  }

  const renderActionMenu = useCallback(() => <BrowseActionsMenu />, []);

  const selectedFiscalYear = filters[BROWSE_FILTERS.FISCAL_YEAR]?.[0];

  const resultsMessage = selectedFiscalYear ? (
    <FormattedMessage id="ui-finance.browse.noResults" />
  ) : (
    <>
      <Icon icon="arrow-left" size="medium" />
      <span>
        <FormattedMessage id="ui-finance.browse.selectFiscalYear" />
      </span>
    </>
  );

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
          subTitle={<FormattedMessage id="ui-finance.browse.subtitle" />}
          count={0}
          renderActionMenu={renderActionMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={false}
        >
          {({ height }) => (
            <div style={{ ...centeredMessageStyles, height }}>
              {resultsMessage}
            </div>
          )}
        </ResultsPane>
      </PersistedPaneset>
    </>
  );
};

Browse.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(Browse);

