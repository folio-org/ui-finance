import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

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

import { BrowseActionsMenu } from './BrowseActionsMenu';
import { BrowseFilters } from './BrowseFilters';
import { BROWSE_TABS } from './constants';
import { SearchTabControl } from './SearchTabControl';

const resetData = () => {};

const renderActionMenu = () => <BrowseActionsMenu />;

const renderSelectFiscalYear = ({ height }) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      gap: '8px',
      height,
      justifyContent: 'center',
    }}
  >
    <Icon icon="arrow-left" size="medium" />
    <span>
      <FormattedMessage id="ui-finance.browse.selectFiscalYear" />
    </span>
  </div>
);

const Browse = ({ history, location }) => {
  const [filters, , applyFilters, , , resetFilters] = useLocationFilters(location, history, resetData);

  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/browse/filters');

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
          subTitle={<FormattedMessage id="ui-finance.browse.subtitle" />}
          count={0}
          renderActionMenu={renderActionMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
        >
          {renderSelectFiscalYear}
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
