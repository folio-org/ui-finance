import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

import { BROWSE_TABS } from '../constants';

const SearchBrowseSegmentedControl = ({ activeTab, onTabChange }) => {
  return (
    <ButtonGroup
      fullWidth
      data-test-search-browse-navigation
    >
      <Button
        onClick={() => onTabChange(BROWSE_TABS.SEARCH)}
        buttonStyle={activeTab === BROWSE_TABS.SEARCH ? 'primary' : 'default'}
        data-test-search-tab
      >
        <FormattedMessage id="ui-finance.browse.tab.search" />
      </Button>
      <Button
        onClick={() => onTabChange(BROWSE_TABS.BROWSE)}
        buttonStyle={activeTab === BROWSE_TABS.BROWSE ? 'primary' : 'default'}
        data-test-browse-tab
      >
        <FormattedMessage id="ui-finance.browse.tab.browse" />
      </Button>
    </ButtonGroup>
  );
};

SearchBrowseSegmentedControl.propTypes = {
  activeTab: PropTypes.oneOf(Object.values(BROWSE_TABS)).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default SearchBrowseSegmentedControl;

