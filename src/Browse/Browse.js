import React, { useEffect } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import { TitleManager } from '@folio/stripes/core';
import {
  Icon,
  Loading,
} from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  ResetButton,
  ResultsPane,
  useFiltersToogle,
  useFiscalYears,
  useLocationFilters,
} from '@folio/stripes-acq-components';

import { BrowseActionsMenu } from './BrowseActionsMenu';
import { BrowseFilters } from './BrowseFilters';
import { BROWSE_FILTERS, BROWSE_TABS } from './constants';
import { BrowseHierarchy } from './BrowseHierarchy';
import { useBrowseHierarchy } from './hooks';
import { SearchTabControl } from './SearchTabControl';
import { getCurrentFiscalYear } from './utils';

const resetData = () => {};

const renderActionMenu = () => <BrowseActionsMenu />;

const renderMessage = ({ height }, message, icon) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      gap: '8px',
      height,
      justifyContent: 'center',
    }}
  >
    {icon}
    <span>
      {message}
    </span>
  </div>
);

const Browse = ({ history, location }) => {
  const [filters, , applyFilters, , , resetFilters] = useLocationFilters(location, history, resetData);

  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/browse/filters');

  const { fiscalYears } = useFiscalYears();
  const selectedFiscalYearId = filters[BROWSE_FILTERS.FISCAL_YEAR]?.[0];
  const selectedFiscalYear = fiscalYears.find(({ id }) => id === selectedFiscalYearId);
  const currentFiscalYearId = getCurrentFiscalYear(fiscalYears)?.id;
  const hasFiscalYearInUrl = new URLSearchParams(location.search).has(BROWSE_FILTERS.FISCAL_YEAR);

  const {
    hierarchy,
    counts,
    keysByType,
    isLoading,
  } = useBrowseHierarchy(selectedFiscalYearId);

  // The current fiscal year is selected by default
  useEffect(() => {
    if (currentFiscalYearId && !selectedFiscalYearId && !hasFiscalYearInUrl) {
      applyFilters(BROWSE_FILTERS.FISCAL_YEAR, [currentFiscalYearId]);
    }
  }, [applyFilters, currentFiscalYearId, hasFiscalYearInUrl, selectedFiscalYearId]);

  const renderContent = (size) => {
    if (!selectedFiscalYearId) {
      return renderMessage(
        size,
        <FormattedMessage id="ui-finance.browse.selectFiscalYear" />,
        <Icon icon="arrow-left" size="medium" />,
      );
    }

    if (isLoading) return renderMessage(size, <Loading />);

    if (!hierarchy.length) {
      return renderMessage(size, <FormattedMessage id="ui-finance.browse.hierarchy.noResults" />);
    }

    return (
      <div style={{ height: size.height, overflow: 'auto' }}>
        <BrowseHierarchy
          key={selectedFiscalYearId}
          fiscalYearName={selectedFiscalYear?.name}
          hierarchy={hierarchy}
          keysByType={keysByType}
        />
      </div>
    );
  };

  const hasHierarchy = Boolean(selectedFiscalYearId) && !isLoading && hierarchy.length > 0;

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
            <SearchTabControl activeTab={BROWSE_TABS.BROWSE} />

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
          subTitle={hasHierarchy
            ? <FormattedMessage id="ui-finance.browse.subtitle.withCounts" values={counts} />
            : <FormattedMessage id="ui-finance.browse.subtitle" />}
          count={hierarchy.length}
          isLoading={isLoading}
          renderActionMenu={renderActionMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
        >
          {renderContent}
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
